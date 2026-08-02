import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CODE_LABELS = {
  hook: {
    H1: "evidence/result",
    H2: "pain/consequence scene",
    H3: "correction/distinction",
    H4: "method/artifact promise",
    H5: "complete list/map",
    H6: "personal/build story",
    H7: "timely change/news",
    H8: "curiosity question",
    H9: "plain premise/announcement",
  },
  job: {
    J1: "understand/explain",
    J2: "decide/diagnose",
    J3: "prevent/fix failure",
    J4: "execute/create faster",
    J5: "advance/influence/lead",
    J6: "evaluate/adopt tools safely",
    J7: "interpret current change",
    J8: "connect/inspire/entertain",
    J0: "none/unclear",
  },
  proof: {
    P1: "first-party result/test",
    P2: "external empirical evidence",
    P3: "worked demonstration",
    P4: "named real-world case",
    P5: "practitioner observation",
    P6: "reasoned model only",
    P0: "no proof",
  },
  artifact: {
    AR1: "executable/interactive",
    AR2: "downloadable resource",
    AR3: "copyable operating asset",
    AR4: "decision/reference artifact",
    AR5: "completed example only",
    AR0: "none",
  },
  problem: {
    PB1: "planning and forecasting",
    PB2: "inventory and replenishment",
    PB3: "logistics, warehousing, or transport",
    PB4: "procurement, sourcing, or suppliers",
    PB5: "transformation, systems, ERP, or operating model",
    PB6: "AI workflows, adoption, or governance",
    PB7: "Excel, data, analytics, or BI",
    PB8: "lean, process improvement, quality, or constraints",
    PB9: "career, leadership, communication, or people",
    PB10: "marketing, growth, sales, or creator work",
    PB11: "business strategy, finance, or entrepreneurship",
    PB12: "other or unclear",
  },
  cta: {
    C1: "commercial conversion",
    C2: "traffic/owned audience",
    C3: "direct contact",
    C4: "keyword gate",
    C5: "practitioner discussion",
    C6: "generic discussion",
    C7: "platform engagement",
    C0: "none",
  },
  format: {
    F1_text_only: "text only",
    F2_static_image: "single static image",
    F3_multi_image: "multi-image gallery",
    F4_document: "native document/PDF carousel",
    F5_video: "native video or animated GIF",
    F6_link_article: "link/article/newsletter preview",
    F7_other_native: "other native format",
    F1: "text only",
    F2: "single static image",
    F3: "multi-image gallery",
    F4: "native document/PDF carousel",
    F5: "native video or animated GIF",
    F6: "link/article/newsletter preview",
    F7: "other native format",
  },
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows
    .filter((values) => values.some((value) => value !== ""))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join("|") : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  return [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeActivityId(value) {
  const match = String(value || "").match(/(?:LI-|activity:)?(\d{12,})/);
  return match ? match[1] : "";
}

function normalizeAuthor(value) {
  return String(value || "").replace(/[’']s post$/i, "").replace(/[’'] post$/i, "").trim();
}

function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function firstLine(text) {
  return String(text || "").split(/\n+/).map((line) => line.trim()).find(Boolean) || "";
}

function inferPublishedAtFromActivityId(activityId) {
  if (!activityId) return "";
  try {
    const milliseconds = BigInt(activityId) >> 22n;
    const date = new Date(Number(milliseconds));
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  } catch {
    return "";
  }
}

function inferAudience(text) {
  const lower = text.toLowerCase();
  if (/demand planner|supply planner|planning manager|s&op|forecast|replenish/.test(lower)) return "planners and planning managers";
  if (/procurement|purchas|buyer|supplier|sourcing|rfq|purchase order|\bpo\b/.test(lower)) return "purchasing and procurement practitioners";
  if (/transformation|operating model|governance|implementation|adoption|erp|enterprise ai/.test(lower)) return "supply-chain transformation leaders";
  if (/career|graduate|entry level|interview|job search|promotion/.test(lower)) return "early-career professionals";
  if (/linkedin|content|creator|personal brand|followers|audience growth/.test(lower)) return "creators and marketers";
  if (/supply chain|logistics|inventory|manufactur|operations/.test(lower)) return "broad supply-chain practitioners";
  if (/leader|manager|ceo|founder|executive/.test(lower)) return "leaders and managers";
  return "broad professional or unstated";
}

function inferProblemFamily(text, code) {
  if (code && CODE_LABELS.problem[code]) return CODE_LABELS.problem[code];
  const lower = text.toLowerCase();
  if (/forecast|demand plan|s&op|capacity plan|production plan|mps\b/.test(lower)) return CODE_LABELS.problem.PB1;
  if (/inventory|stockout|safety stock|reorder|replenish|sku/.test(lower)) return CODE_LABELS.problem.PB2;
  if (/logistics|warehouse|freight|transport|shipping|delivery|3pl|4pl|5pl/.test(lower)) return CODE_LABELS.problem.PB3;
  if (/procurement|purchas|supplier|sourcing|rfq|contract|purchase order|\bpo\b/.test(lower)) return CODE_LABELS.problem.PB4;
  if (/erp|sap|operating model|transformation|system implementation/.test(lower)) return CODE_LABELS.problem.PB5;
  if (/\bai\b|claude|chatgpt|copilot|agentic|prompt|llm|automation/.test(lower)) return CODE_LABELS.problem.PB6;
  if (/excel|data|analytics|power bi|dashboard|metric|kpi/.test(lower)) return CODE_LABELS.problem.PB7;
  if (/lean|quality|constraint|process improvement|continuous improvement/.test(lower)) return CODE_LABELS.problem.PB8;
  if (/career|leadership|manager|communication|team|people/.test(lower)) return CODE_LABELS.problem.PB9;
  if (/linkedin|content|creator|marketing|sales|personal brand/.test(lower)) return CODE_LABELS.problem.PB10;
  if (/strategy|finance|business|entrepreneur|founder|revenue/.test(lower)) return CODE_LABELS.problem.PB11;
  return CODE_LABELS.problem.PB12;
}

function inferTopic(text, problemFamily) {
  const lower = text.toLowerCase();
  const candidates = [
    ["supply-chain career paths", /career path|supply chain roles|entry level/],
    ["forecast quality and decision consequences", /forecast|demand sensing|demand planning/],
    ["inventory policy and segmentation", /inventory|stockout|safety stock|sku|replenish/],
    ["supplier and sourcing decisions", /supplier|sourcing|procurement|rfq|purchase order|\bpo\b/],
    ["logistics network and service design", /logistics|warehouse|freight|shipping|delivery|3pl|4pl|5pl/],
    ["AI workflow design and adoption", /claude|chatgpt|copilot|agentic|prompt|\bai\b/],
    ["LinkedIn content and audience growth", /linkedin|content system|personal brand|followers|creator/],
    ["leadership and management", /leadership|manager|ceo|team|culture/],
    ["strategy and business model", /strategy|business model|revenue|finance/],
  ];
  return candidates.find(([, pattern]) => pattern.test(lower))?.[0] || problemFamily;
}

function inferHookType(text, code) {
  if (code && CODE_LABELS.hook[code]) return CODE_LABELS.hook[code];
  const line = firstLine(text);
  const lower = line.toLowerCase();
  if (/\d|%|\$|€|£/.test(line) && /(result|grew|saved|cut|increase|decrease|spent|hours|posts|followers|revenue)/i.test(line)) return CODE_LABELS.hook.H1;
  if (/stuck|waste|fail|problem|wrong|miss|cost|risk|regret|flat out|falling behind/.test(lower)) return CODE_LABELS.hook.H2;
  if (/\bnot\b|isn't|aren't|instead|stop |don't need|never /.test(lower)) return CODE_LABELS.hook.H3;
  if (/how to|here's exactly|template|playbook|framework|checklist|guide|system/.test(lower)) return CODE_LABELS.hook.H4;
  if (/\b\d+\b.*(ways|steps|rules|models|skills|tools|courses|books|roles|paths)/.test(lower)) return CODE_LABELS.hook.H5;
  if (/^i (built|made|created|spent|tried|tested|learned)|^we (built|made|tested)/.test(lower)) return CODE_LABELS.hook.H6;
  if (/breaking|just launched|today|this week|new feature|latest/.test(lower)) return CODE_LABELS.hook.H7;
  if (line.endsWith("?")) return CODE_LABELS.hook.H8;
  return CODE_LABELS.hook.H9;
}

function inferJob(text, code) {
  if (code && CODE_LABELS.job[code]) return CODE_LABELS.job[code];
  const lower = text.toLowerCase();
  if (/prevent|avoid|fix|failure|risk|mistake|stop .* from/.test(lower)) return CODE_LABELS.job.J3;
  if (/choose|decide|compare|diagnos|prioriti[sz]e|which .* should/.test(lower)) return CODE_LABELS.job.J2;
  if (/build|create|automate|workflow|step by step|how to|template|prompt/.test(lower)) return CODE_LABELS.job.J4;
  if (/adopt|govern|validate|human.*owner|ai.*safe|tool.*right/.test(lower)) return CODE_LABELS.job.J6;
  if (/career|promotion|lead|influence|interview/.test(lower)) return CODE_LABELS.job.J5;
  if (/breaking|launched|changed|trend|news/.test(lower)) return CODE_LABELS.job.J7;
  if (/explain|understand|difference|what is|map|guide|cheat sheet/.test(lower)) return CODE_LABELS.job.J1;
  return CODE_LABELS.job.J0;
}

function inferProof(text, code) {
  if (code && CODE_LABELS.proof[code]) return CODE_LABELS.proof[code];
  const lower = text.toLowerCase();
  if (/i (tested|analy[sz]ed|built|ran)|my (client|team)|we (tested|built)|\d+[kmb+%].*(result|impression|lead|revenue|hours)/.test(lower)) return CODE_LABELS.proof.P1;
  if (/study|report|research|data shows|according to|deloitte|gartner|mckinsey|linkedin said/.test(lower)) return CODE_LABELS.proof.P2;
  if (/input|output|step 1|worked example|sample data|here's how it works/.test(lower)) return CODE_LABELS.proof.P3;
  if (/maersk|amazon|apple|tesla|company|case study/.test(lower)) return CODE_LABELS.proof.P4;
  if (/in my experience|i've observed|i see|i work with|i talk to/.test(lower)) return CODE_LABELS.proof.P5;
  if (/framework|model|formula|principle|matrix|map/.test(lower)) return CODE_LABELS.proof.P6;
  return CODE_LABELS.proof.P0;
}

function inferEmotionalTrigger(text) {
  const lower = text.toLowerCase();
  if (/career|promotion|leader|valuable|high paid|salary|future/.test(lower)) return "identity, status, or career aspiration";
  if (/risk|fail|mistake|wrong|stockout|disruption|regret|cost/.test(lower)) return "loss aversion and failure prevention";
  if (/surpris|secret|nobody|most people|don't need|isn't|never/.test(lower)) return "curiosity and correction";
  if (/save|checklist|template|guide|framework|map|formula/.test(lower)) return "competence and control";
  if (/breaking|new|just launched|today|this week/.test(lower)) return "novelty and timeliness";
  if (/client|revenue|leads|pipeline|growth/.test(lower)) return "commercial aspiration";
  return "informational curiosity";
}

function inferCta(text, code) {
  if (code && CODE_LABELS.cta[code]) return CODE_LABELS.cta[code];
  const lower = text.toLowerCase();
  if (/comment ["“']?[a-z0-9]+|comment .* and i('ll| will) send/.test(lower)) return CODE_LABELS.cta.C4;
  if (/buy|book|apply|join (my|the)|paid|cohort|demo/.test(lower)) return CODE_LABELS.cta.C1;
  if (/download|subscribe|sign up|visit|click|link in/.test(lower)) return CODE_LABELS.cta.C2;
  if (/dm me|message me|email me|connect with/.test(lower)) return CODE_LABELS.cta.C3;
  if (/which .*in your|where .*in your|what .*your (team|process|company)|how .*at work/.test(lower)) return CODE_LABELS.cta.C5;
  if (/what do you think|what would you add|agree|thoughts\?/.test(lower)) return CODE_LABELS.cta.C6;
  if (/follow|save this|repost|share|tag|like/.test(lower)) return CODE_LABELS.cta.C7;
  return CODE_LABELS.cta.C0;
}

function inferVisualStructure(text, artifactCode) {
  const lower = text.toLowerCase();
  if (/versus|\bvs\b|comparison|before and after|matrix/.test(lower)) return "comparison or matrix";
  if (/decision tree|branch|which .* choose|path/.test(lower)) return "decision tree or branching path";
  if (/workflow|process|steps|end.to.end|flow/.test(lower)) return "process or workflow";
  if (/formula|calculate|equation|chart|graph|data/.test(lower)) return "chart, data, or formula";
  if (/checklist|grid|index|\b\d+\b.*(ways|rules|tools|skills|items)/.test(lower)) return "checklist, grid, or index";
  if (/map|cheat sheet|reference|handbook|acronym|kpi/.test(lower) || artifactCode === "AR4") return "reference or cheat sheet";
  if (/screenshot|demo|demonstrat|output/.test(lower)) return "worked screenshot or demonstration";
  if (/metaphor|anatomy|birds|spaghetti|iceberg/.test(lower)) return "narrative illustration or metaphor";
  return "not observed or unresolved";
}

function inferFormat(record) {
  if (record.native_format_code && CODE_LABELS.format[record.native_format_code]) return CODE_LABELS.format[record.native_format_code];
  if (record.visual_observed === "image_preview_visible") return "image preview observed; native subtype unresolved";
  if (record.visual_observed === "no_image_preview_visible") return "no image preview observed; text/link/document subtype unresolved";
  return "unknown";
}

function inferTags(record) {
  const text = record.caption_observed || record.hook_observed || "";
  const problem = inferProblemFamily(text, record.problem_family_code);
  const coded = Boolean(record.hook_code || record.job_code || record.problem_family_code);
  return {
    record_id: record.record_id,
    target_audience: inferAudience(text),
    problem_family: problem,
    job_to_be_done: inferJob(text, record.job_code),
    topic: inferTopic(text, problem),
    hook_observed: firstLine(text),
    hook_type: inferHookType(text, record.hook_code),
    promise: String(text).split(/\n+/).map((line) => line.trim()).filter(Boolean).slice(0, 2).join(" "),
    proof_type: inferProof(text, record.proof_code),
    lived_experience_signal: /\b(i|we|my|our)\b/i.test(text) ? "explicit first-person language present; authenticity not independently verified" : "no explicit first-person signal observed",
    emotional_trigger: inferEmotionalTrigger(text),
    artifact_type: CODE_LABELS.artifact[record.artifact_code] || "not observed or unresolved",
    format: inferFormat(record),
    visual_structure: inferVisualStructure(text, record.artifact_code),
    cta: inferCta(text, record.cta_code),
    inference_method: coded ? "Stage-0 automated code plus rule-based enrichment" : "rule-based text classification v1",
    inference_confidence: coded ? "low-to-medium; Stage-0 meaning reliability gate failed" : "low; heuristic classification for research triage only",
    evidence_limit: "Tags are hypotheses for manual review, not causal or decision-grade labels.",
  };
}

function quantile(sorted, fraction) {
  if (!sorted.length) return null;
  const index = (sorted.length - 1) * fraction;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function topCounts(map, limit = 12) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([label, count]) => ({ label, count }));
}

export async function buildContentMarketFitDatabase({
  tigerRows,
  savedRows,
  outputDir,
  top100CsvPath,
  currentMarketCsvPath,
  collectedAt,
  annualAggregate,
}) {
  await mkdir(outputDir, { recursive: true });
  const snapshotDir = path.join(outputDir, "source-snapshots");
  await mkdir(snapshotDir, { recursive: true });
  const [top100Rows, currentMarketRows] = await Promise.all([
    readFile(top100CsvPath, "utf8").then(parseCsv),
    readFile(currentMarketCsvPath, "utf8").then(parseCsv),
  ]);

  const posts = new Map();
  const provenance = [];
  const engagement = [];
  let provenanceIndex = 0;

  function ensureRecord(activityId, fallbackText, author) {
    const recordId = activityId ? `LI-${activityId}` : `TEXT-${fnv1a(`${author}|${fallbackText}`)}`;
    if (!posts.has(recordId)) {
      posts.set(recordId, {
        record_id: recordId,
        activity_id: activityId,
        canonical_url: "",
        author: author || "",
        author_profile_url: "",
        published_at_observed: "",
        published_at_inferred_from_activity_id: inferPublishedAtFromActivityId(activityId),
        relative_age_observed: "",
        source_memberships: [],
        caption_observed: "",
        hook_observed: "",
        native_format_code: "",
        visual_observed: "",
        reactions: null,
        comments: null,
        reposts: null,
        impressions: null,
        saves: null,
        sends: null,
        profile_viewers_from_post: null,
        followers_gained: null,
        social_engagements: null,
        public_interactions: null,
        creator_follower_count_at_stage0: null,
        creator_median_public_interactions: null,
        response_ratio: null,
        reaction_rate: null,
        comment_rate: null,
        repost_rate: null,
        save_rate: null,
        send_rate: null,
        profile_viewer_rate: null,
        follower_conversion: null,
        hook_code: "",
        job_code: "",
        proof_code: "",
        artifact_code: "",
        content_class_code: "",
        problem_family_code: "",
        cta_code: "",
        collection_timestamp: collectedAt,
        missing_fields: [],
        observation_confidence: "",
        provenance_ids: [],
      });
    }
    return posts.get(recordId);
  }

  function addMembership(record, membership) {
    if (!record.source_memberships.includes(membership)) record.source_memberships.push(membership);
  }

  function addProvenance(record, sourceType, sourceReference, observationScope, limitations, confidence, sourceCollectedAt = collectedAt) {
    provenanceIndex += 1;
    const provenanceId = `PV-${String(provenanceIndex).padStart(5, "0")}`;
    provenance.push({
      provenance_id: provenanceId,
      record_id: record.record_id,
      source_type: sourceType,
      source_reference: sourceReference,
      collected_at: sourceCollectedAt,
      access_method: sourceType.startsWith("linkedin_live") ? "logged-in LinkedIn browser, read-only" : "version-controlled repository evidence",
      read_only: "true",
      observation_scope: observationScope,
      limitations,
      confidence,
    });
    record.provenance_ids.push(provenanceId);
  }

  for (const row of savedRows) {
    const activityId = normalizeActivityId(row.activityId || row.url);
    const savedAuthor = normalizeAuthor(row.author);
    const record = ensureRecord(activityId, row.captionRaw, savedAuthor);
    addMembership(record, "saved_curated_collection");
    record.canonical_url ||= row.url || (activityId ? `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}/` : "");
    record.author ||= savedAuthor;
    record.author_profile_url ||= row.profileUrl || "";
    record.relative_age_observed ||= row.ageVisible || "";
    record.caption_observed ||= row.captionRaw || "";
    record.hook_observed ||= firstLine(row.captionRaw);
    record.visual_observed ||= row.visualObserved || "";
    record.observation_confidence = "high for saved membership/text; performance fields not exposed on the saved-list surface";
    addProvenance(
      record,
      "linkedin_live_saved_collection",
      row.url || "LinkedIn saved posts list",
      "Saved membership, author, relative age, caption text, activity ID when linked, and image-preview presence.",
      "Intentionally curated reference set, not a random sample. Saved-list cards did not expose impressions or engagement counts. Seventeen text-only rows lacked activity URLs.",
      "high for visible fields; unavailable for performance",
    );
  }

  for (const row of top100Rows) {
    const activityId = normalizeActivityId(row.canonicalPostId || row.canonicalUrl);
    const record = ensureRecord(activityId, row.canonicalUrl, row.creator);
    addMembership(record, "top100_reference_library");
    record.canonical_url ||= row.canonicalUrl || "";
    record.author ||= row.creator || "";
    record.author_profile_url ||= row.creatorProfileUrl || "";
    record.published_at_observed ||= row.publishedAt || "";
    record.public_interactions ??= numberOrNull(row.publicInteractions);
    record.creator_median_public_interactions ??= numberOrNull(row.creatorMedianInteractions);
    record.response_ratio ??= numberOrNull(row.responseRatio);
    record.hook_code ||= row.hook || "";
    record.job_code ||= row.job || "";
    record.proof_code ||= row.proof || "";
    record.artifact_code ||= row.artifact || "";
    record.content_class_code ||= row.contentClass || "";
    record.problem_family_code ||= row.problemFamily || "";
    record.cta_code ||= row.cta || "";
    record.native_format_code ||= row.nativeFormat || "";
    record.observation_confidence ||= "medium; point-in-time public interaction observation with Stage-0 limitations";
    addProvenance(
      record,
      "repository_top100_reference",
      top100CsvPath,
      `Curated-success reference ${row.referenceIds || ""}; public interactions, creator baseline, automated observable-feature codes, and native format.`,
      "Curated winners are intentionally selected, overwhelmingly single-image, and cannot establish cross-format or causal effects. Meaning-heavy automated codes failed the Stage-0 reliability gate.",
      "medium for identifiers/interactions; low-to-medium for automated tags",
      "2026-07-28T00:00:00Z",
    );
  }

  for (const row of currentMarketRows) {
    const activityId = normalizeActivityId(row.canonicalPostId || row.canonicalUrl);
    const record = ensureRecord(activityId, row.canonicalUrl, row.creator);
    addMembership(record, "stage0_current_market");
    record.canonical_url ||= row.canonicalUrl || "";
    record.author ||= row.creator || "";
    record.author_profile_url ||= row.creatorProfileUrl || "";
    record.published_at_observed ||= row.publishedAt || "";
    record.reactions ??= numberOrNull(row.reactionCount);
    record.comments ??= numberOrNull(row.commentCount);
    record.reposts ??= numberOrNull(row.repostCount);
    record.public_interactions ??= numberOrNull(row.publicInteractions);
    record.creator_follower_count_at_stage0 ??= numberOrNull(row.followerCount);
    record.creator_median_public_interactions ??= numberOrNull(row.creatorMedianInteractions);
    record.response_ratio ??= numberOrNull(row.responseRatio);
    record.hook_code ||= row.hook || "";
    record.job_code ||= row.job || "";
    record.proof_code ||= row.proof || "";
    record.artifact_code ||= row.artifact || "";
    record.content_class_code ||= row.contentClass || "";
    record.problem_family_code ||= row.problemFamily || "";
    record.cta_code ||= row.cta || "";
    record.native_format_code ||= row.nativeFormat || "";
    record.observation_confidence ||= "medium; public interactions without reach, saves, or impressions";
    addProvenance(
      record,
      "repository_stage0_current_market",
      currentMarketCsvPath,
      "Public interactions, creator-relative response ratio, native format, and automated observable-feature codes.",
      "Public interactions are not reach. Creator histories have strict/decision/radar and censoring states. Meaning-heavy automated labels are exploratory only.",
      "medium for identifiers/interactions; low-to-medium for automated tags",
      "2026-07-28T00:00:00Z",
    );
  }

  for (const row of tigerRows) {
    const activityId = normalizeActivityId(row.activityId || row.canonicalPostId || row.analyticsUrl);
    const record = ensureRecord(activityId, row.postTextObserved, row.creator || "Poornajith Shetty");
    addMembership(record, "tiger_live_native_analytics");
    record.canonical_url = row.canonicalUrl || `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}/`;
    record.author = row.creator || "Poornajith Shetty";
    record.author_profile_url = row.creatorProfileUrl || "https://www.linkedin.com/in/shettys-desk/";
    record.published_at_observed ||= row.publishedAt || "";
    record.relative_age_observed ||= row.ageVisible || "";
    record.caption_observed = row.postTextObserved || record.caption_observed;
    record.hook_observed = firstLine(record.caption_observed);
    record.native_format_code = row.nativeFormat || record.native_format_code;
    record.reactions = numberOrNull(row.reactions);
    record.comments = numberOrNull(row.comments);
    record.reposts = numberOrNull(row.reposts);
    record.impressions = numberOrNull(row.impressions);
    record.saves = numberOrNull(row.saves);
    record.sends = numberOrNull(row.sends);
    record.profile_viewers_from_post = numberOrNull(row.profileViewersFromPost);
    record.followers_gained = numberOrNull(row.followersGained);
    record.social_engagements = numberOrNull(row.socialEngagements);
    record.public_interactions = [record.reactions, record.comments, record.reposts].every((value) => value === null)
      ? record.public_interactions
      : (record.reactions || 0) + (record.comments || 0) + (record.reposts || 0);
    record.reaction_rate = numberOrNull(row.reactionRate);
    record.comment_rate = numberOrNull(row.commentRate);
    record.repost_rate = numberOrNull(row.repostRate);
    record.save_rate = numberOrNull(row.saveRate);
    record.send_rate = numberOrNull(row.sendRate);
    record.profile_viewer_rate = numberOrNull(row.profileViewerRate);
    record.follower_conversion = numberOrNull(row.followerConversion);
    record.hook_code = row.hook || record.hook_code;
    record.job_code = row.job || record.job_code;
    record.proof_code = row.proof || record.proof_code;
    record.artifact_code = row.artifact || record.artifact_code;
    record.content_class_code = row.contentClass || record.content_class_code;
    record.problem_family_code = row.problemFamily || record.problem_family_code;
    record.cta_code = row.cta || record.cta_code;
    record.collection_timestamp = row.collectedAt || collectedAt;
    record.observation_confidence = "high for native analytics visible at collection time; metrics may continue to drift";
    addProvenance(
      record,
      "linkedin_live_tiger_native_analytics",
      row.analyticsUrl,
      "Native per-post impressions, reactions, comments, reposts, saves, sends, profile viewers, followers gained, and full visible caption.",
      "Point-in-time capture; LinkedIn metrics can continue to change. Profile history exposed 60 posts, while the 365-day aggregate exceeded the sum of the 60 post pages by a small amount.",
      "high for visible fields",
      row.collectedAt || collectedAt,
    );
  }

  const postRows = [...posts.values()].map((record) => {
    record.source_memberships.sort();
    const missing = [];
    for (const field of [
      "canonical_url",
      "published_at_observed",
      "caption_observed",
      "impressions",
      "reactions",
      "comments",
      "reposts",
      "saves",
      "sends",
      "profile_viewers_from_post",
      "followers_gained",
    ]) {
      if (record[field] === null || record[field] === "") missing.push(field);
    }
    record.missing_fields = missing;
    return record;
  }).sort((a, b) => a.record_id.localeCompare(b.record_id));

  const inferenceRows = postRows.map(inferTags);
  const inferenceById = new Map(inferenceRows.map((row) => [row.record_id, row]));

  for (const record of postRows) {
    const metrics = [
      ["impressions", record.impressions, null, null],
      ["reactions", record.reactions, "impressions", record.impressions],
      ["comments", record.comments, "impressions", record.impressions],
      ["reposts", record.reposts, "impressions", record.impressions],
      ["saves", record.saves, "impressions", record.impressions],
      ["sends", record.sends, "impressions", record.impressions],
      ["profile_viewers_from_post", record.profile_viewers_from_post, "impressions", record.impressions],
      ["followers_gained", record.followers_gained, "impressions", record.impressions],
      ["public_interactions", record.public_interactions, "creator_median_public_interactions", record.creator_median_public_interactions],
    ];
    for (const [metricName, value, denominatorName, denominatorValue] of metrics) {
      if (value === null) continue;
      engagement.push({
        engagement_id: `EN-${String(engagement.length + 1).padStart(6, "0")}`,
        record_id: record.record_id,
        metric_name: metricName,
        metric_value: value,
        denominator_name: denominatorName || "",
        denominator_value: denominatorValue,
        normalized_value: denominatorValue ? value / denominatorValue : metricName === "public_interactions" ? record.response_ratio : null,
        collection_timestamp: record.collection_timestamp,
        provenance_ids: record.provenance_ids,
        comparability_note: denominatorName === "impressions"
          ? "Within-post rate; compare only at similar maturity and audience conditions."
          : metricName === "public_interactions"
            ? "Creator-relative public-interaction ratio from Stage 0; not reach, saves, or impression rate."
            : "Raw observation; no valid denominator available.",
      });
    }
  }

  const tiger = postRows.filter((row) => row.source_memberships.includes("tiger_live_native_analytics") && row.impressions !== null);
  const sortedImpressions = tiger.map((row) => row.impressions).sort((a, b) => a - b);
  const tigerByImpressions = [...tiger].sort((a, b) => b.impressions - a.impressions);
  const tigerSum = sortedImpressions.reduce((sum, value) => sum + value, 0);
  const saved = postRows.filter((row) => row.source_memberships.includes("saved_curated_collection"));
  const savedInferences = saved.map((row) => inferenceById.get(row.record_id));
  const savedAuthorCounts = new Map();
  const savedAudienceCounts = new Map();
  const savedProblemCounts = new Map();
  const savedHookCounts = new Map();
  const savedCtaCounts = new Map();
  const savedVisualCounts = new Map();
  const publishedProblemCounts = new Map();
  const publishedAudienceCounts = new Map();
  for (const row of saved) increment(savedAuthorCounts, row.author || "unknown");
  for (const row of savedInferences) {
    increment(savedAudienceCounts, row.target_audience);
    increment(savedProblemCounts, row.problem_family);
    increment(savedHookCounts, row.hook_type);
    increment(savedCtaCounts, row.cta);
    increment(savedVisualCounts, row.visual_structure);
  }
  for (const row of tiger) {
    const inferred = inferenceById.get(row.record_id);
    increment(publishedProblemCounts, inferred.problem_family);
    increment(publishedAudienceCounts, inferred.target_audience);
  }

  const overlapCount = (a, b) => postRows.filter((row) => row.source_memberships.includes(a) && row.source_memberships.includes(b)).length;
  const summary = {
    generated_at: collectedAt,
    database: {
      deduplicated_posts: postRows.length,
      provenance_observations: provenance.length,
      engagement_observations: engagement.length,
      inferred_tag_rows: inferenceRows.length,
    },
    source_layers: {
      tiger_native_analytics: tiger.length,
      saved_curated_collection: saved.length,
      saved_with_activity_id: saved.filter((row) => row.activity_id).length,
      saved_without_activity_id: saved.filter((row) => !row.activity_id).length,
      top100_reference_library: postRows.filter((row) => row.source_memberships.includes("top100_reference_library")).length,
      stage0_current_market: postRows.filter((row) => row.source_memberships.includes("stage0_current_market")).length,
    },
    overlaps: {
      saved_and_top100: overlapCount("saved_curated_collection", "top100_reference_library"),
      saved_and_current_market: overlapCount("saved_curated_collection", "stage0_current_market"),
      saved_and_tiger: overlapCount("saved_curated_collection", "tiger_live_native_analytics"),
      top100_and_current_market: overlapCount("top100_reference_library", "stage0_current_market"),
    },
    tiger_performance: {
      post_count: tiger.length,
      post_page_impressions_sum: tigerSum,
      annual_aggregate_snapshot: annualAggregate,
      annual_aggregate_minus_post_page_sum: annualAggregate?.impressions == null ? null : annualAggregate.impressions - tigerSum,
      mean_impressions: tigerSum / tiger.length,
      median_impressions: quantile(sortedImpressions, 0.5),
      p25_impressions: quantile(sortedImpressions, 0.25),
      p75_impressions: quantile(sortedImpressions, 0.75),
      top_1_share: tigerByImpressions[0]?.impressions / tigerSum,
      top_2_share: (tigerByImpressions[0]?.impressions + tigerByImpressions[1]?.impressions) / tigerSum,
      top_3_share: (tigerByImpressions[0]?.impressions + tigerByImpressions[1]?.impressions + tigerByImpressions[2]?.impressions) / tigerSum,
      top_posts: tigerByImpressions.slice(0, 10).map((row) => ({
        record_id: row.record_id,
        url: row.canonical_url,
        hook: row.hook_observed,
        impressions: row.impressions,
        reactions: row.reactions,
        comments: row.comments,
        reposts: row.reposts,
        saves: row.saves,
        sends: row.sends,
        profile_viewers: row.profile_viewers_from_post,
        followers_gained: row.followers_gained,
        save_rate: row.save_rate,
        follower_conversion: row.follower_conversion,
      })),
      bottom_posts: tigerByImpressions.slice(-10).reverse().map((row) => ({
        record_id: row.record_id,
        url: row.canonical_url,
        hook: row.hook_observed,
        impressions: row.impressions,
        reactions: row.reactions,
        comments: row.comments,
        reposts: row.reposts,
        saves: row.saves,
        followers_gained: row.followers_gained,
      })),
      problem_family_distribution: topCounts(publishedProblemCounts, 20),
      audience_distribution: topCounts(publishedAudienceCounts, 20),
    },
    saved_curated_patterns: {
      authors: topCounts(savedAuthorCounts, 20),
      target_audiences: topCounts(savedAudienceCounts, 20),
      problem_families: topCounts(savedProblemCounts, 20),
      hook_types: topCounts(savedHookCounts, 20),
      ctas: topCounts(savedCtaCounts, 20),
      visual_structures: topCounts(savedVisualCounts, 20),
      caveat: "Saved posts are an intentionally curated high-performing/interesting reference set. These counts describe the collection and packaging evidence; they do not estimate population prevalence or causal performance effects.",
    },
  };

  const postColumns = [
    "record_id", "activity_id", "canonical_url", "author", "author_profile_url", "published_at_observed",
    "published_at_inferred_from_activity_id", "relative_age_observed", "source_memberships", "caption_observed",
    "hook_observed", "native_format_code", "visual_observed", "reactions", "comments", "reposts", "impressions",
    "saves", "sends", "profile_viewers_from_post", "followers_gained", "social_engagements", "public_interactions",
    "creator_follower_count_at_stage0", "creator_median_public_interactions", "response_ratio", "reaction_rate",
    "comment_rate", "repost_rate", "save_rate", "send_rate", "profile_viewer_rate", "follower_conversion",
    "hook_code", "job_code", "proof_code", "artifact_code", "content_class_code", "problem_family_code", "cta_code",
    "collection_timestamp", "missing_fields", "observation_confidence", "provenance_ids",
  ];
  const inferenceColumns = [
    "record_id", "target_audience", "problem_family", "job_to_be_done", "topic", "hook_observed", "hook_type",
    "promise", "proof_type", "lived_experience_signal", "emotional_trigger", "artifact_type", "format", "visual_structure",
    "cta", "inference_method", "inference_confidence", "evidence_limit",
  ];
  const provenanceColumns = [
    "provenance_id", "record_id", "source_type", "source_reference", "collected_at", "access_method", "read_only",
    "observation_scope", "limitations", "confidence",
  ];
  const engagementColumns = [
    "engagement_id", "record_id", "metric_name", "metric_value", "denominator_name", "denominator_value",
    "normalized_value", "collection_timestamp", "provenance_ids", "comparability_note",
  ];

  await Promise.all([
    writeFile(path.join(outputDir, "posts.csv"), toCsv(postRows, postColumns)),
    writeFile(path.join(outputDir, "posts.jsonl"), postRows.map((row) => JSON.stringify(row)).join("\n") + "\n"),
    writeFile(path.join(outputDir, "inferences.csv"), toCsv(inferenceRows, inferenceColumns)),
    writeFile(path.join(outputDir, "inferences.jsonl"), inferenceRows.map((row) => JSON.stringify(row)).join("\n") + "\n"),
    writeFile(path.join(outputDir, "provenance.csv"), toCsv(provenance, provenanceColumns)),
    writeFile(path.join(outputDir, "engagement-observations.csv"), toCsv(engagement, engagementColumns)),
    writeFile(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n"),
    writeFile(
      path.join(snapshotDir, "linkedin-tiger-native-analytics.jsonl"),
      tigerRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    ),
    writeFile(
      path.join(snapshotDir, "linkedin-saved-curated-collection.jsonl"),
      savedRows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    ),
  ]);

  return summary;
}
