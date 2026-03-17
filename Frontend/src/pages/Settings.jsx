import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getSchedule, updateSchedule } from "../api/client";

const PRESETS = [
  { label: "Every Monday at 9am",    value: "0 9 * * 1" },
  { label: "Every Monday at 7am",    value: "0 7 * * 1" },
  { label: "Every Wednesday at 9am", value: "0 9 * * 3" },
  { label: "Every Friday at 9am",    value: "0 9 * * 5" },
  { label: "Custom",                 value: "custom" },
];

export default function Settings() {
  const queryClient = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: getSchedule,
  });

  const [cronExpression, setCronExpression] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");

  const mutation = useMutation({
    mutationFn: () => updateSchedule(cronExpression, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      setSavedMsg("Schedule saved!");
      setTimeout(() => setSavedMsg(""), 3000);
    },
  });

  if (isLoading) return <div style={loadingStyle}>Loading settings...</div>;

  const currentCron = cronExpression || config?.cron_expression || "0 9 * * 1";
  const isEnabled = cronExpression ? enabled : (config?.enabled ?? true);

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#e2e8f0", fontSize: "1.44rem", marginBottom: "6px" }}>Settings</h1>
      <p style={{ color: "#718096", fontSize: "0.833rem", marginBottom: "32px" }}>
        Configure your pipeline schedule and other settings.
      </p>

      {/* Schedule */}
      <div style={card}>
        <h2 style={{ color: "#e2e8f0", fontSize: "1rem", marginBottom: "16px" }}>
          Pipeline Schedule
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Schedule preset</label>
          <select
            value={PRESETS.find((p) => p.value === currentCron)?.value || "custom"}
            onChange={(e) => {
              if (e.target.value !== "custom") setCronExpression(e.target.value);
            }}
            style={inputStyle}
          >
            {PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Cron expression</label>
          <input
            type="text"
            value={currentCron}
            onChange={(e) => setCronExpression(e.target.value)}
            style={inputStyle}
            placeholder="0 9 * * 1"
          />
          <div style={{ color: "#718096", fontSize: "0.694rem", marginTop: "4px" }}>
            Format: minute hour day month weekday (0=Sun, 1=Mon…6=Sat)
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <input
            type="checkbox"
            id="enabled"
            checked={isEnabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label htmlFor="enabled" style={{ color: "#e2e8f0", fontSize: "0.9rem", cursor: "pointer" }}>
            Schedule enabled
          </label>
        </div>

        <button
          style={primaryButton}
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Schedule"}
        </button>
        {savedMsg && (
          <span style={{ color: "#38a169", marginLeft: "16px", fontSize: "0.833rem" }}>
            {savedMsg}
          </span>
        )}
      </div>

      {/* Info card */}
      <div style={{ ...card, marginTop: "16px" }}>
        <h2 style={{ color: "#e2e8f0", fontSize: "1rem", marginBottom: "16px" }}>
          Debugging Checklist
        </h2>
        <div style={{ color: "#a0aec0", fontSize: "0.833rem", lineHeight: "1.8" }}>
          <p style={{ marginTop: 0 }}>When something breaks:</p>
          <ol style={{ paddingLeft: "20px", margin: 0 }}>
            <li>Check UptimeRobot — is the backend up?</li>
            <li>Check Railway logs — look for red error text</li>
            <li>Check Sentry — it shows exactly which line of code failed</li>
            <li>Check Supabase — look at the pipeline_runs table for the stuck run</li>
            <li>Use the Retry button on the run detail page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { maxWidth: "700px", margin: "0 auto", padding: "32px 16px" };
const loadingStyle   = { color: "#718096", padding: "32px", textAlign: "center" };
const card           = { background: "#111827", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "24px" };
const labelStyle     = { display: "block", color: "#a0aec0", fontSize: "0.694rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle     = { width: "100%", background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "8px 12px", color: "#e2e8f0", fontSize: "0.9rem", boxSizing: "border-box" };
const primaryButton  = { background: "#00e5ff", color: "#0a2856", border: "none", padding: "8px 24px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.833rem" };
