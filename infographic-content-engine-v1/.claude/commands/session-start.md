Check the current state of the infographic pipeline and brief me so I can pick up where I left off.

Do the following in order:

1. **Find the current week.** List all folders inside `data/` and identify the most recent ISO week folder (format: YYYY-W##).

2. **Find the active slug.** Inside that week folder, list any topic-slug subdirectories. If multiple exist, identify which is furthest along.

3. **Report pipeline stage.** For the active slug, check which of these files exist and report the current stage:
   - `research.md` → Research done
   - `message-commit.md` → Hook selected (CG2 complete)
   - `content.md` → Content written
   - `gemini-prompt.md` → Prompt ready
   - `performance.md` → Published and tracking

4. **Flag incomplete gates:**
   - If `topic-scout.md` exists but no slug folder → CG1 pending (topic not selected)
   - If `research.md` exists but no `message-commit.md` → CG2 pending (hook not selected)

5. **Gemini reminder.** Always output this line at the end:
   > ⚠️ Gemini session reminder: upload `references/brand-anchor-v1.webp` before generating the infographic. It is not stored in the Gem.

Format the output as a brief status block — week, slug, stage, any pending gates, reminder.
