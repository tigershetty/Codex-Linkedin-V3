Prepare the Gemini handoff for the current infographic slug.

Do the following in order:

1. **Find the current slug.** Check `data/` for the most recent ISO week folder and active slug (the one with `gemini-prompt.md`).

2. **Read the prompt.** Open `data/{week}/{slug}/gemini-prompt.md`.

3. **Voice check.** Before outputting, verify the prompt does not contain:
   - Em dashes (—)
   - AI slop words: "leverage", "utilize", "delve", "moreover", "furthermore", "plays a crucial role"
   - Over-hedging: "it could be argued", "arguably", "one might consider"
   - ANCHORS slot format (A:, N:, C:, H:, O:, R:, S:, T:)
   - Any negative prompt language (this degrades Gemini render quality — documented in `references/gemini-gem-standard.md`)

   If any violations found, flag them and ask whether to fix before proceeding.

4. **Output the prompt.** Print the full prompt in a code block, ready to paste directly into Gemini.

5. **Pre-flight checklist.** Output this checklist after the prompt:

   ```
   Gemini Pre-Flight
   ─────────────────────────────
   □ Upload references/brand-anchor-v1.webp to this Gemini session
   □ Confirm "Shetty's Desk — Infographic Engine" Gem is loaded
   □ No negative prompts added (degrades render quality)
   □ Prompt pasted — ready to generate
   ```
