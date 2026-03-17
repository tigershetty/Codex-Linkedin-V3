import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { listRuns, createRun } from "../api/client";
import { STATE_COLORS, STATE_LABELS, ACTION_STATES } from "../constants";

// ── StateTag ─────────────────────────────────────────────────────

function StateTag({ state }) {
  const color = STATE_COLORS[state] || "#718096";
  const label = STATE_LABELS[state] || state;
  const isActionRequired = ACTION_STATES.has(state);

  return (
    <span
      style={{
        padding: "3px 10px",            // 4px / 10px — close to 8pt grid for pill tags
        borderRadius: "9999px",
        fontSize: "0.75rem",            // was 0.78rem — now intentional xs-ish
        fontWeight: isActionRequired ? 700 : 500,
        background: color + "22",       // ~13% opacity tint
        color,
        border: isActionRequired ? `1.5px solid ${color}` : "none",
        animation: isActionRequired ? "pulse 2s infinite" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ── RunCard ───────────────────────────────────────────────────────

function RunCard({ run }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const needsAction = ACTION_STATES.has(run.state);

  return (
    <div
      onClick={() => navigate(`/runs/${run.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: needsAction ? "#0a2856" : hovered ? "#162030" : "#111827",
        border: needsAction
          ? "1.5px solid #d69e2e"
          : hovered
          ? "1px solid #1565c0"
          : "1px solid #1e3a5f",
        borderRadius: "12px",           // --radius-lg
        padding: "20px 24px",           // 20px / 24px — on 8pt grid
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "border-color 0.15s, background 0.15s",
        transform: hovered && !needsAction ? "translateY(-1px)" : "none",
      }}
    >
      <div>
        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "1rem" }}>
          {run.week}
        </div>
        <div style={{ color: "#718096", fontSize: "0.833rem", marginTop: "4px" }}>
          {run.slug === "pending-topic-selection" ? "Awaiting topic selection" : run.slug}
        </div>
      </div>
      <StateTag state={run.state} />
    </div>
  );
}

// ── RunTimeline page ──────────────────────────────────────────────

export default function RunTimeline() {
  const queryClient = useQueryClient();
  const { data: runs = [], isLoading, error } = useQuery({
    queryKey: ["runs"],
    queryFn: listRuns,
  });

  const handleNewRun = async () => {
    const now = new Date();
    const { year, week } = (() => {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const wk = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return { year: d.getUTCFullYear(), week: wk };
    })();
    const weekStr = `${year}-W${String(week).padStart(2, "0")}`;
    await createRun(weekStr);
    queryClient.invalidateQueries({ queryKey: ["runs"] }); // was window.location.reload()
  };

  if (isLoading) return <div style={loadingStyle}>Loading runs...</div>;
  if (error) return <div style={errorStyle}>Error loading runs: {error.message}</div>;

  const pending = runs.filter((r) => ACTION_STATES.has(r.state));

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "#e2e8f0", margin: 0, fontSize: "1.44rem" }}>
          Pipeline Runs
        </h1>
        <button onClick={handleNewRun} style={buttonStyle}>
          + New Run
        </button>
      </div>

      {/* Alert banner — role="alert" ensures screen readers announce it */}
      {pending.length > 0 && (
        <div role="alert" aria-live="polite" style={alertBannerStyle}>
          ⚡ {pending.length} run{pending.length > 1 ? "s" : ""} need your input
        </div>
      )}

      {runs.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: "2rem", opacity: 0.35, marginBottom: "12px" }}>◎</div>
          <div style={{ color: "#a0aec0", fontWeight: 600, fontSize: "1rem", marginBottom: "6px" }}>
            No pipeline runs yet
          </div>
          <div style={{ color: "#718096", fontSize: "0.833rem", marginBottom: "24px" }}>
            Start your first content week to begin the pipeline.
          </div>
          <button onClick={handleNewRun} style={buttonStyle}>
            + New Run
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {runs.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "32px 16px",       // 32px / 16px — on 8pt grid
};

const loadingStyle = {
  color: "#718096",
  padding: "32px",
  textAlign: "center",
};

const errorStyle = {
  color: "#fc8181",
  padding: "32px",
};

const buttonStyle = {
  background: "#00e5ff",
  color: "#0a2856",
  border: "none",
  padding: "8px 24px",        // 8px / 24px — on 8pt grid (was 0.5rem 1.25rem)
  borderRadius: "8px",        // --radius-md
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "0.833rem",       // sm (was 0.9rem — off scale)
};

const alertBannerStyle = {
  background: "#744210",
  border: "1px solid #d69e2e",
  color: "#fbd38d",
  padding: "12px 16px",       // 12px / 16px — on 8pt grid (was 0.75rem 1rem)
  borderRadius: "8px",        // --radius-md
  marginBottom: "16px",
  fontWeight: 600,
  fontSize: "0.833rem",       // sm (was 0.9rem — off scale)
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "48px 32px",
  border: "1px dashed #1e3a5f",
  borderRadius: "12px",       // --radius-lg
  marginTop: "16px",
};
