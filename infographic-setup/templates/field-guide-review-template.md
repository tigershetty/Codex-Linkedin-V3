# Field Guide Package Review — {Title}

**Field guide ID:** `{FG-...}`
**Status:** `draft` / `ready`
**Truth class:** `framework` / `evidence_display` / `operating_method` / `case_or_event`
**Reviewer:**
**Date:**
**Spec:** `field-guide-spec.json`

Run before design handoff:

```sh
node scripts/validate-field-guide-package.mjs --input data/{week}/{slug}/field-guide-spec.json
```

Use `--allow-draft` only while intentionally reviewing a draft. A passing validator confirms the
contract is complete; it does not prove a design is good or claims are true.

## 1. Reader Contract

- [ ] The reader moment is recognisable without reading the caption.
- [ ] The decision question is answerable from the guide itself.
- [ ] The 3-second promise is legible at feed size.
- [ ] The 10-second scan reveals the navigational spine.
- [ ] The 30-second use gives a concrete next action.
- [ ] The guide adds a practical object rather than restating a generic lesson.

**What the reader can do after 30 seconds:**

## 2. Truth And Evidence

- [ ] The declared truth class matches what the guide is actually doing.
- [ ] The truth contract says the guide's basis, scope, and what it is not claiming.
- [ ] Framework material is presented as a framework, not as measured proof.
- [ ] Every factual, numerical, company, causal, personal, case-outcome, or formula claim has an appropriate evidence record.
- [ ] Every evidence record has a traceable source ID, or a formula derivation where that is the valid support.
- [ ] Qualifications are visible where a claim is conditional, uncertain, or editorial.
- [ ] The guide contains no synthetic result, invented case, or internal fixture presented as public proof.
- [ ] For an operating method, inputs, validation, and the human decision boundary are explicit.
- [ ] For a hypothesis or simulation, inputs, method, and uncertainty are visible; it is not presented as customer proof.
- [ ] For Tiger judgment, the approved Tiger source ID and judgment framing are recorded.
- [ ] For an evidence display or case/event, the load-bearing evidence is readable in the final visual or its linked support.

**Claim/evidence decision:**

## 3. Semantic Visual Argument

> The reader understands `{claim}` because the guide shows `{relationship}`.

- [ ] The spatial model makes the intended argument; it is not decoration.
- [ ] The model does not smuggle in a false claim of hierarchy, sequence, ranking, overlap, or certainty.
- [ ] The reason the shape is truthful is stated in the spec.
- [ ] The anti-misread note names the most likely false inference.
- [ ] The visual has one primary navigational spine and no competing first read.
- [ ] Each module earns its place by helping the reader decide, check, compare, or act.

**Spatial model:**
**Why it is truthful:**
**Most likely false inference prevented:**

## 4. Module And Boundary Test

- [ ] The guide has 3–7 modules; no module is filler.
- [ ] Every module has a clear reader action and a traceable claim.
- [ ] Grouping and reading order work on a phone without the caption.
- [ ] The boundary/exception is practical, not a legalistic disclaimer.
- [ ] The exception tells the reader what to do when the normal route fails.
- [ ] The guide says what it cannot decide for the reader.

**Boundary / exception:**
**Reader response when it applies:**

## 5. Motion Decision

- [ ] `still` is selected when the guide is mainly a stable reference.
- [ ] If motion is selected, it teaches one named sequence, state change, path, cause/effect, or regrouping.
- [ ] Motion does not animate every module or make the reader wait for the answer.
- [ ] A legible static counterpart remains available.
- [ ] The opening and final complete states preserve the approved guide.

**Motion decision:** `still` / `motion`
**What motion communicates, if used:**
**Why a still would not do the same job, if motion is used:**

## 6. Final Decision

| Check | Pass / revise / reject | Notes |
|---|---|---|
| Reader value |  |  |
| Truth and evidence |  |  |
| Semantic visual argument |  |  |
| Mobile reading and hierarchy |  |  |
| Boundary / exception |  |  |
| Motion restraint |  |  |

**Decision:** `pass` / `revise` / `reject`
**One improvement required before production:**
**Reusable learning:**
