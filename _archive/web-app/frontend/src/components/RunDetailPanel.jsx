// RunDetailPanel — the full pipeline run detail view as a presentational component.
// Used by:
//   • pages/RunDetail.jsx  (full-page route, gets runId from useParams)
//   • pages/RunTimeline.jsx (inline right panel, gets runId from tree selection)
//
// This component owns all of its sub-components so it is self-contained.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getRun,
  selectTopic,
  selectHook,
  uploadImage,
  queueLinkedIn,
  retryRun,
} from "../api/client";
import { STATE_COLORS, STATE_LABELS, ACTION_STATES } from "../constants";
import { AnimatedCircularProgressBar } from "./AnimatedCircularProgressBar";
import ChatPanel from "./ChatPanel";

// ── Topic Picker (CG1) ────────────────────────────────────────────

function TopicPicker({ run }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const mutation = useMutation({
    mutationFn: (topicIndex) => selectTopic(run.id, topicIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["run", run.id] });
      setSelected(null);
    },
  });

  const candidates = run.topic_candidates || [];
  const tier1 = candidates.filter((c) => c.tier === 1);
  const tier2 = candidates.filter((c) => c.tier === 2);

  return (
    <div>
      <h2 style={sectionHeading}>⚡ Control Gate 1 — Choose Your Topic</h2>
      <p style={subText}>
        {tier1.length} Trending + {tier2.length} Evergreen Gold Mine candidates.
        Click a card to select your topic for this week.
      </p>

      <h3 style={tierHeading}>Tier 1 — Trending</h3>
      <div style={cardGrid}>
        {tier1.map((c) => (
          <TopicCard
            key={c.position}
            candidate={c}
            selected={selected === c.position - 1}
            onClick={() => setSelected(c.position - 1)}
          />
        ))}
      </div>

      <h3 style={tierHeading}>Tier 2 — Evergreen Gold Mines</h3>
      <div style={cardGrid}>
        {tier2.map((c) => (
          <TopicCard
            key={c.position}
            candidate={c}
            selected={selected === c.position - 1}
            onClick={() => setSelected(c.position - 1)}
          />
        ))}
      </div>

      {selected !== null && (
        <div style={{ marginTop: "24px" }}>
          <button
            style={primaryButton}
            onClick={() => mutation.mutate(selected)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Starting Research..." : "Confirm Selection — Start Research"}
          </button>
        </div>
      )}
    </div>
  );
}

function TopicCard({ candidate, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardStyle,
        border: selected
          ? "2px solid #00e5ff"
          : hovered
          ? "1px solid #1565c0"
          : "1px solid #1e3a5f",
        background: selected ? "#0a2856" : hovered ? "#162030" : "#111827",
        cursor: "pointer",
        transform: hovered && !selected ? "translateY(-1px)" : "none",
        transition: "border-color 0.15s, background 0.15s, transform 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ color: "#718096", fontSize: "0.694rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          #{candidate.position} — {candidate.is_shortlist ? "Shortlist" : candidate.tier === 1 ? "Trending" : "Evergreen"}
        </span>
      </div>
      <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem", marginBottom: "8px" }}>
        {candidate.title}
      </div>
      <div style={{ color: "#00e5ff", fontSize: "0.833rem", marginBottom: "12px", fontStyle: "italic" }}>
        "{candidate.hook_candidate}"
      </div>
      {candidate.why_this_week && (
        <div style={{ color: "#a0aec0", fontSize: "0.75rem" }}>
          {candidate.why_this_week}
        </div>
      )}
    </div>
  );
}

// ── Hook Picker (CG2) ─────────────────────────────────────────────

function HookPicker({ run }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const mutation = useMutation({
    mutationFn: (hookIndex) => selectHook(run.id, hookIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["run", run.id] });
      setSelected(null);
    },
  });

  const hooks = run.hook_candidates || [];
  const messageOutput = run.stage_outputs?.find((s) => s.stage_name === "message");

  return (
    <div>
      <h2 style={sectionHeading}>⚡ Control Gate 2 — Choose Your Hook</h2>

      {messageOutput && (
        <div style={outputBox}>
          <pre style={preStyle}>{messageOutput.output_md?.split("## 10 Hook Options")[0]}</pre>
        </div>
      )}

      <h3 style={{ color: "#e2e8f0", margin: "24px 0 16px" }}>10 Hook Options</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {hooks.map((h) => (
          <HookCard
            key={h.position}
            hook={h}
            selected={selected === h.position - 1}
            onClick={() => setSelected(h.position - 1)}
          />
        ))}
      </div>

      {selected !== null && (
        <div style={{ marginTop: "24px" }}>
          <button
            style={primaryButton}
            onClick={() => mutation.mutate(selected)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Starting Content..." : "Confirm Hook — Start Content"}
          </button>
        </div>
      )}
    </div>
  );
}

function HookCard({ hook, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...hookCardStyle,
        border: selected
          ? "2px solid #00e5ff"
          : hovered
          ? "1px solid #1565c0"
          : "1px solid #1e3a5f",
        background: selected ? "#0a2856" : hovered ? "#162030" : "#111827",
      }}
    >
      <span style={{ color: "#718096", marginRight: "16px", fontSize: "0.833rem", flexShrink: 0 }}>
        {hook.position}.
      </span>
      <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{hook.hook_text}</span>
    </div>
  );
}

// ── Draft View ────────────────────────────────────────────────────

function DraftView({ run }) {
  const queryClient = useQueryClient();
  const [dragOver, setDragOver] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const imageStage    = run.stage_outputs?.find((s) => s.stage_name === "image");
  const contentOutput = run.stage_outputs?.find((s) => s.stage_name === "content");
  const geminiOutput  = run.stage_outputs?.find((s) => s.stage_name === "gemini_prompt");

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadImage(run.id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["run", run.id] }),
  });

  const queueMutation = useMutation({
    mutationFn: () => queueLinkedIn(run.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["run", run.id] }),
  });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "image/png") uploadMutation.mutate(file);
  };

  const caption = contentOutput?.output_md
    ?.split("## LinkedIn Caption")[1]
    ?.trim() || "";

  const promptText       = geminiOutput?.output_md || "";
  const promptIsTruncated = promptText.length > 1500;
  const displayedPrompt  = showFullPrompt || !promptIsTruncated
    ? promptText
    : promptText.substring(0, 1500) + "…";

  return (
    <div>
      <h2 style={sectionHeading}>Draft Ready — Review Before Publishing</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Image column */}
        <div>
          <h3 style={columnLabel}>Infographic</h3>

          {imageStage?.image_url ? (
            <div>
              <img
                src={imageStage.image_url}
                alt="Generated infographic"
                style={{ width: "100%", borderRadius: "8px", border: "1px solid #1e3a5f" }}
              />
              <a
                href={imageStage.image_url}
                download="infographic.png"
                style={{ ...primaryButton, display: "block", textAlign: "center", marginTop: "12px", textDecoration: "none" }}
              >
                Download PNG
              </a>
            </div>
          ) : (
            <div>
              <p style={{ color: "#718096", fontSize: "0.833rem", marginBottom: "12px" }}>
                Generate in Gemini gem, then drag your PNG here:
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  border: `2px dashed ${dragOver ? "#00e5ff" : "#1e3a5f"}`,
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                  color: dragOver ? "#00e5ff" : "#718096",
                  fontSize: "0.9rem",
                  background: dragOver ? "#0a2856" : "transparent",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s, color 0.15s",
                }}
              >
                {uploadMutation.isPending ? "Uploading..." : "Drop PNG here"}
              </div>

              {geminiOutput && (
                <div style={{ marginTop: "16px" }}>
                  <p style={{ color: "#718096", fontSize: "0.75rem", marginBottom: "8px" }}>
                    Gemini Prompts (copy to Gemini gem):
                  </p>
                  <div style={outputBox}>
                    <pre style={preStyle}>{displayedPrompt}</pre>
                  </div>
                  {promptIsTruncated && (
                    <button
                      onClick={() => setShowFullPrompt((v) => !v)}
                      style={ghostButton}
                    >
                      {showFullPrompt ? "Show less" : "Show full prompt"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Caption column */}
        <div>
          <h3 style={columnLabel}>LinkedIn Caption</h3>
          <div style={{ ...outputBox, maxHeight: "400px", overflowY: "auto" }}>
            <pre style={preStyle}>{caption}</pre>
          </div>
          <button
            style={{ ...primaryButton, marginTop: "12px" }}
            onClick={() => navigator.clipboard.writeText(caption)}
          >
            Copy Caption
          </button>

          {run.state === "DRAFT_READY" && (
            <button
              style={{ ...primaryButton, background: "#805ad5", marginTop: "8px", display: "block" }}
              onClick={() => queueMutation.mutate()}
              disabled={queueMutation.isPending}
            >
              Queue for LinkedIn
            </button>
          )}

          {run.state === "LINKEDIN_QUEUED" && (
            <div style={{ color: "#b794f4", marginTop: "12px", fontSize: "0.833rem" }}>
              ✓ Queued for LinkedIn — post manually and mark as published
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stage output reader ───────────────────────────────────────────

function StageOutput({ title, stageName, run }) {
  const output = run.stage_outputs?.find((s) => s.stage_name === stageName);
  if (!output) return null;

  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={columnLabel}>{title}</h3>
      <div style={{ ...outputBox, maxHeight: "400px", overflowY: "auto" }}>
        <pre style={preStyle}>{output.output_md}</pre>
      </div>
    </div>
  );
}

// ── Running indicator ─────────────────────────────────────────────

function RunningIndicator({ state }) {
  const stageNames = {
    SCOUT_RUNNING:    "Scout — finding topics...",
    RESEARCH_RUNNING: "Research — gathering evidence...",
    MESSAGE_RUNNING:  "Message — generating hooks...",
    CONTENT_RUNNING:  "Content — writing narratives...",
    PROMPT_RUNNING:   "Gemini Prompt — assembling image prompts...",
  };

  return (
    <div style={runningStyle}>
      <AnimatedCircularProgressBar
        gaugePrimaryColor="#00e5ff"
        gaugeSecondaryColor="rgba(0, 229, 255, 0.12)"
        size={48}
        strokeWidth={4}
      />
      <div>
        <div style={{ color: "#e2e8f0" }}>{stageNames[state] || state}</div>
        <div style={{ color: "#718096", fontSize: "0.75rem", marginTop: "2px" }}>
          auto-refreshing every 10 seconds
        </div>
      </div>
    </div>
  );
}

// ── Failed state ──────────────────────────────────────────────────

function FailedState({ run }) {
  const queryClient = useQueryClient();

  const retryMutation = useMutation({
    mutationFn: () => retryRun(run.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["run", run.id] }),
  });

  return (
    <div style={errorCard}>
      <div style={{ color: "#fc8181", fontWeight: 700, marginBottom: "8px" }}>
        Pipeline stage failed: {run.state}
      </div>
      {run.error_message && (
        <pre style={{ color: "#fc8181", fontSize: "0.75rem", marginBottom: "16px", whiteSpace: "pre-wrap" }}>
          {run.error_message}
        </pre>
      )}
      <p style={{ color: "#a0aec0", fontSize: "0.833rem", marginBottom: "16px" }}>
        Check Sentry for the full error trace. Click Retry to re-run the failed stage only.
      </p>
      <button
        style={primaryButton}
        onClick={() => retryMutation.mutate()}
        disabled={retryMutation.isPending}
      >
        {retryMutation.isPending ? "Retrying..." : "Retry Failed Stage"}
      </button>
    </div>
  );
}

// ── Main RunDetailPanel ───────────────────────────────────────────

const RUNNING_STATES = [
  "SCOUT_RUNNING",
  "RESEARCH_RUNNING",
  "MESSAGE_RUNNING",
  "CONTENT_RUNNING",
  "PROMPT_RUNNING",
];

export default function RunDetailPanel({ runId }) {
  const { data: run, isLoading, error } = useQuery({
    queryKey: ["run", runId],
    queryFn:  () => getRun(runId),
    refetchInterval: 8000,
  });

  if (isLoading) return <div style={loadingStyle}>Loading run...</div>;
  if (error)     return <div style={{ color: "#fc8181", padding: "32px" }}>Error: {error.message}</div>;
  if (!run)      return <div style={loadingStyle}>Run not found</div>;

  const isFailed   = run.state?.endsWith("_FAILED");
  const stateColor = STATE_COLORS[run.state] || "#718096";
  const stateLabel = STATE_LABELS[run.state]  || run.state;

  return (
    <div style={containerStyle}>
      {/* Run header */}
      <div style={{ color: "#718096", fontSize: "0.833rem", marginBottom: "4px" }}>
        {run.week}
      </div>
      <h1 style={{ color: "#e2e8f0", fontSize: "1.44rem", margin: "0 0 12px" }}>
        {run.slug === "pending-topic-selection" ? "Awaiting topic selection" : run.slug}
      </h1>
      <div style={{ marginBottom: "32px" }}>
        <span style={{
          padding:      "3px 10px",
          borderRadius: "9999px",
          fontSize:     "0.75rem",
          fontWeight:   ACTION_STATES.has(run.state) ? 700 : 500,
          background:   stateColor + "22",
          color:        stateColor,
          border:       `1px solid ${stateColor}44`,
        }}>
          {stateLabel}
        </span>
      </div>

      {/* Running indicator */}
      {RUNNING_STATES.includes(run.state) && <RunningIndicator state={run.state} />}

      {/* Failed state */}
      {isFailed && <FailedState run={run} />}

      {/* Control Gate 1 */}
      {run.state === "CG1_PENDING" && <TopicPicker run={run} />}

      {/* Control Gate 2 */}
      {run.state === "CG2_PENDING" && <HookPicker run={run} />}

      {/* Draft view */}
      {(run.state === "DRAFT_READY" ||
        run.state === "LINKEDIN_QUEUED" ||
        run.state === "PUBLISHED" ||
        run.state === "COMPLETE") && (
        <DraftView run={run} />
      )}

      {/* Stage outputs */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#718096", fontSize: "0.75rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Stage Outputs
        </h2>
        <StageOutput title="Scout"         stageName="scout"         run={run} />
        <StageOutput title="Research"      stageName="research"      run={run} />
        <StageOutput title="Message"       stageName="message"       run={run} />
        <StageOutput title="Content"       stageName="content"       run={run} />
        <StageOutput title="Gemini Prompt" stageName="gemini_prompt" run={run} />
      </div>

      {/* Pipeline Assistant chat */}
      <ChatPanel runId={run.id} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const containerStyle  = { maxWidth: "900px", margin: "0 auto", padding: "32px 24px" };
const loadingStyle    = { color: "#718096", padding: "32px", textAlign: "center" };
const sectionHeading  = { color: "#00e5ff", fontSize: "1.2rem", marginBottom: "16px" };
const subText         = { color: "#718096", fontSize: "0.833rem", marginBottom: "24px" };
const tierHeading     = { color: "#a0aec0", fontSize: "0.75rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" };
const columnLabel     = { color: "#a0aec0", fontSize: "0.75rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" };
const cardGrid        = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px", marginBottom: "24px" };
const cardStyle       = { borderRadius: "8px", padding: "16px" };
const hookCardStyle   = { display: "flex", alignItems: "flex-start", padding: "12px 16px", borderRadius: "8px", cursor: "pointer" };
const outputBox       = { background: "#0a1628", borderRadius: "8px", padding: "16px", border: "1px solid #1e3a5f" };
const preStyle        = { margin: 0, color: "#e2e8f0", fontSize: "0.75rem", whiteSpace: "pre-wrap", fontFamily: "monospace, monospace" };
const primaryButton   = { background: "#00e5ff", color: "#0a2856", border: "none", padding: "8px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.833rem" };
const ghostButton     = { background: "transparent", border: "1px solid #1e3a5f", color: "#718096", padding: "4px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", marginTop: "8px" };
const runningStyle    = { display: "flex", alignItems: "center", gap: "16px", background: "#0a2856", border: "1px solid #1565c0", borderRadius: "8px", padding: "16px", marginBottom: "24px" };
const errorCard       = { background: "#2d1515", border: "1px solid #fc8181", borderRadius: "8px", padding: "20px", marginBottom: "24px" };
