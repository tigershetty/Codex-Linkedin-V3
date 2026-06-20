"""
Pipeline Chat — conversational agent for run inspection and editorial steering.

Uses Claude API with tool use (not Agent SDK) because:
  - We need custom tools querying Supabase run state, not built-in file/web tools
  - Tool runner handles the agentic loop automatically

Tools available to Claude:
  - get_run_info     → current state, week, slug, selected topic/hook
  - get_stage_output → full markdown from any pipeline stage

Stateless: frontend maintains conversation history and sends it on each request.
"""

import logging
import os
from typing import AsyncIterator

import anthropic

import db

logger = logging.getLogger(__name__)

CHAT_SYSTEM_PROMPT = """You are the Shetty's Desk Pipeline Assistant — an editorial co-pilot for Tiger Shetty's supply chain infographic engine.

Tiger is a Replenishment Manager at Tetra Pak building a weekly LinkedIn infographic brand ("Shetty's Desk") for VP Supply Chain, COO, and Director of Operations personas.

YOUR ROLE:
- Help Tiger inspect pipeline run outputs at any stage
- Provide editorial judgment on topic and hook selection
- Suggest refinements to hooks, research angles, and content framing
- Explain what each stage produced and why
- Flag if anything looks off (weak hook, generic research, voice drift)

WHAT YOU KNOW:
- Use the get_run_info tool to check current run state and selections
- Use the get_stage_output tool to read any stage's full output
- You understand the 7-stage pipeline: Scout → CG1 → Research → Message → CG2 → Content → Gemini Prompt

VOICE RULES (enforce these when reviewing content):
- Audience: senior SC practitioners — VPs, COOs, Directors. Not academics.
- Tone: peer, not consultant. Short sentences. Numbers mid-sentence.
- Hooks must be a single surprising stat or contrarian claim
- No buzzwords. No marketing language. Real stakes, real data.

When in doubt, call the tools first, then answer. Be concise and direct."""


def _make_tools() -> list[dict]:
    return [
        {
            "name": "get_run_info",
            "description": "Get the current pipeline run state, week, slug, selected topic index, and selected hook index.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "run_id": {"type": "string", "description": "The pipeline run ID"}
                },
                "required": ["run_id"]
            }
        },
        {
            "name": "get_stage_output",
            "description": "Get the full markdown output of a specific pipeline stage for a run.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "run_id": {"type": "string", "description": "The pipeline run ID"},
                    "stage_name": {
                        "type": "string",
                        "description": "Stage name: scout, research, message, content, or gemini_prompt"
                    }
                },
                "required": ["run_id", "stage_name"]
            }
        }
    ]


def _execute_tool(tool_name: str, tool_input: dict) -> str:
    """Execute a tool call and return its result as a string."""
    run_id = tool_input.get("run_id", "")

    if tool_name == "get_run_info":
        run = db.get_run(run_id)
        if not run:
            return f"Run {run_id} not found."
        candidates = db.get_topic_candidates(run_id)
        hooks = db.get_hook_candidates(run_id)
        topic_index = run.get("selected_topic_index")
        hook_index = run.get("selected_hook_index")

        selected_topic = None
        if topic_index is not None and candidates:
            matches = [c for c in candidates if c.get("position") == topic_index + 1]
            selected_topic = matches[0].get("title") if matches else None

        selected_hook = None
        if hook_index is not None and hooks:
            matches = [h for h in hooks if h.get("position") == hook_index + 1]
            selected_hook = matches[0].get("hook_text") if matches else None

        return (
            f"Run ID: {run_id}\n"
            f"State: {run.get('state')}\n"
            f"Week: {run.get('week')}\n"
            f"Slug: {run.get('slug')}\n"
            f"Topic candidates: {len(candidates)}\n"
            f"Selected topic (index {topic_index}): {selected_topic or 'not selected yet'}\n"
            f"Hook candidates: {len(hooks)}\n"
            f"Selected hook (index {hook_index}): {selected_hook or 'not selected yet'}\n"
            f"Error: {run.get('error_message') or 'none'}"
        )

    elif tool_name == "get_stage_output":
        stage_name = tool_input.get("stage_name", "")
        output = db.get_stage_output(run_id, stage_name)
        if not output:
            return f"No output found for stage '{stage_name}' in run {run_id}. The stage may not have run yet."
        text = output.get("output_md", "").strip()
        return text if text else f"Stage '{stage_name}' ran but produced no text output."

    return f"Unknown tool: {tool_name}"


async def stream_chat(run_id: str, messages: list[dict]) -> AsyncIterator[str]:
    """
    Run a single chat turn with tool use and stream the assistant's text response.

    Yields SSE-formatted strings: 'data: <text chunk>\n\n'
    Yields 'data: [DONE]\n\n' when complete.
    Yields 'data: [ERROR] <message>\n\n' on failure.
    """
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    tools = _make_tools()

    # Agentic loop: keep going while Claude calls tools
    current_messages = list(messages)

    try:
        while True:
            with client.messages.stream(
                model="claude-opus-4-6",
                max_tokens=2048,
                system=CHAT_SYSTEM_PROMPT,
                tools=tools,
                messages=current_messages,
            ) as stream:
                accumulated_content = []

                for event in stream:
                    if event.type == "content_block_start":
                        if event.content_block.type == "text":
                            accumulated_content.append({"type": "text", "text": ""})
                        elif event.content_block.type == "tool_use":
                            accumulated_content.append({
                                "type": "tool_use",
                                "id": event.content_block.id,
                                "name": event.content_block.name,
                                "input": ""
                            })

                    elif event.type == "content_block_delta":
                        if event.delta.type == "text_delta" and accumulated_content:
                            last = accumulated_content[-1]
                            if last["type"] == "text":
                                last["text"] += event.delta.text
                                # Stream text tokens to the client
                                yield f"data: {event.delta.text}\n\n"

                        elif event.delta.type == "input_json_delta" and accumulated_content:
                            last = accumulated_content[-1]
                            if last["type"] == "tool_use":
                                last["input"] += event.delta.partial_json

                final_message = stream.get_final_message()

            stop_reason = final_message.stop_reason

            if stop_reason == "end_turn":
                # Done — no more tool calls
                break

            if stop_reason == "tool_use":
                # Parse and execute tool calls
                import json

                tool_results = []
                for block in final_message.content:
                    if block.type == "tool_use":
                        try:
                            tool_input = block.input if isinstance(block.input, dict) else json.loads(block.input)
                        except (json.JSONDecodeError, TypeError):
                            tool_input = {}

                        # Inject run_id if not provided (convenience)
                        if "run_id" not in tool_input:
                            tool_input["run_id"] = run_id

                        result = _execute_tool(block.name, tool_input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result
                        })

                # Append assistant turn + tool results and continue loop
                current_messages.append({"role": "assistant", "content": final_message.content})
                current_messages.append({"role": "user", "content": tool_results})

            else:
                # Unexpected stop reason — break cleanly
                break

        yield "data: [DONE]\n\n"

    except Exception as e:
        logger.exception(f"[Chat] stream_chat error for run {run_id}: {e}")
        yield f"data: [ERROR] {str(e)}\n\n"
