#!/usr/bin/env node
/**
 * Expands direct visual observations + workbook caption context into topic-neutral forensic records.
 * It never picks a future topic and never writes over the three human-calibrated records.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const reviewDir = path.join(root, 'references/creative-review');
const sourceIndexPath = path.join(reviewDir, 'top100-forensic-source-context.jsonl');
const visualIndexPath = path.join(reviewDir, 'top100-visual-inspection-2026-08-05.md');
const assetDir = path.join(root, 'references/top 100');
const outputDir = path.join(reviewDir, 'top100-forensics');
const calibration = new Set([13, 64, 65]);

const profiles = {
  comparison: {
    cognitiveJob: 'Disambiguate a small set of related concepts so a reader can make a more precise decision.',
    readerState: ['conceptual confusion', 'cross-functional disagreement', 'need for shared vocabulary'],
    visualGrammar: ['two-to-four equal lanes', 'one repeated comparison schema', 'clear categorical separation', 'shared conclusion or decision rule'],
    informationGrammar: ['name the conflation', 'answer the same questions for each concept', 'show the relationship or consequence', 'give the reader a reusable distinction'],
    social: ['save as a meeting reference', 'send to an adjacent function', 'use to settle imprecise language'],
    useWhen: ['The opportunity contains a small set of concepts that readers confuse.', 'Each concept is genuinely comparable on the same decision-relevant questions.', 'The payoff is a clearer boundary, choice, owner or escalation.'],
    doNot: ['The idea needs a chronological causal story.', 'The categories are not comparable.', 'The value depends on emotional recognition rather than precision.'],
    captionJob: 'Turn the visual distinction into a lived consequence, nuance or question; do not repeat every row.',
    build: 'When a chosen opportunity contains conflated but comparable concepts, use equal lanes and one repeated decision schema to make their boundary visible immediately. Use the visual for precision and the caption for consequences and nuance.'
  },
  system_map: {
    cognitiveJob: 'Orient the reader inside a multi-part system by making relationships, dependencies or hand-offs visible.',
    readerState: ['system opacity', 'fragmented ownership', 'need to see the whole before acting locally'],
    visualGrammar: ['central anchor or process spine', 'labelled nodes/layers/lanes', 'visible relationship connectors', 'bounded visual zones'],
    informationGrammar: ['name the system', 'show its parts', 'reveal relationships', 'locate the intervention or decision point'],
    social: ['save as an orientation reference', 'send to a collaborator', 'use to explain a system without a long meeting'],
    useWhen: ['The opportunity is about relationships between components rather than a single list.', 'The visual can make a hidden dependency, flow or ownership boundary clearer.', 'The reader benefits from an overview before detailed instruction.'],
    doNot: ['The main reader need is a simple one-step decision.', 'Relationships would be invented or speculative.', 'A table would communicate the content more clearly.'],
    captionJob: 'Supply the system’s operating consequence, boundary conditions or point of view that a static map cannot prove.',
    build: 'When a chosen opportunity needs orientation in a complex system, select one visual grammar—spine, hub, layers or lanes—and use it consistently to make relationships legible. Give each node one job and let the caption explain why the relationship matters.'
  },
  workflow: {
    cognitiveJob: 'Convert an intimidating process into a sequence a reader can start and repeat.',
    readerState: ['blank-page friction', 'process uncertainty', 'desire for a reliable first move'],
    visualGrammar: ['numbered sequence', 'one visible action per stage', 'progress cue', 'optional prompt/interface/example at each stage'],
    informationGrammar: ['start condition', 'small steps', 'decision or quality gate', 'repeatable loop or next action'],
    social: ['save for later execution', 'send to someone learning the process', 'return at the point of work'],
    useWhen: ['A useful outcome genuinely requires ordered actions.', 'The reader can begin without hidden prerequisites.', 'The sequence has a real quality check or decision point.'],
    doNot: ['The work is non-linear and forcing steps would mislead.', 'The post cannot specify a valid first action.', 'The claim is a broad strategy rather than a process.'],
    captionJob: 'Explain the work moment, trade-offs and failure boundary behind the steps; do not merely transcribe them.',
    build: 'When an opportunity needs a repeatable start-to-finish path, use numbered stages with one action and one visible output per stage. Make progress feel possible, include the point at which the reader must judge or validate, and reserve the caption for context and exceptions.'
  },
  field_guide: {
    cognitiveJob: 'Package a dense but recurring body of knowledge into a reference readers can repeatedly consult.',
    readerState: ['information overload', 'need for quick lookup', 'desire to feel more fluent at work'],
    visualGrammar: ['modular reference blocks or table', 'strong title promise', 'repeated card/row rule', 'grouping through category and hierarchy'],
    informationGrammar: ['state the scope', 'group items by a usable logic', 'give compact definitions/formulas/examples', 'make the reference retrievable at a glance'],
    social: ['save as a field reference', 'share with a newer colleague', 'return during real work'],
    useWhen: ['The information is durable and consulted repeatedly.', 'There is a defensible grouping logic.', 'Compression preserves rather than distorts the meaning.'],
    doNot: ['The reader needs one deep causal explanation.', 'The list is arbitrary or too broad to be reliable.', 'A single decision tool would be more useful than a compendium.'],
    captionJob: 'Explain scope, provenance, use boundary and the one practical reason the reader should keep the reference.',
    build: 'When a chosen opportunity contains durable, repeat-use knowledge, create a compact field guide with an explicit scope and repeated retrieval pattern. Make every row earn its place, make grouping visible, and state what the guide cannot decide for the reader.'
  },
  maturity: {
    cognitiveJob: 'Make progress, capability depth or transformation feel navigable rather than abstract.',
    readerState: ['uncertain starting point', 'ambition without path', 'need to see progression'],
    visualGrammar: ['levels, rings, stages, ladder or journey', 'clear start/end orientation', 'one capability shift per level', 'visible movement between states'],
    informationGrammar: ['name current condition', 'show sequential capability shifts', 'define what changes at each level', 'make the next move intelligible'],
    social: ['self-assess', 'save as a roadmap', 'use to start a team conversation'],
    useWhen: ['The chosen opportunity has a credible progression rather than a marketing funnel.', 'Moving between states changes capabilities or decisions, not just labels.', 'The reader benefits from locating a current state.'],
    doNot: ['The levels are arbitrary.', 'There is no meaningful order.', 'The post would imply false maturity scoring or unsupported benchmarks.'],
    captionJob: 'State the limits of the progression, prevent false precision and invite the reader to consider their current condition.',
    build: 'When a chosen opportunity is genuinely developmental, use a clear progression with one capability change per stage. Make the starting point, movement and next credible step visible, and avoid treating maturity labels as evidence without support.'
  },
  metaphor: {
    cognitiveJob: 'Make a familiar but hard-to-explain work pattern memorable through a concrete, emotionally safe analogy.',
    readerState: ['need for recognition', 'abstract tension', 'social friction around naming a pattern'],
    visualGrammar: ['one unexpected metaphor', 'strong visual object or scene', 'small reveal units', 'emotionally legible contrast'],
    informationGrammar: ['surprising premise', 'recognisable truth', 'brief unpacking', 'invitation to identify or discuss'],
    social: ['tag a colleague', 'comment with a personal example', 'remember and repeat the idea'],
    useWhen: ['A real lived pattern can be made clearer without losing nuance.', 'The desired response is recognition or intrigue before instruction.', 'The metaphor is kind, original and culturally safe.'],
    doNot: ['The post carries high-stakes factual, technical or sensitive criticism.', 'The metaphor stereotypes people or minimises harm.', 'The reader requires a precise procedure.'],
    captionJob: 'Unpack the metaphor, state its boundary and invite recognition without overstating a universal truth.',
    build: 'When a chosen opportunity needs recognition before explanation, create one original, respectful metaphor that makes the tension visible. Use the visual for the memorable collision and the caption for the nuance, boundary and conversation.'
  },
  before_after: {
    cognitiveJob: 'Turn an invisible failure into an observable transformation so the reader can locate the intervention.',
    readerState: ['hidden waste', 'abstract debate', 'need for a shared picture before action'],
    visualGrammar: ['same system shown twice', 'clear current and changed state', 'one meaning-bearing contrast system', 'supporting method after the reveal'],
    informationGrammar: ['show the current reality', 'show the changed state', 'name the intervention', 'support with method and provenance-appropriate evidence'],
    social: ['save as workshop prompt', 'send to an improvement partner', 'use to align around a visible problem'],
    useWhen: ['There is a real or explicitly illustrative before/after state.', 'The change can be shown without inventing an outcome.', 'The reader needs to see where an intervention happens.'],
    doNot: ['No defensible state change exists.', 'The outcome would be fabricated or causal claims overstated.', 'A distinction or definition is the actual reader need.'],
    captionJob: 'Explain observation method, limitations and why the change matters; never hide unsupported outcomes in the caption.',
    build: 'When a chosen opportunity contains a visible state change, reuse the same scene or process to show the current condition and intervention. Let the visual prove the tension; use caption and sources for method, evidence and limitations.'
  },
  product_proof: {
    cognitiveJob: 'Make an abstract offer, tool or workflow feel concrete by showing its usable object and surrounding value.',
    readerState: ['uncertain value', 'need to see what exists', 'desire for a practical shortcut'],
    visualGrammar: ['central tangible object/interface', 'benefit modules pointing inward or outward', 'clear contents and use outcomes', 'one direct action'],
    informationGrammar: ['name the object', 'show what it contains', 'show the job it helps complete', 'give the next access/use action'],
    social: ['comment or click for the resource', 'save for later access', 'share with someone who needs the tool'],
    useWhen: ['A real artifact, interface, toolkit or workflow exists.', 'The image can truthfully show what the reader receives or does.', 'The offer has a clear practical use.'],
    doNot: ['There is no real usable object.', 'The product image is a substitute for proof.', 'The post uses a forced CTA before giving standalone value.'],
    captionJob: 'Clarify who the object is for, what it does not solve, access terms and real evidence of utility if claimed.',
    build: 'When a chosen opportunity has a real usable object, centre the artifact or interface and organise surrounding value by jobs completed. Make the object tangible, separate claims from proof, and ensure the post is useful even without the CTA.'
  },
  data_landscape: {
    cognitiveJob: 'Compress a broad landscape of people, companies, tools or signals into a navigable overview.',
    readerState: ['market opacity', 'choice overload', 'need for orientation at scale'],
    visualGrammar: ['category groups', 'repeated entries', 'one shared legend or hierarchy', 'visible scope and provenance'],
    informationGrammar: ['state scope and selection rule', 'group the landscape', 'make comparison possible', 'show source/date/limitations'],
    social: ['save as a market map', 'send to a colleague', 'return to compare options'],
    useWhen: ['The collection has a defensible scope and grouping logic.', 'The reader gains orientation from seeing the landscape together.', 'Sources, dates and exclusions can be named.'],
    doNot: ['The map creates an implied ranking without evidence.', 'Entries are incomplete but presented as exhaustive.', 'The reader needs a focused decision rather than an overview.'],
    captionJob: 'State inclusion criteria, provenance, date sensitivity and what the landscape is not claiming.',
    build: 'When a chosen opportunity requires landscape orientation, group a bounded set by one clear taxonomy, declare the scope and source basis, and make the reader’s next comparison possible. Do not disguise an unverified list as market truth.'
  },
  collection: {
    cognitiveJob: 'Signal depth and create a return path by packaging a body of related work as one visible collection.',
    readerState: ['desire for a trusted starting point', 'need to see breadth before committing attention'],
    visualGrammar: ['collection wall or directory', 'many small coherent artifacts', 'clear organising principle', 'entry point into the archive'],
    informationGrammar: ['show the collection', 'reveal its organising principle', 'make a first item or pathway obvious', 'offer a return/continuation bridge'],
    social: ['save as a starting point', 'share as a resource collection', 'return to explore individual pieces'],
    useWhen: ['There is a real body of related work.', 'The collection itself creates more value than one item alone.', 'The organising principle is clear.'],
    doNot: ['The collection is thin or purely self-promotional.', 'Individual assets do not have standalone value.', 'The reader needs one focused answer now.'],
    captionJob: 'Explain what unifies the collection and where a reader should start, rather than merely claiming volume.',
    build: 'When a chosen opportunity is best served by a real collection, make the system of work visible and give the reader a clear starting route. The visual must prove useful breadth, not simply announce output volume.'
  },
  taxonomy: {
    cognitiveJob: 'Give readers a simple classification system that helps them identify what they are looking at.',
    readerState: ['vocabulary gap', 'need to sort options', 'uncertain categorisation'],
    visualGrammar: ['repeatable category tiles or branches', 'clear labels', 'consistent visual key', 'small examples or conditions'],
    informationGrammar: ['name the universe', 'define categories', 'show differentiating criteria', 'make selection/identification possible'],
    social: ['save as quick reference', 'share with learners', 'return when classifying an example'],
    useWhen: ['The domain has a stable, useful set of categories.', 'A reader can identify an option using visible criteria.', 'The taxonomy reduces real confusion.'],
    doNot: ['Categories are arbitrary, disputed or need extensive caveats.', 'A process map is needed instead of a classification.', 'The list is presented as complete without a scope boundary.'],
    captionJob: 'Clarify scope, edge cases and the selection criterion that the visual cannot fully contain.',
    build: 'When a chosen opportunity needs classification rather than progression, create repeated category units with one clear differentiator and an explicit scope. Make it easy for a reader to place an example without pretending all edge cases disappear.'
  }
};

const groups = {
  comparison: [1, 7, 24, 33, 73, 90, 96],
  system_map: [2, 10, 11, 18, 39, 40, 46, 51, 54, 69, 79, 80, 83, 95, 97],
  workflow: [3, 15, 16, 20, 27, 28, 34, 36, 38, 41, 42, 47, 48, 50, 52, 53, 70, 72],
  field_guide: [5, 9, 14, 17, 21, 22, 25, 37, 49, 56, 57, 63, 74, 76, 77, 78, 81, 82, 88, 89, 94, 99],
  maturity: [8, 29, 30, 45, 59, 61, 67, 68, 71, 85, 86, 91, 100],
  metaphor: [26, 31, 35, 44, 66],
  before_after: [32],
  product_proof: [4, 60, 62, 93],
  data_landscape: [43, 55, 58, 84, 87, 92],
  collection: [19, 23],
  taxonomy: [98]
};

const profileByAsset = new Map();
for (const [profile, numbers] of Object.entries(groups)) {
  for (const number of numbers) profileByAsset.set(number, profile);
}

const records = fs.readFileSync(sourceIndexPath, 'utf8').trim().split('\n').filter(Boolean)
  .map((line) => JSON.parse(line));
const sourceByAsset = new Map(records.map((record) => [record.top100_asset_number, record]));
const visualMarkdown = fs.readFileSync(visualIndexPath, 'utf8');
const visualByAsset = new Map();
for (const line of visualMarkdown.split('\n')) {
  const match = line.match(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/);
  if (match) visualByAsset.set(Number(match[1]), { mechanism: match[2], transfer: match[3], antiCopy: match[4] });
}
const assets = fs.readdirSync(assetDir);
const assetPath = (number) => {
  const found = assets.find((name) => new RegExp(`^'?${number}'?\\.`).test(name));
  if (!found) throw new Error(`Missing local asset ${number}`);
  return `references/top 100/${found}`;
};
const sentence = (text, max = 260) => text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
const captionBeats = (caption) => caption.split(/\n\s*\n/).map((segment) => segment.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 6).map((segment) => sentence(segment, 220));

fs.mkdirSync(outputDir, { recursive: true });
let written = 0;
for (const [number, visual] of [...visualByAsset.entries()].sort(([a], [b]) => a - b)) {
  if (calibration.has(number)) continue;
  const profileName = profileByAsset.get(number);
  if (!profileName) throw new Error(`No mechanism profile assigned to asset ${number}`);
  const profile = profiles[profileName];
  const source = sourceByAsset.get(number) ?? { caption_available: false, caption_hook: '', caption_text: '', caption_source: null, caption_sha256: null };
  const output = {
    schema_version: '1.1.0',
    reference_id: `TOP100-${String(number).padStart(3, '0')}`,
    forensic_record_status: 'complete_from_direct_visual_inspection_and_caption_context',
    review_method: {
      visual_basis: 'Direct inspection of the local Top-100 asset on 2026-08-05.',
      context_basis: source.caption_available ? 'Caption extracted from the supplied Top-100 workbook.' : 'No supplied caption content available.',
      boundary: 'Caption context never substitutes for visual inspection; no factual claim inside the source post is treated as verified by this record.'
    },
    asset: { path: assetPath(number), status: 'visually_inspected', format: /\.gif$/i.test(assetPath(number)) ? 'animated_or_gif_first_frame_reviewed' : 'single_image', inspection_limitations: /\.gif$/i.test(assetPath(number)) ? ['Motion is not inferred beyond the available first-frame inspection.'] : [] },
    source_context: {
      creator: 'Not reliably extracted from the supplied workbook; inspect post or visible asset before attribution.',
      post_url: null,
      caption_source: source.caption_source,
      caption_available: source.caption_available,
      caption_sha256: source.caption_sha256,
      caption_hook: source.caption_hook,
      caption_argument_segments: source.caption_available ? captionBeats(source.caption_text) : [],
      observed_performance_context: ['Included in Tiger’s intentionally curated Top-100 reference set.'],
      unknowns: ['Original post-level analytics unless separately captured.', 'Independent validation of factual or numerical claims within the source post.']
    },
    reader_situation: {
      primary_reader_state: profile.readerState,
      desired_response: profile.social,
      topic_selection_boundary: 'The record does not select a future topic, audience, factual claim or post angle.'
    },
    attention_physics: {
      thumbnail_read_0_3_seconds: `The asset’s first-frame promise is carried by ${visual.mechanism}.`,
      comprehension_3_10_seconds: `The reader follows the ${profile.visualGrammar.slice(0, 3).join(', ')} to understand the structure without reading the full caption.`,
      value_exchange_10_30_seconds: profile.cognitiveJob,
      identity_or_curiosity_trigger: profile.readerState.join('; '),
      promise_proved_by_visual: `The visual’s proof mechanism is ${visual.mechanism}.`
    },
    visual_forensics: {
      asset_specific_observation: visual.mechanism,
      composition_and_grid: profile.visualGrammar.join('; '),
      dominant_anchor: visual.mechanism,
      eye_path: ['headline/promise', 'dominant visual primitive', 'repeated information units', 'reader payoff or next action'],
      information_chunks: profile.informationGrammar,
      hierarchy: 'The visible promise and primary structure carry the first read; supporting detail is subordinate.',
      typography: 'Assessed through the asset’s visible hierarchy; retain its function, not its source typeface or distinctive expression.',
      colour_material_and_contrast: 'Use only as a meaning-bearing support to hierarchy and grouping; source palette is not a transferable requirement.',
      imagery_role: `Imagery supports the mechanism: ${visual.mechanism}.`,
      density_and_pacing: 'Fast first-frame orientation, then modular deep reading; the reader may exit after the promise or continue to the usable detail.',
      craft_observations: [visual.mechanism, `Reusable atom: ${visual.transfer}`, 'The source’s visual identity, typography and precise layout remain non-transferable.']
    },
    content_mechanics: {
      primary_cognitive_job: profile.cognitiveJob,
      argument_sequence: profile.informationGrammar,
      compression_method: profile.visualGrammar.join('; '),
      reader_payoff: profile.cognitiveJob,
      save_share_return_motives: profile.social,
      caption_to_visual_choreography: profile.captionJob
    },
    recombination: {
      mechanism_fingerprint: {
        primary_cognitive_job: profile.cognitiveJob,
        reader_state: profile.readerState,
        visual_grammar: profile.visualGrammar,
        information_grammar: profile.informationGrammar,
        social_action_mechanics: profile.social,
        use_when: profile.useWhen,
        do_not_use_when: profile.doNot,
        topic_selection_boundary: 'This mechanism chooses no topic. Opportunity selection occurs before reference retrieval and recombination.'
      },
      transferable_atoms: [visual.transfer, ...profile.informationGrammar.slice(0, 2)],
      reverse_build_specification: profile.build,
      editable_levers: ['topic: intentionally unselected', 'reader work moment', 'visual primitive', 'information depth', 'caption role', 'format/material treatment'],
      required_original_inputs: ['A chosen reader tension with real relevance.', 'Correct logic, process or sourced evidence proportionate to the selected claim.', 'An original visual object/scene/interface that proves the chosen promise.', 'A caption that adds a different layer of value from the visual.'],
      anti_copy_boundary: [visual.antiCopy, 'source wording and caption rhetoric', 'source creator identity, brand assets and distinctive composition', 'any source claim not independently supportable'],
      falsification_question: `After seeing an original execution, can a target reader identify the intended ${profile.cognitiveJob.toLowerCase()} without relying on the caption?`
    },
    provenance: { visual_observation_id: `top100-visual-inspection-2026-08-05#${number}`, source_context_id: `top100-workbook#${number}`, content_hash: crypto.createHash('sha256').update(`${number}|${visual.mechanism}|${source.caption_sha256 ?? ''}`).digest('hex') }
  };
  fs.writeFileSync(path.join(outputDir, `TOP100-${String(number).padStart(3, '0')}.json`), `${JSON.stringify(output, null, 2)}\n`);
  written += 1;
}
console.log(`Wrote ${written} forensic records; retained ${calibration.size} calibration records.`);
