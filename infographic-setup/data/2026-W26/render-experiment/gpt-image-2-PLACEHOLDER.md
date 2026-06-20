# Leg 2 (GPT Image 2) — artifact placeholder

The AI still was generated successfully via Higgsfield's **`gpt_image_2`** (OpenAI GPT Image 2), 2k / high quality / 3:4, count 1, **7 credits**.

- **Higgsfield job id**: `c1a6d680-4137-48b2-92b6-eced1ddf2911`
- **Output dimensions**: 1744 × 2336
- **Source URL** (Higgsfield CDN): `https://d8j0ntlcm91z4.cloudfront.net/user_36nO0VpCP9ZE6NTJ5zSpcZn1r4B/hf_20260620_221734_c1a6d680-4137-48b2-92b6-eced1ddf2911.png`
- **Prompt**: see the "Render Brief" in `../supplier-scorecard-qbr/ai-for-sc-supplier-scorecard-qbr.md` and the analysis.

## Why it isn't committed yet
The Higgsfield CDN host (`d8j0ntlcm91z4.cloudfront.net`) was not in this container's **network egress allowlist**, so the bytes could not be pulled into the sandbox (curl/WebFetch returned `Host not in allowlist`). Allowlisting the host takes effect in a **new** session/container, not the running one.

## To bring it into the repo
Either:
1. **New session** with the host allowlisted, then:
   ```bash
   curl -sS -o data/2026-W26/render-experiment/higgsfield-gpt-image-2.png \
     "https://d8j0ntlcm91z4.cloudfront.net/user_36nO0VpCP9ZE6NTJ5zSpcZn1r4B/hf_20260620_221734_c1a6d680-4137-48b2-92b6-eced1ddf2911.png"
   ```
2. Or download it from the **Higgsfield UI** (Generations → job above) and save it here as `higgsfield-gpt-image-2.png`.

Then delete this placeholder. Lane-2 visual QA (cell-level text accuracy, logo fidelity, palette drift) can be completed against the file at that point.
