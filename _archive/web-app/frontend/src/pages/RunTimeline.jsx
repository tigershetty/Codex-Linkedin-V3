// RunTimeline — split-panel home page.
//
// Layout:
//   ┌──────────────┬──────────────────────────────────────┐
//   │  Sidebar     │  Right panel                         │
//   │  ─────────── │  ───────────────────────────────────  │
//   │  ▶ W09 · 26 │  <empty state>  or                   │
//   │    ◦ run A  │  <RunDetailPanel runId={selected} />  │
//   │    ◦ run B  │                                       │
//   │  ▼ W08 · 26 │                                       │
//   └──────────────┴──────────────────────────────────────┘
//
// No Tailwind, no Radix, no shadcn — pure React + inline styles.

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useQueryClient }              from "@tanstack/react-query";
import { listRuns, createRun }                   from "../api/client";
import { STATE_COLORS, ACTION_STATES }           from "../constants";
import RunDetailPanel                            from "../components/RunDetailPanel";

// ── Helpers ────────────────────────────────────────────────────────

/** "2026-W09" → "W09 · 2026" */
function formatWeekLabel(weekStr) {
  const m = weekStr?.match(/^(\d{4})-W(\d{2})$/);
  return m ? `W${m[2]} · ${m[1]}` : (weekStr || "Unknown");
}

/** Short label for a run in the tree */
function runLabel(run) {
  if (!run.slug || run.slug === "pending-topic-selection") return "Awaiting topic";
  // Truncate long slugs so the tree stays narrow
  return run.slug.length > 32 ? run.slug.slice(0, 30) + "…" : run.slug;
}

// ── StateDot — tiny coloured circle showing pipeline state ─────────

function StateDot({ state }) {
  const color    = STATE_COLORS[state] || "#718096";
  const isAction = ACTION_STATES.has(state);
  return (
    <span
      aria-hidden="true"
      style={{
        display:       "inline-block",
        width:         "7px",
        height:        "7px",
        borderRadius:  "50%",
        background:    color,
        flexShrink:    0,
        animation:     isAction ? "pulse 2s infinite" : "none",
      }}
    />
  );
}

// ── RunItem — single row in the tree ─────────────────────────────

function RunItem({ run, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isAction = ACTION_STATES.has(run.state);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={runLabel(run)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
        padding:      "7px 16px 7px 38px",   // deep left-indent for tree feel
        cursor:       "pointer",
        background:   isSelected
          ? "rgba(6, 133, 142, 0.18)"
          : hovered
          ? "#162030"
          : "transparent",
        borderLeft:   isSelected
          ? "2px solid #06858e"
          : "2px solid transparent",
        transition:   "background 0.12s, border-color 0.12s",
        userSelect:   "none",
      }}
    >
      <StateDot state={run.state} />
      <span
        style={{
          color:         isSelected ? "#d4e8ec" : "#8aa4b0",
          fontSize:      "0.77rem",
          overflow:      "hidden",
          textOverflow:  "ellipsis",
          whiteSpace:    "nowrap",
          flex:          1,
          fontWeight:    isSelected ? 600 : 400,
        }}
      >
        {isAction ? "⚡ " : ""}{runLabel(run)}
      </span>
    </div>
  );
}

// ── WeekFolder — collapsible folder row + its run items ───────────

function WeekFolder({ weekStr, runs, expandedWeeks, toggleWeek, selectedRunId, onSelectRun }) {
  const [hovered, setHovered] = useState(false);
  const isOpen    = expandedWeeks.has(weekStr);
  const hasAction = runs.some((r) => ACTION_STATES.has(r.state));

  return (
    <div style={{ borderBottom: "1px solid rgba(30, 58, 95, 0.35)" }}>
      {/* Folder header row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => toggleWeek(weekStr)}
        onKeyDown={(e) => e.key === "Enter" && toggleWeek(weekStr)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         "8px",
          padding:     "10px 16px",
          cursor:      "pointer",
          background:  isOpen
            ? "rgba(6, 133, 142, 0.1)"
            : hovered
            ? "#1a2535"
            : "transparent",
          transition:  "background 0.12s",
          userSelect:  "none",
        }}
      >
        {/* Animated chevron ▶ rotates to ▼ when open */}
        <span
          style={{
            color:      "#4a6480",
            fontSize:   "0.5rem",
            display:    "inline-block",
            transform:  isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.18s ease",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ▶
        </span>

        {/* Folder icon text */}
        <span style={{ fontSize: "0.78rem", flexShrink: 0, lineHeight: 1 }}>
          {isOpen ? "▽" : "▷"}
        </span>

        {/* Week label */}
        <span
          style={{
            color:      hasAction ? "#d69e2e" : isOpen ? "#b8dce4" : "#8aa4b0",
            fontSize:   "0.78rem",
            fontWeight: 600,
            flex:       1,
            letterSpacing: "0.02em",
          }}
        >
          {formatWeekLabel(weekStr)}
        </span>

        {/* Count badge */}
        <span
          style={{
            background:  "#1a2a40",
            color:       hasAction ? "#d69e2e" : "#4a6480",
            fontSize:    "0.6rem",
            padding:     "1px 6px",
            borderRadius: "9999px",
            flexShrink:  0,
            fontWeight:  600,
          }}
        >
          {runs.length}
        </span>
      </div>

      {/* Run items — animated collapse via maxHeight */}
      <div
        style={{
          overflow:   "hidden",
          maxHeight:  isOpen ? `${runs.length * 36}px` : "0px",
          transition: "max-height 0.22s ease",
        }}
      >
        {runs.map((run) => (
          <RunItem
            key={run.id}
            run={run}
            isSelected={selectedRunId === run.id}
            onClick={() => onSelectRun(run.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── EmptyPanel — right-panel placeholder when no run is selected ──

function EmptyPanel({ hasPending, pendingCount }) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        height:         "100%",
        gap:            "12px",
        paddingBottom:  "80px",   // visual vertical centering offset
      }}
    >
      <div style={{ fontSize: "2.5rem", opacity: 0.25, color: "#06858e" }}>◎</div>
      <div style={{ color: "#0a4a55", fontWeight: 600, fontSize: "1rem" }}>
        Select a run
      </div>
      <div style={{ color: "#427a7e", fontSize: "0.833rem", textAlign: "center", maxWidth: "240px" }}>
        Expand a week folder in the sidebar and click any run to view its pipeline.
      </div>
      {hasPending && (
        <div
          style={{
            marginTop:    "16px",
            background:   "rgba(116, 66, 16, 0.15)",
            border:       "1px solid rgba(214, 158, 46, 0.4)",
            color:        "#d69e2e",
            padding:      "8px 16px",
            borderRadius: "8px",
            fontSize:     "0.75rem",
            fontWeight:   600,
          }}
        >
          ⚡ {pendingCount} run{pendingCount > 1 ? "s" : ""} need your input
        </div>
      )}
    </div>
  );
}

// ── RunTimeline page ───────────────────────────────────────────────

export default function RunTimeline() {
  const [selectedRunId, setSelectedRunId]   = useState(null);
  const [expandedWeeks, setExpandedWeeks]   = useState(new Set());
  const hasAutoExpanded                     = useRef(false);
  const queryClient                         = useQueryClient();

  const { data: runs = [], isLoading, error } = useQuery({
    queryKey: ["runs"],
    queryFn:  listRuns,
  });

  // Group runs by week, sort newest week first
  const weekGroups = useMemo(() => {
    const groups = {};
    runs.forEach((run) => {
      const week = run.week || "Unknown";
      if (!groups[week]) groups[week] = [];
      groups[week].push(run);
    });
    // Descending sort: "2026-W10" > "2026-W09" lexicographically
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [runs]);

  // Auto-expand the most recent week on first data load
  useEffect(() => {
    if (!hasAutoExpanded.current && weekGroups.length > 0) {
      setExpandedWeeks(new Set([weekGroups[0][0]]));
      hasAutoExpanded.current = true;
    }
  }, [weekGroups]);

  const toggleWeek = (weekStr) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(weekStr) ? next.delete(weekStr) : next.add(weekStr);
      return next;
    });
  };

  // Create a new run for the current ISO week and auto-select it
  const handleNewRun = async () => {
    const now = new Date();
    const { year, week } = (() => {
      const d      = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const wk        = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return { year: d.getUTCFullYear(), week: wk };
    })();

    const weekStr = `${year}-W${String(week).padStart(2, "0")}`;
    const newRun  = await createRun(weekStr);
    queryClient.invalidateQueries({ queryKey: ["runs"] });

    if (newRun?.id) {
      setSelectedRunId(newRun.id);
      // Ensure the new run's week folder is open
      setExpandedWeeks((prev) => new Set([...prev, weekStr]));
    }
  };

  const pending = runs.filter((r) => ACTION_STATES.has(r.state));

  // ── Render ──────────────────────────────────────────────────────

  if (isLoading)
    return (
      <div style={{ color: "#427a7e", padding: "32px", textAlign: "center" }}>
        Loading runs…
      </div>
    );
  if (error)
    return (
      <div style={{ color: "#d13838", padding: "32px" }}>
        Error loading runs: {error.message}
      </div>
    );

  return (
    <div
      style={{
        display:  "flex",
        height:   "calc(100vh - 56px)",  // 56px = nav height
        overflow: "hidden",
      }}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
      <aside
        style={{
          width:         "260px",
          flexShrink:    0,
          background:    "#0d1117",
          borderRight:   "1px solid #1e3a5f",
          display:       "flex",
          flexDirection: "column",
          overflowY:     "auto",
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding:        "14px 16px",
            borderBottom:   "1px solid #1e3a5f",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            flexShrink:     0,
          }}
        >
          <span
            style={{
              color:          "#4a6480",
              fontSize:       "0.62rem",
              fontWeight:     700,
              textTransform:  "uppercase",
              letterSpacing:  "0.12em",
            }}
          >
            Pipeline Runs
          </span>
          <button onClick={handleNewRun} style={newRunBtnStyle}>
            + New
          </button>
        </div>

        {/* Action-required banner */}
        {pending.length > 0 && (
          <div
            style={{
              background:   "rgba(116, 66, 16, 0.6)",
              borderBottom: "1px solid #744210",
              color:        "#fbd38d",
              padding:      "7px 16px",
              fontSize:     "0.66rem",
              fontWeight:   600,
              flexShrink:   0,
            }}
          >
            ⚡ {pending.length} run{pending.length > 1 ? "s" : ""} need input
          </div>
        )}

        {/* Empty sidebar state */}
        {runs.length === 0 && (
          <div
            style={{
              padding:   "28px 16px",
              color:     "#4a6480",
              fontSize:  "0.78rem",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "4px", opacity: 0.4, fontSize: "1.5rem" }}>◎</div>
            No runs yet.
            <br />
            <button onClick={handleNewRun} style={{ ...newRunBtnStyle, marginTop: "12px", padding: "5px 14px" }}>
              + Start First Run
            </button>
          </div>
        )}

        {/* Week folder list */}
        <div style={{ flex: 1 }}>
          {weekGroups.map(([weekStr, weekRuns]) => (
            <WeekFolder
              key={weekStr}
              weekStr={weekStr}
              runs={weekRuns}
              expandedWeeks={expandedWeeks}
              toggleWeek={toggleWeek}
              selectedRunId={selectedRunId}
              onSelectRun={setSelectedRunId}
            />
          ))}
        </div>
      </aside>

      {/* ── RIGHT CONTENT PANEL ──────────────────────────────────── */}
      <main
        style={{
          flex:      1,
          overflowY: "auto",
          // No background — the fixed BackgroundPaths layer shows through
        }}
      >
        {selectedRunId ? (
          <RunDetailPanel runId={selectedRunId} />
        ) : (
          <EmptyPanel
            hasPending={pending.length > 0}
            pendingCount={pending.length}
          />
        )}
      </main>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────

const newRunBtnStyle = {
  background:   "#06858e",
  color:        "#ffffff",
  border:       "none",
  padding:      "3px 10px",
  borderRadius: "5px",
  fontWeight:   700,
  cursor:       "pointer",
  fontSize:     "0.65rem",
  letterSpacing: "0.02em",
};
