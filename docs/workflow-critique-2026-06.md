# Shetty's Desk — Workflow Critique (June 2026)

**Purpose**: Evidence-based record of why the current pipeline is being rebuilt. Written to inform future decisions and prevent regression.

---

## Performance Reality Check

Four posts with analytics data. One post measured at the top of the range is treated as a reference point; the others represent the baseline.

| Post | Impressions | Saves | Followers | Composite Score |
|---|---|---|---|---|
| Maersk (Feb 20) | 55,142 | 63 | +114 | 249.94 |
| Zara (Feb 23) | 731 | 1 | +2 | 5.33 |
| Nike (Feb 27) | 565 | 0 | +1 | 1.42 |
| Dabbawalas (Mar 1) | 335 | 1 | 0 | 5.69 |

Performance gap between Maersk and the next best post: 44x impressions, 63x saves. This is not marginal underperformance. It is a different category of post.

---

## What Made Maersk Work

Maersk was not on a pre-planned calendar. It was a timely story (major strategic shift by a named company) with a strong hook ("Why is the world's second-largest shipping company buying warehouses instead of ships?"), real numbers, and a clear commercial argument. The three posts that followed used the same pipeline and got 1–5% of Maersk's impressions. The difference was not voice or format — it was the absence of timeliness and a compelling story premise.

**Conclusion:** Pre-planned calendar topics cannot replicate what made Maersk work. Timeliness and story tension need to be baked into the system.

---

## The Six Structural Problems

### 1. Manual gate overload — 12–16 decisions per post

Every post in the current pipeline requires:
- Use-case confirmation (AI for SC)
- Hook selection (1-10 pick)
- PDF gate (Yes/No)
- Manual Gemini Gem paste (with brand anchor upload each session)
- Manual LinkedIn posting
- Manual analytics entry

Four posts per week = 12–16 user decisions per week minimum. The cadence collapsed under this load. Evidence: 22 posts bulk-dumped on May 8 to hit a deadline. W21/W22 posts generated but unpublished as of June 10, 2026.

### 2. Publishing accident from zero QA

The Nike post analytics record shows the Gemini prompt text was pasted as the LinkedIn caption and published. The current workflow has no quality gate between generation and publication — copy-paste errors go live.

### 3. Feedback loop closed once and never again

The pattern-synthesizer agent and style-guide-learned.md exist in the system. The visual format performance log in ai-for-sc-series-tracker.md is empty. The analytics log has 4 rows, all from February. The system built the learning infrastructure but never ran it. Without performance data, each post is generated in a vacuum, repeating patterns that may not work.

### 4. Image generation is the biggest manual toll gate

Generating each infographic requires: opening gemini.google.com, loading the Gemini Gem, uploading brand-anchor-v1.webp (every session), pasting the prompt, downloading the output, checking quality, and iterating manually. This is 10-15 minutes per image with no consistency guarantee and no retry logic. The Nike prompt-as-caption accident happened in this exact workflow.

### 5. Content is surface-level

Current 101 posts answer "what is X?" Current AI-for-SC posts describe AI workflows at a level of abstraction that does not require the reader to change anything they do today. The test: would a supply chain practitioner screenshot this to use in a work meeting tomorrow? For most posts generated to date, the answer is no.

Tiger's stated standard from tiger-voice.md: "Leave the reader with something they didn't have before. Practical, useful, the shortcut feeling — like someone in a meeting shares a system shortcut you didn't know existed and you think: that was worth the time."

The content does not yet clear this bar.

### 6. Wrong format for 2026 LinkedIn algorithm

Current output: single 1:1 images. LinkedIn algorithm data (2026):
- Single images underperform text-only posts by 30%
- Document/PDF carousels get 6.6% engagement — the highest of any format
- Dwell time above 60 seconds drives 15.6% engagement vs 1.2% for under 3 seconds
- Saves are 5x a like; comments (15+ words) are 15x a like

A single static image gets scanned in 2-3 seconds. The format itself limits dwell time. This is being noted for future exploration — the immediate rebuild focuses on dramatically improving the depth and utility of single images before a format migration is considered.

---

## What This Critique Is Not Saying

- The voice training is not the problem. tiger-voice.md is strong and the Maersk post demonstrates it works.
- The topic plan (101-plan.md, ai-for-sc-plan-v2.md) is not the problem. Pre-planned topics are a reasonable foundation — the problem is the execution layer on top of them.
- The visual DNA files (ai-for-sc-visual-dna.md, 50 formats) are not the problem. The problem is that the visual design never survived the manual Gemini paste step reliably.

---

## What Is Being Changed

1. Manual toll gates replaced with one weekly review gate (15 min)
2. Image generation automated via scripts (Gemini Flash + gpt-image-1 APIs) with a GSAP/Three.js renderer for deterministic, brand-accurate visuals
3. LinkedIn publishing automated via LinkedIn REST API + GitHub Actions cron queue
4. Feedback loop automated via /pulse skill — runs weekly, feeds next autopilot run
5. Content standards upgraded: operational consequences not definitions, actual prompt text in visual, output format shown
6. QA agent added: visual-qa.md reviews every generated image before it enters the digest

**Preserved:** Voice DNA (tiger-voice.md), pre-defined topic plans as backbone, brand identity direction.

---

*Written: 2026-06-10. Rebuild documented in plan file `/root/.claude/plans/jiggly-inventing-storm.md`.*
