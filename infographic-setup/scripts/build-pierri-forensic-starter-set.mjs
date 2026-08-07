#!/usr/bin/env node

/**
 * Writes the first direct-asset Pierri forensic sidecars.
 *
 * These observations were authored after viewing the original local JPEGs and, for each GIF,
 * start / material-intermediate / near-complete frames. This is intentionally a representative
 * starter set, not a surrogate inspection of every file in the corpus.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const reviewRoot = path.join(root, 'references', 'creative-review');
const indexPath = path.join(reviewRoot, 'vincent-pierri-corpus-index-v1.json');
const recordsDir = path.join(reviewRoot, 'pierri-forensics', 'records');

const reviewDate = '2026-08-07';
const reviewer = 'Codex direct visual review';

const staticMotion = {
  mode: 'static',
  sampled_positions_ms: [],
  source_metadata: { frame_count: null, duration_ms_from_gce: null },
  observed_state_change: 'No temporal state: this is a static JPEG source asset.',
  motion_job: 'Not applicable; the complete argument must work in one frame.',
  limitation: 'No animation exists in this source asset.'
};

const gif = (sampled_positions_ms, observed_state_change, motion_job) => ({
  mode: 'gif_sampled',
  sampled_positions_ms,
  observed_state_change,
  motion_job,
  limitation:
    'Three sampled frames establish the observed state change, not a frame-by-frame reconstruction of timing or platform playback.'
});

// These are observations about logical and editorial mechanisms. They are not a topic calendar,
// an instruction to borrow Pierri's visual identity, or validation of any outcome claim visible
// in a source asset.
const reviews = {
  1: {
    visual_anatomy: {
      title: 'Two-scale title: a large plain-language promise with “START MAKING MONEY” isolated inside a lavender rounded tag.',
      layout: 'A vertical 13-step working reference divided into three large stacked phase panels; each phase has a rotated label at the right edge.',
      reading_order: 'Title and 13-step promise → top-to-bottom phase panels → ordered actions within each panel → phase label / credit line.',
      typography: 'Large light sans headline, one rough handwritten emphasis word-group, bold action labels, and smaller grey explanatory lines.',
      colour: 'Lavender, pink, and aqua act as phase identifiers on a mostly white page with black/grey type.',
      surface: 'Near-white ground, thin dark outlines, rounded panels, and soft diffuse shadows.',
      modules: 'Three phase panels; each repeats numbered shape token, bold action, and supporting explanation.',
      density: 'High but navigable: 13 actions are compressed into one bold instruction plus one short supporting line each.'
    },
    motion: staticMotion,
    transferable_mechanism: {
      reader_job: 'Turn a long operating sequence into a reference someone can scan and revisit.',
      argument_shape: 'Grouped progression with discrete actions.',
      mechanism: 'Use phase membership and a repeated action/explanation micro-format so a long list becomes a spatial route rather than a wall of text.',
      use_condition: 'Only when the steps genuinely belong to a small number of ordered phases and every item earns its place.'
    },
    anti_copy_boundary:
      'Do not reuse the source title cadence, 13-step structure, vertical phase tags, colour assignment, handwritten emphasis, wording, or exact panel geometry.',
    claim_boundary: {
      public_claim_status: 'caption_association_unverified',
      note: 'A workbook caption is present only by matching numeric ID. Neither that pairing nor any implied business outcome is independently verified.'
    }
  },
  2: {
    visual_anatomy: {
      title: 'A testimonial-like message sits above a high-contrast editorial headline for “The 5 Components of LinkedIn Personal Brand Strategy.”',
      layout: 'One integrated board: top message card points into five connected components, mixing a funnel, Venn, rows, and micro-notes.',
      reading_order: 'Message / social proof cue → promise → upper components → lower linked components → strategy detail.',
      typography: 'Large high-contrast editorial headline paired with compact sans module labels and small explanatory text.',
      colour: 'Cream board with dark green rules plus restrained muted mint, yellow, tan, and green component surfaces.',
      surface: 'Paper-like board, dark outlines, connected rules, small raised elements, and a screenshot-shaped evidence card.',
      modules: 'Five named components with different sub-diagrams, all held inside one connected system.',
      density: 'Very high: multiple sub-frameworks coexist, but a clear outer board and numbered labels preserve orientation.'
    },
    motion: gif(
      [0, 5600, 10800],
      'Sampled frames show the complete board staying legible while a temporary wipe/occlusion travels through a lower component area; the semantic change cannot be established confidently from the three samples.',
      'Attention staging around one sub-region; the final board does not depend on motion to be useful.'
    ),
    transferable_mechanism: {
      reader_job: 'See how several interdependent elements make one system rather than consume five disconnected tips.',
      argument_shape: 'Integrated system map with heterogeneous evidence displays.',
      mechanism: 'Give each component its own apt micro-diagram but retain one enclosing visual grammar and visible connection paths.',
      use_condition: 'Use only where the components genuinely interact and distinct diagram types clarify rather than decorate them.'
    },
    anti_copy_boundary:
      'Do not reuse the testimonial framing, title, five-part formulation, serif/sans pairing, board arrangement, green palette, component diagrams, or source-style evidence card.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'The asset visibly contains a testimonial-like result cue and self-described framework claims. Its supplied caption is a known visual/caption mismatch.'
    }
  },
  10: {
    visual_anatomy: {
      title: 'A broad headline asks how three post types “PERFORM,” with the operative word placed in a lavender hand-rendered tag.',
      layout: 'Three-column comparison table with shared metric rows and shaded winner cells.',
      reading_order: 'Headline → three type labels → each shared metric row from top to bottom → highlighted winner cells.',
      typography: 'Oversized plain sans headline, rough display accent in one tag, bold column headers, and compact tabular labels/numbers.',
      colour: 'Lavender, pink, and aqua distinguish the columns; the left metric index uses lavender; winners receive matching flat fills.',
      surface: 'White background, thin black grid lines, rounded header cards, and restrained shadows.',
      modules: 'Three post-type columns crossed with seven comparison rows.',
      density: 'Medium-high: numerical evidence and descriptive labels share one repeatable grid.'
    },
    motion: staticMotion,
    transferable_mechanism: {
      reader_job: 'Compare alternatives across the same decision criteria without asking the reader to reconcile separate cards.',
      argument_shape: 'Common-scale comparison table.',
      mechanism: 'Use one stable row definition, one shared denominator, and visible emphasis only where a comparison is legitimate.',
      use_condition: 'Only when all columns use comparable definitions, units, time windows, and sources.'
    },
    anti_copy_boundary:
      'Do not reuse the source post-type categories, layout, performance claims, hand tag, exact column colours, metrics, or winner treatment.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'Rates and comparative outcomes are visibly asserted in the asset. They are not a transferable benchmark or publishable Shetty’s Desk evidence.'
    }
  },
  11: {
    visual_anatomy: {
      title: 'A three-way choice is announced with a large editorial headline and “VIRAL INFOGRAPHICS” in a lavender highlighted object.',
      layout: 'A three-column comparison framed as service/approach alternatives, with repeated criterion bands from top to bottom.',
      reading_order: 'Title → named alternatives → repeated “what they do / process / outcome / buying” bands → bottom price row.',
      typography: 'Large display title, one rough emphasis tag, strong column headers, then legible sans paragraphs and bar labels.',
      colour: 'Pink, aqua, and lavender identify each alternative from header through bottom bar.',
      surface: 'White page, fine black structural grid, rounded internal labels, pale fills, and light depth shadow.',
      modules: 'Three alternatives crossed with four repeated decision criteria plus a closing price strip.',
      density: 'High: the same question is answered for each option, so the detail is easy to compare.'
    },
    motion: staticMotion,
    transferable_mechanism: {
      reader_job: 'Choose among alternatives based on trade-offs rather than isolated claims.',
      argument_shape: 'Repeated-criteria option comparison.',
      mechanism: 'Hold the evaluation criteria constant across options and reserve visual variation for the alternatives themselves.',
      use_condition: 'Use only where the alternatives are genuinely comparable and caveats can be stated without burying the reader.'
    },
    anti_copy_boundary:
      'Do not reuse the source service categories, price claims, “viral infographic” promise, colour logic, label wording, or panel arrangement.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'The visual contains price and capability comparisons. A caption is only asserted by numeric ID and does not validate the claims.'
    }
  },
  12: {
    visual_anatomy: {
      title: 'A large promise about making a post go “VIRAL” leads with a prominent lavender tag and a short clarification line.',
      layout: 'Three-column matrix compares empathy, debate, and resource varieties across repeated rows such as behaviour, shelf life, engagement, content, and business effect.',
      reading_order: 'Promise → three category headers → top-to-bottom comparison rows → colored action pills / closing impact row.',
      typography: 'Large plain sans with rough display accent, bold category headers, and a dense table of compact labels and numerical annotations.',
      colour: 'Pink, aqua, and lavender encode the three alternatives through headers, row fills, curves, and decision pills.',
      surface: 'White, fine black table rules, flat colour fields, softly shadowed pill annotations, and simple line/area chart motifs.',
      modules: 'Three columns and seven shared row categories; several rows use small chart-like sketches instead of only text.',
      density: 'Very high: a single visual contains qualitative, time, and numeric comparisons with a fixed reader path.'
    },
    motion: gif(
      [0, 4000, 7600],
      'Sampled frames show category labels, line/area marks, and pill markers arriving in stages while the row-and-column structure remains stable.',
      'Progressively expose comparison evidence without changing the outer comparison model.'
    ),
    transferable_mechanism: {
      reader_job: 'Understand a multi-criterion distinction between three genuinely different outcomes.',
      argument_shape: 'Multi-criteria comparison with mixed qualitative and quantitative rows.',
      mechanism: 'Keep the column logic stable while letting the visual encoding match each row’s semantic type: text, curve, range, or action.',
      use_condition: 'Use only when numbers are sourced and comparably defined; otherwise keep the visual qualitative and name its boundary.'
    },
    anti_copy_boundary:
      'Do not reuse the source “virality” taxonomy, rates, claims, curves, row labels, colour assignment, pill treatment, or title cadence.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'The visible engagement percentages, business outcomes, and format claims lack native provenance in the supplied corpus.'
    }
  },
  18: {
    visual_anatomy: {
      title: 'An oversized “How to Write a VIRAL HOOK” title gives the key phrase its own lavender rounded object.',
      layout: 'A dense two-column catalog: three stacked hook families on the left connect to framework formulas and full examples on the right.',
      reading_order: 'Title and scope line → family label → formula → linked example → small impression badge; repeat through three color-coded families.',
      typography: 'Bold rough category tags, clear sans headings, compact examples, and selectively highlighted phrase fragments.',
      colour: 'Lavender, pink, and aqua partition three hook families; the same colors carry through formulas, examples, and links.',
      surface: 'Pale gradient wash behind white/colored cards, fine dark connectors, rounded containers, and quiet shadows.',
      modules: 'Three family bands, each with four formula-to-example pairings and small numeric badges.',
      density: 'Extremely high, but the single repeated formula → example mapping makes saving and later reuse plausible.'
    },
    motion: gif(
      [0, 6000, 11500],
      'Sampled frames show labels, formula cards, phrase highlights, and example rows entering in a staged build; the completed catalog remains a static reference.',
      'Reveal the repeated mapping from category to formula to example, rather than animate decoration for its own sake.'
    ),
    transferable_mechanism: {
      reader_job: 'Turn an abstract writing principle into reusable patterns plus context-rich examples.',
      argument_shape: 'Taxonomy with formula-to-example mappings.',
      mechanism: 'For each category, pair a concise generative formula with a real-looking applied instance so readers can bridge abstraction and use.',
      use_condition: 'Use only if examples are accurately sourced, clearly labelled illustrative, or written as original examples—not fabricated proof.'
    },
    anti_copy_boundary:
      'Do not reuse the hook formulas, examples, metrics, family names, color bands, rough type, phrase highlights, or dense board geometry.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'Visible impressions and case-like statements are creator claims; numeric caption matching does not prove the original asset-caption relationship.'
    }
  },
  27: {
    visual_anatomy: {
      title: 'The phrase “STRUCTURE” is placed in a prominent lavender tag inside an otherwise plain-language title.',
      layout: 'A conditional layout-selection board: one input (“framework has N parts”) branches to eight shape options with miniature diagrams.',
      reading_order: 'Title → input tag → top row of compatible structures → lower row of further structures connected through the same branch spine.',
      typography: 'Large lightweight title, rough display accent, and compact explanatory labels directly above simple structural sketches.',
      colour: 'Alternating lavender, pink, aqua, and blue panels distinguish possible structures without becoming the main information code.',
      surface: 'White page, one continuous dark branching line, pale flat modules, thin rules, and minimal shadow.',
      modules: 'One variable input plus eight visual alternatives, each with a plain-language use condition and schematic.',
      density: 'High: multiple choices remain coherent because they answer one input question.'
    },
    motion: gif(
      [0, 5000, 9500],
      'The sampled input moves from “2 parts” to “4+ parts”; its miniature diagrams add/expand their components before returning to the initial state as a loop.',
      'Show how one change in input cardinality alters the candidate visual structures while preserving context.'
    ),
    transferable_mechanism: {
      reader_job: 'Choose a visual structure by the actual relationship in a framework, not by decoration preference.',
      argument_shape: 'Conditional selection tree.',
      mechanism: 'Expose the selection variable first, then show a finite set of shape options whose miniatures make the consequence visible.',
      use_condition: 'Use only when the input variable is real and the choice rules reflect the underlying logic rather than a style preference.'
    },
    anti_copy_boundary:
      'Do not reuse the “eight layouts” taxonomy, example diagrams, lavender title tag, branching board, source wording, or motion loop.',
    claim_boundary: {
      public_claim_status: 'caption_association_unverified',
      note: 'The visual is a framework reference. Its matching workbook caption remains an asserted numeric association, not source-proven post metadata.'
    }
  },
  30: {
    visual_anatomy: {
      title: 'A broad promise for “14 PROVEN LinkedIn Post Ideas” combines a lightweight headline with one lavender highlighted word-object.',
      layout: 'A left-to-right spectrum arrow organizes 14 prompt cards into personal, reflective, and professional territories linked by curved paths.',
      reading_order: 'Title → the large spectrum label → individual prompt cards within each territory → small moving markers / connectors.',
      typography: 'Large headline, rough highlighted word, bold card labels, and editable-looking sentence starters in smaller sans type.',
      colour: 'Lavender introduces personal prompts, blue handles reflective prompts, and aqua handles professional prompts.',
      surface: 'White background, raised pale cards, curved dark connectors, a large two-tone arrow, and light drop shadows.',
      modules: 'Fourteen prompt cards arranged as five personal, four reflective, and five professional ideas.',
      density: 'High but modular: a reader can save the whole list or extract one usable prompt independently.'
    },
    motion: gif(
      [0, 3300, 6200],
      'Sampled frames show small colored markers travelling through the spectrum and along card connectors while the full prompt board remains visible.',
      'Direct attention along an existing categorical route; the movement does not replace the static map.'
    ),
    transferable_mechanism: {
      reader_job: 'Browse a broad set of prompt types without reading them as an arbitrary checklist.',
      argument_shape: 'Spectrum-based taxonomy.',
      mechanism: 'Make the organizing continuum explicit, then place modular examples along it so a reader can locate themselves and choose one entry point.',
      use_condition: 'Use only when a meaningful continuum exists; otherwise use a clearer taxonomy or table.'
    },
    anti_copy_boundary:
      'Do not reuse the 14-item prompt bank, personal-to-professional spectrum, source title/claim, individual cards, colors, connectors, or motion markers.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: '“Proven” is a visible source assertion. The corpus does not include evidence sufficient to reuse that claim.'
    }
  },
  36: {
    visual_anatomy: {
      title: 'A large “How to Craft Your POV” promise places “POV” in a compact lavender tag.',
      layout: 'A centered five-layer cylindrical stack is flanked by a left explanation column and a right mistakes-to-avoid column.',
      reading_order: 'Title / clarifier → central bottom-to-top progression → horizontally aligned explanation and failure-mode boxes.',
      typography: 'Plain oversized title, rough highlighted acronym, bold stage labels on the cylinders, and compact explanatory sans text in flanking boxes.',
      colour: 'Pastel lavender, pink, aqua, blue, and peach distinguish stack layers and corresponding note boxes.',
      surface: 'White background, thin dark outlines, softly shaded cylinders, rounded note boxes, and a bottom directional arrow.',
      modules: 'Five sequential layers plus five explanatory and five caution modules paired by color/height.',
      density: 'High: progression and counterexamples coexist because their positions are synchronized.'
    },
    motion: gif(
      [0, 5000, 9400],
      'The centered stack starts flattened, rises into distinct cylinders, and brings its stage labels into readable position while side notes retain their anchors.',
      'Make an ordered layered metaphor physically assemble, revealing the dependencies between steps.'
    ),
    transferable_mechanism: {
      reader_job: 'Understand a dependency-ordered sequence while seeing common failure modes at the corresponding stage.',
      argument_shape: 'Layered progression with parallel cautions.',
      mechanism: 'Put the main progression in one physical object and align explanatory / exception material to the relevant level.',
      use_condition: 'Use only where the order and dependency are true; a stack should not be used to decorate an unordered list.'
    },
    anti_copy_boundary:
      'Do not reuse the POV framework, layered-cylinder object, side-note pairing, color sequence, title tag, or animation choreography.',
    claim_boundary: {
      public_claim_status: 'caption_association_unverified',
      note: 'The asset is a conceptual framework; matching caption metadata is asserted by numeric ID rather than verified provenance.'
    }
  },
  41: {
    visual_anatomy: {
      title: 'A simple “How to go VIRAL the right way” headline sets up a direct bad-versus-good contrast.',
      layout: 'A two-column comparison runs from top explanation boxes through linked analytics-screenshot snippets to claimed business-outcome boxes.',
      reading_order: 'Title → bad / good comparison → connector paths → screenshot cards → bottom claimed outcomes.',
      typography: 'Large open headline, rough word-object accent, bold contrast labels, and short bullets inside rounded cards.',
      colour: 'Pink marks the bad route; lavender marks the good route; screenshot elements retain green interface styling.',
      surface: 'Soft pink/lavender background halves, outlined cards, curved connectors, embedded UI screenshots, and light shadows.',
      modules: 'Two mirrored causal stories: top framing, middle analytics snapshot, and bottom outcome claim.',
      density: 'Medium: the argument is intentionally simple, with visuals supplying the causal story rather than a large data table.'
    },
    motion: staticMotion,
    transferable_mechanism: {
      reader_job: 'See why two superficially similar results can have different operating value.',
      argument_shape: 'Mirrored causal comparison.',
      mechanism: 'Pair each route’s stated assumptions, observable evidence, and consequence in the same vertical order so the contrast is inspectable.',
      use_condition: 'Use only with credible, attributable evidence; do not manufacture a screenshot or infer causal business outcomes from a single metric.'
    },
    anti_copy_boundary:
      'Do not reuse the good/bad virality framing, screenshots, claimed results, colors, connector routes, title wording, or box arrangement.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'The asset contains analytics screenshots, follower figures, and revenue claims without source links or metadata in the supplied corpus.'
    }
  },
  42: {
    visual_anatomy: {
      title: '“How to Write a VIRAL HOOK” pairs an oversized promise with a lavender rough-display phrase.',
      layout: 'One top principle leads to a four-quadrant formula board; each quadrant contains a hook pattern and several example lines.',
      reading_order: 'Title → one-sentence rule → four numbered formula types → examples and small numeric badges within each type.',
      typography: 'Large plain sans title, rough display accent, bold numbered formula labels, and highlighted phrase fragments inside small examples.',
      colour: 'Lavender, pink, aqua, and blue separate the four formula families while shared white panels preserve a common template.',
      surface: 'Pale gradient background, rounded boxes, dotted-outline blanks, highlighted phrase chips, fine dark borders, and soft shadows.',
      modules: 'One top rule plus four formula quadrants, each containing three examples.',
      density: 'Very high: the visual operates as a small reference library, not a one-glance slogan.'
    },
    motion: gif(
      [0, 5000, 9400],
      'Sampled frames show formula elements, phrase highlights, and example text entering progressively while the four-quadrant structure remains fixed.',
      'Stage a dense reference in a coherent build while preserving a usable final still.'
    ),
    transferable_mechanism: {
      reader_job: 'Learn an abstract formula by seeing several varied applications beside it.',
      argument_shape: 'Formula library with examples.',
      mechanism: 'Give every formula a consistent visual slot and include several examples so readers can recognize the invariant and the variation.',
      use_condition: 'Use only if example material is original, attributed, or explicitly illustrative; do not insert invented social proof.'
    },
    anti_copy_boundary:
      'Do not reuse the hook formulas, examples, claimed metrics, four-panel geometry, highlighted blanks, color system, or title treatment.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: 'No source caption accompanies this asset, and the visible impression badges are not independently verified.'
    }
  },
  45: {
    visual_anatomy: {
      title: '“How to Find Your UNIQUE Point of View” uses a large plain title with a lavender rough-display word-object.',
      layout: 'A horizontal four-stage cylinder pipeline sits above a table whose rows explain, prompt, caution, and exemplify each stage.',
      reading_order: 'Title → top pipeline → column headers / stages → repeated table rows → example rows with portraits.',
      typography: 'Large headline, rough emphasis word, compact table headers, clear sentence fragments, and bold stage labels inside the pipeline.',
      colour: 'Lavender, pink, aqua, and blue run consistently through both pipeline stages and table columns.',
      surface: 'White page, thin table rules, rounded 3D pipeline cylinders, sparse check/cross markers, and small cut-out portraits.',
      modules: 'Four stage columns crossed with explanation, prompting questions, mistakes, and three applied examples.',
      density: 'Very high: a single stable matrix carries both process guidance and externalized examples.'
    },
    motion: gif(
      [0, 5000, 9500],
      'The top pipeline unfolds from compressed discs to labelled stages; a marker appears over the table before the animation returns to a quieter state.',
      'Make a four-step process physically assemble above a stable reference table.'
    ),
    transferable_mechanism: {
      reader_job: 'Apply a multi-stage process while testing each stage against prompts, mistakes, and examples.',
      argument_shape: 'Process-to-matrix bridge.',
      mechanism: 'Use a single process spine above a grid that lets each stage be inspected from several practical angles.',
      use_condition: 'Use when the rows truly serve every stage; if each stage needs unrelated material, use a progression with distinct modules instead.'
    },
    anti_copy_boundary:
      'Do not reuse the POV process, pipeline geometry, portraits, row taxonomy, title tag, colors, table arrangement, or motion.',
    claim_boundary: {
      public_claim_status: 'no_performance_claim_in_asset',
      note: 'No native performance metric is visible in the source asset. The pictured examples and framework remain source material, not Shetty’s Desk authority.'
    }
  },
  51: {
    visual_anatomy: {
      title: '“How to Create Your Infographic AESTHETIC” foregrounds the key term as a lavender rough-display tag.',
      layout: 'A horizontal spectrum/slider selects among visual directions; one large nested-circle sample occupies the lower two thirds of the page.',
      reading_order: 'Title → spectrum position → selected option’s compact attributes → large visual example.',
      typography: 'Large headline, hand-rendered key word, compact labels for canvas/colour/pros/cons, and minimal instructional text.',
      colour: 'The full canvas, accent tag, spectrum position, and nested-circle sample shift together between visual directions.',
      surface: 'Clean field with fine rules, rounded option labels, shallow shadow, and a large flat/concentric illustration sample.',
      modules: 'One selection spectrum, a four-field option descriptor, and one large style example.',
      density: 'Low-to-medium: it privileges comparison across states rather than a dense final board.'
    },
    motion: gif(
      [0, 7000, 13500],
      'Sampled frames move the spectrum selector across named aesthetics while the whole page changes background, color treatment, and lower-circle rendering.',
      'Demonstrate stateful variation: a reader sees which parts of a system change together when a single choice changes.'
    ),
    transferable_mechanism: {
      reader_job: 'Compare alternative treatments of one underlying concept without mistaking them for different concepts.',
      argument_shape: 'State selector with a consistent specimen.',
      mechanism: 'Keep the information structure fixed while a selector changes one coherent set of presentation variables.',
      use_condition: 'Use motion only when the comparison between states is the point; present the selected end state as a readable still.'
    },
    anti_copy_boundary:
      'Do not reuse the aesthetic taxonomy, spectrum layout, nested-circle specimen, tag treatment, option labels, color states, or source animation.',
    claim_boundary: {
      public_claim_status: 'no_performance_claim_in_asset',
      note: 'The visual is a design-choice explanation. Its claims about style are source material, not a validated decision rule for Shetty’s Desk.'
    }
  },
  53: {
    visual_anatomy: {
      title: '“4 Layers of a PROFITABLE Personal Brand” combines a large promise with one lavender rough-display word-object.',
      layout: 'Four oversized nested arcs curve around a central monetary outcome, with many small pill labels placed along each concentric layer.',
      reading_order: 'Title → four layer labels → follow the outside-in arcs and their labelled ingredients → central outcome.',
      typography: 'Large open headline, rough emphasis tag, simple small layer labels, and pill-sized supporting phrases.',
      colour: 'Outer-to-inner layers use lavender, aqua, pink, and blue, ending at a peach central outcome.',
      surface: 'White ground, large colored arcs with dark outlines, pale rounded text pills, and a few small circular markers.',
      modules: 'Four nested layers, each populated with many contributing elements, culminating in a central outcome.',
      density: 'High: the hierarchy is legible because the container geometry does most of the organizational work.'
    },
    motion: staticMotion,
    transferable_mechanism: {
      reader_job: 'See which contributing elements belong to which level of a hierarchy before focusing on the end outcome.',
      argument_shape: 'Nested dependency layers.',
      mechanism: 'Use nested containers to make level membership visible, then populate each container with small, scannable contributors.',
      use_condition: 'Use only for genuine nested dependencies; do not force a set of peers into rings simply to create a focal object.'
    },
    anti_copy_boundary:
      'Do not reuse the personal-brand hierarchy, central money outcome, nested-arc geometry, label phrases, pastel sequence, title/tag treatment, or micro-pill placement.',
    claim_boundary: {
      public_claim_status: 'no_performance_claim_in_asset',
      note: 'The asset presents a commercial hierarchy but no native performance metric. Its implied causal path must not be adopted as Shetty’s Desk evidence.'
    }
  },
  54: {
    visual_anatomy: {
      title: '“How to Create an ANIMATED INFOGRAPHIC” makes both operative words into large lavender rough-display tags.',
      layout: 'A nine-tile catalog presents a different animated technique in every equally sized cell, with a miniature demonstration and method note.',
      reading_order: 'Title → scan nine numbered tiles left-to-right and top-to-bottom → use each miniature as the retrieval cue.',
      typography: 'Large headline, hand-rendered emphasis labels, small section headers, and compact process notes.',
      colour: 'Each tile has a distinct pastel fill that helps separation but does not encode a data variable.',
      surface: 'Flat colored tile fields, dark rules, simple illustrated objects, pills, and fine shadows.',
      modules: 'Nine equal technique cards, each containing a miniature motion specimen plus a concise how-to note.',
      density: 'Medium-high: the catalog is designed for browsing and later retrieval rather than a single linear argument.'
    },
    motion: gif(
      [0, 1500, 2800],
      'Across sampled frames, individual miniatures visibly demonstrate path tracing, orbital movement, checkbox completion, appearing pills, selector travel, exploding circles, and text movement.',
      'Teach animation by showing each micro-mechanism in the exact spatial context it would affect.'
    ),
    transferable_mechanism: {
      reader_job: 'Select a motion technique based on the visual change it makes, not an abstract label alone.',
      argument_shape: 'Technique catalog with live specimens.',
      mechanism: 'Pair a named technique with a tiny observable state change and a concise implementation note.',
      use_condition: 'Use only when motion adds explanatory value; an animation catalog is not a reason to animate otherwise static content.'
    },
    anti_copy_boundary:
      'Do not reuse the nine-technique catalog, tile contents, method labels, color palette, rough title tags, or source animation examples.',
    claim_boundary: {
      public_claim_status: 'no_performance_claim_in_asset',
      note: 'This is a craft reference rather than a performance study. It does not establish that any specific animation improves LinkedIn results.'
    }
  },
  55: {
    visual_anatomy: {
      title: '“How to Turn your Expertise into HIGH-TRACTION Visuals” treats the key outcome phrase as a large lavender rough-display object.',
      layout: 'Four large stacked phases occupy the left side; each phase aligns to a detailed framework, layout-map, or deployment module on the right.',
      reading_order: 'Promise → vertical phase stack → each corresponding right-side working module → bottom directional arrow.',
      typography: 'Large bold phase labels, broad light headline, rough highlighted phrase, and many small sans labels inside framework components.',
      colour: 'Lavender, pink, aqua, and blue separate the four phases and echo through their corresponding right-side modules.',
      surface: 'White canvas, large softly shaded cylinders, thin dark outlines, rectangular working fields, and compact visual labels.',
      modules: 'Four phase cylinders plus paired detailed implementation panels: strategy, framework mapping, shape choice, and deployment.',
      density: 'Extremely high: it combines an overview model with usable micro-frameworks, relying on alignment and color correspondence to stay coherent.'
    },
    motion: gif(
      [0, 7000, 13500],
      'Sampled frames show the left stack gaining its phase colors while right-side framework elements and labels become more complete; the overall left-to-right correspondence remains fixed.',
      'Assemble a high-density system in dependency order while preserving a static final reference.'
    ),
    transferable_mechanism: {
      reader_job: 'Move between an end-to-end overview and the specific working logic needed at each phase.',
      argument_shape: 'Phase stack with paired implementation panels.',
      mechanism: 'Use one consistent phase spine and align each high-level phase with the appropriate tactical detail instead of separating overview and implementation into unrelated slides.',
      use_condition: 'Use only when the modules are truly phase-bound; if the reader must choose among branches, use a decision structure rather than a stack.'
    },
    anti_copy_boundary:
      'Do not reuse the high-traction claim, four-phase stack, framework content, cylinder shapes, colour sequence, title treatment, right-side panel layout, or motion build.',
    claim_boundary: {
      public_claim_status: 'asset_claims_not_independently_verified',
      note: '“High-traction” is a source claim. No native outcome evidence accompanies this asset in the supplied corpus.'
    }
  }
};

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const indexedAssets = new Map(index.records.filter((record) => record.asset).map((record) => [record.post_id, record]));
await mkdir(recordsDir, { recursive: true });

for (const [idText, review] of Object.entries(reviews)) {
  const assetId = Number(idText);
  const source = indexedAssets.get(assetId);
  if (!source) throw new Error(`Asset ${assetId} is absent from the source index.`);
  const isGif = source.asset.format === 'gif';
  const confidence =
    source.pairing_status === 'known_manual_mismatch'
      ? 'explicitly_not_paired'
      : source.pairing_status === 'asset_only'
        ? 'no_caption_supplied'
        : 'asserted_by_numeric_id_only';
  const motion = {
    ...review.motion,
    source_metadata: {
      frame_count: source.asset.frame_count ?? null,
      duration_ms_from_gce: source.asset.duration_ms_from_gce ?? null
    }
  };
  const record = {
    schema_version: '1.0.0',
    corpus_id: 'vincent-pierri-local-reference',
    asset_id: assetId,
    review_status: 'reviewed_direct_asset',
    source_asset: {
      relative_path: source.asset.relative_source_path,
      sha256: source.asset.sha256,
      format: source.asset.format,
      canvas: { width: source.asset.width, height: source.asset.height }
    },
    caption_link: {
      status: source.pairing_status,
      association_confidence: confidence,
      caption_available: Boolean(source.caption),
      limitation: source.pairing_provenance
    },
    inspection: {
      reviewer,
      inspected_on: reviewDate,
      evidence_scope: isGif
        ? 'Source-bound start, material-intermediate, and near-complete frames were extracted from the original local GIF and visually inspected; metadata came from that same source file.'
        : 'Original local JPEG displayed directly at full-frame review size.',
      motion_sampling: {
        method: isGif ? 'Three source-bound frame samples extracted from the original local GIF for review; no derivative was added to the corpus.' : 'Not applicable for static JPEG.',
        sampled_positions_ms: motion.sampled_positions_ms,
        limitation: motion.limitation
      }
    },
    visual_anatomy: review.visual_anatomy,
    motion: {
      mode: motion.mode,
      source_metadata: motion.source_metadata,
      observed_state_change: motion.observed_state_change,
      motion_job: motion.motion_job,
      limitation: motion.limitation
    },
    transferable_mechanism: review.transferable_mechanism,
    anti_copy_boundary: review.anti_copy_boundary,
    claim_boundary: review.claim_boundary
  };
  const fileName = `PIERRI-${String(assetId).padStart(3, '0')}.json`;
  await writeFile(path.join(recordsDir, fileName), `${JSON.stringify(record, null, 2)}\n`);
}

console.log(`Wrote ${Object.keys(reviews).length} direct-asset Pierri forensic sidecars to ${path.relative(root, recordsDir)}.`);
