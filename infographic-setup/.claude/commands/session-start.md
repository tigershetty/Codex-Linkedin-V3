Check the current state of the content engine and brief me so I can pick up where I left off.

Do the following in order:

1. **Find the current week.** List folders in `data/` and identify the most recent ISO week folder (YYYY-W##).

2. **Find active slugs.** Inside that week folder, list topic-slug subdirectories and which files exist in each.

3. **Report pipeline stage per slug** (active pipelines):
   - `101-copy.md` → Supply Chain 101 post done
   - `ai-for-sc-[use-case-slug].md` → AI for SC post done (note its render brief / rendered visual)
   - `analytics.md` → published and tracked

4. **Flag incomplete AI for SC posts.** Any `ai-for-sc-[slug].md` where a PDF was requested but
   `ai-for-sc-[slug]-pdf.md` is missing — call it out.

5. **Ask which pipeline:** "Supply Chain 101 (`/101`) or AI for Supply Chain (`/ai-for-sc`)?"
   Both draw from `references/master-calendar.md` (101 → `references/101-plan.md`; AI for SC → `references/ai-for-sc-plan-v2.md`).

Format the output as a brief status block — week, slugs, stage, any incomplete posts.

(Deep Dive is archived — its skills live in `skills-archive/deep-dive/`.)
