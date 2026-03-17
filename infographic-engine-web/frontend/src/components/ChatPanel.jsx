// ChatPanel — conversational agent for pipeline run inspection and editorial steering.
// Streams responses from POST /runs/{runId}/chat via fetch() + ReadableStream.
// Maintains conversation history in local state (stateless backend).

import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const USERNAME = import.meta.env.VITE_BASIC_AUTH_USERNAME || "tiger";
const PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD || "";

// ── Chat message bubble ────────────────────────────────────────

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display:       "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom:  "12px",
      }}
    >
      <div
        style={{
          maxWidth:     "82%",
          padding:      "10px 14px",
          borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          background:   isUser ? "#06858e" : "#1a2535",
          border:       isUser ? "none" : "1px solid #1e3a5f",
          color:        "#e2e8f0",
          fontSize:     "0.833rem",
          lineHeight:   1.55,
          whiteSpace:   "pre-wrap",
          wordBreak:    "break-word",
        }}
      >
        {msg.content}
        {msg.streaming && (
          <span style={{ opacity: 0.5, marginLeft: "2px", animation: "blink 1s step-end infinite" }}>▋</span>
        )}
      </div>
    </div>
  );
}

// ── Suggested prompts ──────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What stage is this run at?",
  "Summarise what the research found",
  "Which hook is strongest for a COO audience?",
  "Review the content for voice compliance",
];

// ── Main ChatPanel ─────────────────────────────────────────────

export default function ChatPanel({ runId }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [isStreaming, setStreaming] = useState(false);
  const [isOpen, setIsOpen]       = useState(false);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);
  const abortRef                  = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text.trim();
    if (!userText || isStreaming) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Add placeholder assistant message for streaming
    const streamingIndex = newMessages.length;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const credentials = btoa(`${USERNAME}:${PASSWORD}`);
      const response = await fetch(`${API_URL}/runs/${runId}/chat`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Basic ${credentials}`,
        },
        body:   JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";   // keep incomplete chunk

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);   // strip "data: "

          if (payload === "[DONE]") break;
          if (payload.startsWith("[ERROR]")) {
            fullText += `\n\n⚠️ ${payload.slice(8)}`;
            break;
          }

          fullText += payload;
          setMessages((prev) => {
            const updated = [...prev];
            updated[streamingIndex] = {
              role:      "assistant",
              content:   fullText,
              streaming: true,
            };
            return updated;
          });
        }
      }

      // Finalise — remove streaming cursor
      setMessages((prev) => {
        const updated = [...prev];
        updated[streamingIndex] = {
          role:    "assistant",
          content: fullText || "(no response)",
          streaming: false,
        };
        return updated;
      });

    } catch (err) {
      if (err.name === "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[streamingIndex] = {
            role:    "assistant",
            content: "(stopped)",
            streaming: false,
          };
          return updated;
        });
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[streamingIndex] = {
            role:    "assistant",
            content: `⚠️ Error: ${err.message}`,
            streaming: false,
          };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
  };

  const clearHistory = () => {
    setMessages([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Collapsed toggle button ──────────────────────────────────

  if (!isOpen) {
    return (
      <div style={{ marginTop: "48px", borderTop: "1px solid #1e3a5f", paddingTop: "24px" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={toggleButton}
        >
          <span style={{ fontSize: "1rem", marginRight: "8px" }}>💬</span>
          Ask the Pipeline Assistant
          {messages.length > 0 && (
            <span style={{ marginLeft: "8px", color: "#427a7e", fontSize: "0.694rem" }}>
              ({messages.length} message{messages.length !== 1 ? "s" : ""})
            </span>
          )}
        </button>
      </div>
    );
  }

  // ── Expanded panel ───────────────────────────────────────────

  return (
    <div style={{ marginTop: "48px", borderTop: "1px solid #1e3a5f", paddingTop: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1rem" }}>💬</span>
          <span style={{ color: "#06858e", fontWeight: 600, fontSize: "0.9rem" }}>
            Pipeline Assistant
          </span>
          <span style={{ color: "#427a7e", fontSize: "0.694rem" }}>
            Ask about this run
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {messages.length > 0 && (
            <button onClick={clearHistory} style={ghostButton} title="Clear history">
              Clear
            </button>
          )}
          <button onClick={() => setIsOpen(false)} style={ghostButton}>
            Collapse
          </button>
        </div>
      </div>

      {/* Message list */}
      <div style={messageList}>
        {messages.length === 0 && (
          <div style={{ color: "#427a7e", fontSize: "0.75rem", textAlign: "center", padding: "16px 0" }}>
            Ask about this run — stage outputs, hook quality, research findings, voice compliance.
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (only when empty) */}
      {messages.length === 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              style={suggestionChip}
              disabled={isStreaming}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this run… (Enter to send, Shift+Enter for newline)"
          disabled={isStreaming}
          rows={2}
          style={textareaStyle}
        />
        {isStreaming ? (
          <button onClick={stopStreaming} style={stopButton}>
            Stop
          </button>
        ) : (
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            style={{
              ...sendButton,
              opacity: input.trim() ? 1 : 0.4,
              cursor:  input.trim() ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────

const toggleButton = {
  background:   "transparent",
  border:       "1px solid #1e3a5f",
  borderRadius: "8px",
  color:        "#427a7e",
  padding:      "10px 16px",
  fontSize:     "0.833rem",
  cursor:       "pointer",
  display:      "flex",
  alignItems:   "center",
  transition:   "border-color 0.15s, color 0.15s",
};

const ghostButton = {
  background:   "transparent",
  border:       "1px solid #1e3a5f",
  borderRadius: "6px",
  color:        "#427a7e",
  padding:      "4px 10px",
  fontSize:     "0.694rem",
  cursor:       "pointer",
};

const messageList = {
  minHeight:    "120px",
  maxHeight:    "400px",
  overflowY:    "auto",
  marginBottom: "12px",
  padding:      "8px 0",
};

const suggestionChip = {
  background:   "#0f1e30",
  border:       "1px solid #1e3a5f",
  borderRadius: "20px",
  color:        "#a0b8c8",
  padding:      "4px 12px",
  fontSize:     "0.694rem",
  cursor:       "pointer",
};

const textareaStyle = {
  flex:         1,
  background:   "#0a1628",
  border:       "1px solid #1e3a5f",
  borderRadius: "8px",
  color:        "#e2e8f0",
  fontSize:     "0.833rem",
  padding:      "10px 12px",
  resize:       "none",
  lineHeight:   1.5,
  outline:      "none",
  fontFamily:   "inherit",
};

const sendButton = {
  background:   "#06858e",
  border:       "none",
  borderRadius: "8px",
  color:        "#ffffff",
  padding:      "10px 18px",
  fontSize:     "0.833rem",
  fontWeight:   600,
  cursor:       "pointer",
  flexShrink:   0,
  alignSelf:    "stretch",
};

const stopButton = {
  ...sendButton,
  background: "#c05050",
};
