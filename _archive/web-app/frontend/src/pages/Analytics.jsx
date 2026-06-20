import { useQuery } from "@tanstack/react-query";
import { listAnalytics } from "../api/client";

const COLS = [
  { key: "week",            label: "Week" },
  { key: "slug",            label: "Topic" },
  { key: "post_date",       label: "Date" },
  { key: "impressions",     label: "Impressions",  numeric: true },
  { key: "members_reached", label: "Reached",      numeric: true },
  { key: "reactions",       label: "Reactions",    numeric: true },
  { key: "saves",           label: "Saves",        numeric: true },
  { key: "engagement_rate", label: "Engagement %", numeric: true, format: (v) => v ? `${(v * 100).toFixed(2)}%` : "—" },
  { key: "save_rate",       label: "Save Rate %",  numeric: true, format: (v) => v ? `${(v * 100).toFixed(2)}%` : "—" },
  { key: "composite_score", label: "Composite",    numeric: true, format: (v) => v?.toFixed(1) || "—" },
];

export default function Analytics() {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: listAnalytics,
  });

  if (isLoading) return <div style={loadingStyle}>Loading analytics...</div>;
  if (error) return <div style={{ color: "#fc8181", padding: "32px" }}>Error: {error.message}</div>;

  // Sort by composite score descending
  const sorted = [...rows].sort((a, b) => (b.composite_score || 0) - (a.composite_score || 0));

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#e2e8f0", fontSize: "1.44rem", marginBottom: "6px" }}>Analytics</h1>
      <p style={{ color: "#718096", fontSize: "0.833rem", marginBottom: "32px" }}>
        {rows.length} post{rows.length !== 1 ? "s" : ""} · Sorted by composite score
      </p>

      {rows.length === 0 ? (
        <div style={{ color: "#718096", textAlign: "center", marginTop: "48px" }}>
          No analytics yet. Add analytics after your first published post.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    style={{ ...thStyle, textAlign: col.numeric ? "right" : "left" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={row.id || i} style={i % 2 === 0 ? evenRowStyle : {}}>
                  {COLS.map((col) => (
                    <td
                      key={col.key}
                      style={{ ...tdStyle, textAlign: col.numeric ? "right" : "left" }}
                    >
                      {col.format
                        ? col.format(row[col.key])
                        : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const containerStyle = { maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" };
const loadingStyle   = { color: "#718096", padding: "32px", textAlign: "center" };
const tableStyle     = { width: "100%", borderCollapse: "collapse", fontSize: "0.833rem" };
const thStyle        = { color: "#718096", padding: "8px 12px", borderBottom: "1px solid #1e3a5f", whiteSpace: "nowrap" };
const tdStyle        = { color: "#e2e8f0", padding: "8px 12px", borderBottom: "1px solid #1a2744" };
const evenRowStyle   = { background: "#0a1628" };
