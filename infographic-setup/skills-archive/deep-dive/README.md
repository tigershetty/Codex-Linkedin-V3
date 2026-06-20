# Deep Dive Pipeline (ARCHIVED)

The data-heavy, research-backed infographic pipeline for senior practitioners. Archived to keep the
active engine focused on the two pipelines in use (`/101`, `/ai-for-sc`). Reversible.

## Stage sequence
```
/scout → [CG1 pick topic] → /research → /message → [CG2 pick hook] → /content → /gemini-prompt
( /retrospective ~7 days after publish; /publish-ready is the pre-publish QA gate )
```

## What's here
- `skills/` — scout, research, message, content, gemini-prompt, infographic, retrospective, publish-ready
- `references/` — gemini-gem-standard.md, infographic-visual-dna.md, infographic-layout-library.md

## To restore Deep Dive
1. Move the skills back:
   ```
   git mv infographic-setup/skills-archive/deep-dive/skills/* infographic-setup/.claude/skills/
   ```
2. Move the references back:
   ```
   git mv infographic-setup/skills-archive/deep-dive/references/* infographic-setup/references/
   ```
3. `references/published-voice.md` is already active (the `/ai-for-sc` pipeline uses it too), and
   `references/brand-anchor-v1.webp` is still in place — both are what the Deep Dive visual step needs.
4. Re-add Deep Dive to `infographic-setup/CLAUDE.md` and `references/content-types-map.md`.
