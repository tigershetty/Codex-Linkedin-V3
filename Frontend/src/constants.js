// Shared pipeline state definitions — used by RunTimeline and RunDetail

export const STATE_COLORS = {
  IDLE:               "#718096",
  SCOUT_RUNNING:      "#3182ce",
  CG1_PENDING:        "#d69e2e",
  RESEARCH_RUNNING:   "#3182ce",
  RESEARCH_COMPLETE:  "#3182ce",
  MESSAGE_RUNNING:    "#3182ce",
  CG2_PENDING:        "#d69e2e",
  CONTENT_RUNNING:    "#3182ce",
  CONTENT_COMPLETE:   "#3182ce",
  PROMPT_RUNNING:     "#3182ce",
  DRAFT_READY:        "#38a169",
  LINKEDIN_QUEUED:    "#805ad5",
  PUBLISHED:          "#38a169",
  ANALYTICS_PENDING:  "#d69e2e",
  COMPLETE:           "#718096",
};

export const STATE_LABELS = {
  IDLE:               "Idle",
  SCOUT_RUNNING:      "Running: Scout",
  CG1_PENDING:        "⚡ Pick Your Topic",
  RESEARCH_RUNNING:   "Running: Research",
  RESEARCH_COMPLETE:  "Research Complete",
  MESSAGE_RUNNING:    "Running: Message",
  CG2_PENDING:        "⚡ Pick Your Hook",
  CONTENT_RUNNING:    "Running: Content",
  CONTENT_COMPLETE:   "Content Complete",
  PROMPT_RUNNING:     "Running: Gemini Prompt",
  DRAFT_READY:        "✓ Draft Ready",
  LINKEDIN_QUEUED:    "Queued for LinkedIn",
  PUBLISHED:          "✓ Published",
  ANALYTICS_PENDING:  "⚡ Add Analytics",
  COMPLETE:           "Complete",
};

export const ACTION_STATES = new Set(["CG1_PENDING", "CG2_PENDING", "ANALYTICS_PENDING"]);
