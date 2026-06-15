# AI for SC — RFQ with Claude
**Week**: 2026-W21
**Theme**: Procurement
**Role**: Purchaser
**Tool**: Claude
**Episode**: Ep27 (unified series numbering)
**Visual Format**: Blueprint Draft (hub-and-spoke)
**Hero Statement**: "2-3 days → 20 min"
**Status**: Published
**Code-rendered visual**: `renderer/templates/pf7-blueprint-draft.html` → `out/pf7-blueprint-draft.png` (PF7 Blueprint Draft, homogeneous Shetty's Desk system — RFQ draft sheet + weighted scoring matrix; full brief in `references/ai-for-sc-render-briefs.md`).

---

## Selected Hook
**Type**: Timeline-Shock
**Text**: A standard RFQ takes 2 to 3 days to write internally. With a structured Claude prompt and your requirements pasted in, it takes 20 minutes.

## LinkedIn Caption

A standard RFQ takes 2 to 3 days to write internally. With a structured Claude prompt and your requirements pasted in, it takes 20 minutes.

The difference is not quality, it is knowing which inputs to prepare before you open the chat.

Supply Chain 101 covered the procurement funnel this week. This is the execution layer: the same process, with a tool that cuts RFQ writing.

Most procurement teams rebuild the same document structure every time they go to market. The scope section, the technical requirements, the commercial terms and the evaluation criteria. None of these change dramatically between categories, and yet they get rewritten from scratch, reviewed internally, revised for language, and sent out three days later than they needed to be.

The prompt that cuts this to 20 minutes has five inputs; that is the preparation work. Everything else Claude handles.

• Category -> What you are sourcing, approximate annual volume, and the number of suppliers you plan to invite.

• Specifications -> Your technical requirements. Paste in whatever you have: a product brief, a spec sheet summary, even a bullet list. Claude structures it.

• Scoring Criteria -> How you will evaluate responses. Quality, price, lead time, references. You decide the weighting. Claude writes the scoring matrix.

• Commercial terms  -> Payment terms, Incoterms, contract length expectation.

• Timeline -> When you need supplier responses and when you plan to award.

Then paste the prompt in the comments into Claude.

The output is a complete RFQ. Review the requirements as those are yours to own whereas the structure and language are Claude's.

One caveat: if your input data is incomplete or your specifications are still a rough list, the document structure will be clean but the requirements inside it will still need your work. Claude builds around what you give it.

---

Follow Poornajith Shetty and Shetty's Desk for more supply chain insights and save this for the next time your team is rebuilding an RFQ from scratch

#ShettysDesk #SupplyChainIntelligence #SCM #AIforSupplyChain #Procurement

---

## Gemini Prompt (paste-ready)

Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. The reference image shows a hub-and-spoke infographic: a large central starburst at the geometric centre of the canvas, surrounded by satellite cards arranged radially. Each card has a coloured rounded-border label at the top naming the card category, an icon top-left, a bold title, 3 to 4 lines of body copy, and a coloured pill at the bottom. The hub and satellite cards together fill the entire canvas with zero dead space. Replicate this card anatomy, hub scale, canvas density, and typography weight exactly. Do not use any information or text from the attached image. Aspect ratio 1:1, resolution 2048x2048.

TOOL IDENTITY: Claude (Anthropic). Background: warm off-white, identical tone to the reference image. All structural accents and the hub symbol use Anthropic coral. Hub symbol: an 8-pointed starburst with slightly curved tapering arms radiating from a small hollow centre point, like a snowflake with smooth organic arms. Rendered in Anthropic coral. The hub sits at the geometric centre of the canvas. Its diameter is large and commanding, roughly matching the hub scale in the reference image.

TOPIC: Stop Rebuilding Your RFQ From Scratch

THE VISUAL CONCEPT: A hub-and-spoke transformation diagram. The Claude coral starburst sits at the exact centre. On the left arc, five satellite cards arranged from 11 o'clock to 7 o'clock. These are what the practitioner brings. On the right arc, six satellite cards arranged from 1 o'clock to 5 o'clock. These are what Claude builds. Thin straight lines connect each card to the hub. The left-to-right layout reads as: you bring inputs, Claude builds the document.

HEADING: "Stop Rebuilding Your RFQ From Scratch" — bold, large, dark charcoal, positioned in the top-left area of the canvas above the left arc cards. The word "Scratch" is in Anthropic coral. Below the heading in italic regular text: "3 days of writing. One 20-minute Claude session."

TIME COMPARISON VISUAL (top-right corner): A compact before/after visual showing the time reduction. Two stacked rows inside a lightly bordered box. Top row: a small clock icon followed by bold text "2-3 DAYS" in dark charcoal with small caps label "MANUAL" beside or below it. Bottom row: a small lightning bolt icon followed by bold text "20 MIN" in Anthropic coral with small caps label "WITH CLAUDE" beside or below it. A thin horizontal divider separates the two rows. A right-pointing arrow or downward arrow between the rows signals the transformation direction. No source attribution text. The numbers are bold and approximately 2 to 3 times the size of the label text.

LEFT ARC — INPUT CARDS (what you bring). Each card: warm grey rounded border, label "YOU BRING" in small grey bold caps at top, icon top-left, bold ALL CAPS title, one-line summary in italic below the title, 3-line description body, bottom pill "YOU PROVIDE" in grey.

- CATEGORY: Your category in one sentence. Full description: What you are sourcing, the approximate annual volume, the number of suppliers you plan to invite, and the commodity or service classification that governs evaluation.

- SPECIFICATIONS: Paste whatever you have. Full description: A product brief, a spec sheet summary, or a bullet list of technical requirements. Any format works. Claude structures it into formal technical language.

- SCORING CRITERIA: Your weightings, your call. Full description: Quality percentage, price percentage, lead time percentage, and references. You decide the split. Claude writes the scoring matrix and evaluation language.

- COMMERCIAL TERMS: Two lines is enough. Full description: Payment terms, the applicable Incoterm, expected contract length, and any warranty or liability clause requirements you already know.

- TIMELINE: Two dates. Full description: The date supplier responses are due and the date you plan to award. Claude fills in standard submission instructions and deadline language around them.

RIGHT ARC — OUTPUT CARDS (what Claude builds). Each card: Anthropic coral rounded border, label "CLAUDE BUILDS" in small coral bold caps at top, icon top-left, bold ALL CAPS title, one-line summary in italic below the title, 3-line description body, bottom pill "READY TO SEND" in coral.

- SCOPE OF SUPPLY: Structured from your category and volume. Full description: A formal scope section naming the commodity, volume, delivery location, and any exclusions, written in standard procurement document language ready to send.

- TECHNICAL REQUIREMENTS: Formatted from your spec material. Full description: Your bullet list or brief converted into numbered technical clauses with performance thresholds, tolerance statements, and compliance references formatted to supplier-ready standard.

- EVALUATION CRITERIA: Scoring framework from your weightings. Full description: A weighted scoring matrix with your stated percentages, defined scoring bands per criterion, and instructions for how supplier responses will be ranked.

- COMMERCIAL TERMS: Incoterms and payment language added. Full description: Your stated terms expanded into formal contractual language. Standard Incoterm definitions, payment schedule clauses, and penalty provisions added.

- SUBMISSION FORMAT: Response structure and deadline language. Full description: Instructions telling suppliers exactly how to respond, what documents to include, how to structure pricing, and the hard submission deadline with timezone.

- DISQUALIFICATION CONDITIONS: Standard conditions added. Full description: Late submissions, incomplete pricing, missing compliance documents, and undisclosed conflicts of interest. You review and confirm before sending.

CONCLUSION LINE (at the very bottom of the canvas, centred):
"Claude builds the document, you own the category knowledge."
Italic, regular weight, readable at mobile size.

CONTENT RULES:
- Total words on image: 200 to 260 across all elements. This is a dense reference document, not a decorative slide.
- The hub starburst is the largest single element on the canvas. It dominates the centre. It is not a small icon.
- Left arc cards have warm grey borders throughout. Right arc cards have Anthropic coral borders throughout. This colour difference carries the transformation story.
- Each card body description is 20 to 30 words, functional and specific, naming what the practitioner actually provides or receives.
- The one-line italic summary under each card title is the skimmer version. The body copy is the reader version.
- Cards from both arcs extend close to the canvas edge. Zero empty canvas space.
- Maximum 2 font families: bold sans-serif for titles and labels, regular weight for descriptions.
- ALL CAPS for card titles and pill labels. Sentence case for descriptions.
- All text readable at mobile phone size.

DO NOT:
- Reduce the hub to a small badge or icon. It must be a large, commanding centrepiece.
- Place all cards on one side.
- Use the same border colour for left and right arc cards.
- Use gradients on any card backgrounds.
- Use more than 2 font families.
- Include em dashes anywhere on the image. Replace with a comma or a full stop.
- Render any size, measurement, or numerical value from these instructions as visible text on the image.
- Leave empty canvas space at the top, bottom, or sides.
- Add any source attribution, reference text, or footnote text anywhere on the image.
