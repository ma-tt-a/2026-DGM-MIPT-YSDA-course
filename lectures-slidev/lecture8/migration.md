# Lecture 8: migration to Slidev

## Pre-commit and push verification, 2026-10-03

The author requested committing all Lecture 8 work, including the parameterization
table moved to L7. Reviewed the complete pending L8 diff against 1b488313 and the
L7 table/Summary change, including all three new demos and tools. Independent
source reviews pass L6→L7→L8→L9 Recaps, repeated formulas and Training/Sampling,
Summary (7/5 bullets), Outline/README/catalog, source maps, image provenance and
demo mathematics. The staged shared files register guidance tests and document
L8 only; concurrent L9/dynamics work is excluded.

Staged test configuration: **54 tests pass**; source checks for L7 and L8 pass,
as does diff whitespace validation. All four PDFs and 46 lecture inputs were
compared with the last verified publication. The only source difference is a
non-rendering speaker-note clarification: the geometry uses the same coordinate
transform for all arrows, but unequal x/y display scales do not preserve exact
Euclidean length ratios. Removed that overstatement without changing the demo.
The browser inspector's success message also no longer claims preset-button
click coverage from slider-fill checks. These corrections do not change exported
content, so the matching prior PDF/browser evidence remains valid.

Current L8 slides.md SHA-256: `e077ce6cb5c5eaae35748f6358a1bb5bddd092bbd2ed079edf26b78db87cc041`.
Maps remain L7 **41/94**, L8 **38/83**. The four PDF hashes in the preceding
publication entry are unchanged. Local pre-commit evidence:
`/private/tmp/dgm-l8-commit-20261003/`.

## Parameterization table moved to Lecture 7, 2026-10-03

The author requested removal of the explicit Lecture 7 reference and a/b
abbreviations, and suggested moving the table to the preceding lecture.
The table is now **L7 slide 35**, after the linked clean/noise/mean demo (34)
and before the simplified objective (36). All coefficients use the established
sqrt(alpha_bar_t), sqrt(1-alpha_bar_t) notation, with full fractions and no font
reduction. No visible lecture cross-reference remains. Notes retain the
conditional/marginal-score and angular-v/ODE-velocity distinctions. L8 no longer
contains the table; its noise-to-score derivation and DDPM/NCSN objectives are
adjacent again. This supersedes the initial placement recorded in L8's journal.

L7 Summary replaces its sixth bullet with the broader parameterization/loss
weighting takeaway (seven bullets total); L8 restores the previous first bullet
(five total). Independent source review confirms that L6 and Recap L7 already
supply Gaussian score, DSM and Tweedie: no forward dependency is introduced.
Recaps L7/L8/L9, training/sampling, existing demos, section hierarchies and
README/catalog remain consistent without edits. Maps: **L7 41 slides / 94 states;
L8 38 / 83**. No Beamer or merged files were changed.

Both isolated finalizations passed source checks, 54 existing tests, build and
both exports; render-qa.py passed for both decks. A concurrent change only added
six dynamics tests to package.json and the finalize test list; the exact diff
was checked, the new tests passed separately, and no render/build/export input
changed. Both original and integrated manifests are retained in QA.

Every final reveal state equals its handout page. Masking only the folio area
(1190,675)-(1280,720), all unaffected pages match the saved baseline: L7
**39 handout / 90 reveal pages**, L8 **37 / 82**. The table's three PDF states and
both Summaries were visually reviewed. Browser checks pass for L7 slides
34–36,41 (8 states) and L8 slides 11,12,38 (7 states), including reversals,
both neighbor returns, overflow, math, references, resources and errors.
The table retains the approved course typography: Arial 37px headings, 24px
body, 23px table, 24.96px paragraph math and 12px sources. Shared style and
existing demos are unchanged. All lecture/shared inputs were hash-checked before
publication; all four PDFs match the verified isolated outputs byte for byte.

QA: `../output/qa/lecture8/parameterizations-move-2026-10-03/`.

- SHA-256 slides.md: `c4ec51c310135a6245c5dbd9886ab5f6dbe48c2344151fad27c129bda8cef150`.
- SHA-256 slide-map.json: `6b1da7fbcc5d0673529b111fb874261cfbe1d7cb70eb962088eb56648fde53ff`.
- SHA-256 Lecture8.pdf: `7285dc72d2c6ed8f204e92fecbfef990bab1e0f444d4facc35d190e5892ee401`.
- SHA-256 Lecture8-handout.pdf: `5d25c116205c99ed3f72ca9024e63b3fc0072b0dd4ab2b18e99c7f484d1fbe6a`.

## Diffusion parameterizations and lecture continuity, 2026-10-03

The author approved one compact parameterization slide and explicitly requested
consistency with the preceding and following lectures. New slide **12**, after
the noise-to-score identity, extends L7's clean/noise/reverse-mean demo with score
and v-prediction. Its table lists network outputs, computable regression targets
and reconstructed clean estimates. Local a_t and b_t abbreviations preserve the
course's alpha_t = 1 - beta_t. Two clicks reveal the table and the takeaway about
different noise-level weights under plain MSE. Salimans & Ho (2022), Section 4
and Appendix D, is the sole source. Speaker notes explain conditional versus
marginal scores, endpoint assumptions, loss conversion, and v = dx/dphi under
angular time versus L9's ODE velocity dx/dt. Flow matching stays in L11.
Learned variance and ELBO/data-augmentation details remain separate editorial
decisions, as recorded in the local course-refresh report.

Independent scoped source review passes notation, targets and conversions,
sourceFrame/click mapping, both L7→L8 and L8→L9 interfaces, Summary, and
Outline/README consistency. L7's accepted demo is the explicit starting point;
L9's existing noise-prediction Recap remains valid without duplicating the table.
Neither neighboring lecture is edited. A concurrent L9 wording change about
Itô's lemma was inspected and does not affect this interface. The Summary keeps
five bullets and now includes parameterization-dependent MSE weighting.

The deck has **39 slides / 86 states**. Isolated finalization passes source
checks, **54 existing tests**, build and both PDF exports. All 39 handout pages
match their final reveal states. Relative to the saved 38-slide / 83-state
baseline, all **37 unaffected handout pages and 82 unaffected reveal pages**
match pixel for pixel after masking only the folio rectangle
(1190,675)-(1280,720). The new slide's three states and revised Summary were
visually reviewed; neighboring slides remain unchanged. Browser checks cover
slides **11–13 and 39 / 10 states**, stable geometry, backward clicks, both
neighbor returns, source link, overflow, raw math, resources and errors.
PDF/browser style was compared to the approved L1:35 references; shared Arial
37 px headings, 24 px body, 23 px table, 24.96 px paragraph math and 12 px source
styles are preserved. No shared styles or mechanisms changed.

Publication matched the isolated build's lecture and shared input hashes;
PDFs match the verified build byte for byte. Evidence:
`../output/qa/lecture8/parameterizations-2026-10-03/`.
Baseline source SHA-256:
`c4ec51c310135a6245c5dbd9886ab5f6dbe48c2344151fad27c129bda8cef150`.

- SHA-256 slides.md: `efd2601bfe525ec03a93a6a20a35bb821c7b753d36e8cd143889eb72d9426bee`.
- SHA-256 slide-map.json: `f4e8fee7d9d82941e16faf781a71e2d200522011efe9215bcdc535064291d669`.
- SHA-256 Lecture8.pdf: `f38ac028fb76a974fa33eafaa6b8cbf14684a551eca32e8e9480db0622a7e49e`.
- SHA-256 Lecture8-handout.pdf: `c51fe4f0df1880e37fa84cd534d1336ee06b3ac585cafcfeac5b95e8e74fd1b7`.

## Guidance distillation: explicit training, 2026-10-03

The author approved slide 37 and requested a little more training detail.
The teacher/student diagram and matching formula remain. A Training block now
samples a labeled example, t and gamma, samples x_t from the existing DDPM forward
marginal, computes the frozen teacher's CFG target, and updates only phi with
score-space MSE. Sampling evaluates the student once per step with the same
sampler and step count. Three clicks reveal the student/formula, the whole
Training block, and the whole Sampling block. Notes explain initialization,
gamma embeddings, freezing, and the deliberate simplification from Meng's
weighted x_0 regression to a plain score-MSE illustration. The attribution does
not claim this is the exact original loss or FLUX training recipe.

Independent scoped source review passes; no visible time-weight term is needed
for the simplified matching objective. This follow-up changes only slide 37 and its click count;
Summary and course interfaces remain valid. There are **38 slides / 83 states**.
Isolated finalization passes source checks, **54 existing tests**, build and both
exports. The final build also preserves a concurrent math-typography update in the CFG
extrapolation demo (slide 34), which was visually reviewed. Handout pages 34 and
37 change; all 36 other handout pages and 78 unaffected reveal pages match the
baseline pixel for pixel, without masks. All handout pages
equal their final reveal states. The slide's four states were visually reviewed
in PDF and browser. Browser checks cover slides **36–38 / 7 states**, reversals,
both neighbor returns, links, stable geometry, overflow, resources and errors.
Font sizes and common style are unchanged from the prior approved L1 comparison.
Publication matched **22 lecture inputs and 26 shared inputs**; PDFs match the
verified isolated build byte for byte. QA:
`../output/qa/lecture8/guidance-distillation-training-2026-10-03/`.
Baseline source SHA-256: `e2684a4b573baa5f066c38446f5cadc73612049a9162e95405979ca074ccff65`.

- SHA-256 slides.md: `c4ec51c310135a6245c5dbd9886ab5f6dbe48c2344151fad27c129bda8cef150`.
- SHA-256 slide-map.json: `6b1da7fbcc5d0673529b111fb874261cfbe1d7cb70eb962088eb56648fde53ff`.
- SHA-256 Lecture8.pdf: `bd814c83a6dd38d5d8f27fe12827eb48de644133913e9b54e9c23d9b8c29f3da`.
- SHA-256 Lecture8-handout.pdf: `402eda2e94a327e4a804ab4ae839c1ddc47b54938d1a4f968590a162ce4830a6`.

## Guidance distillation: slide for author review, 2026-10-03

The author requested one compact slide before Summary after discussing modern
usage. New slide **37** (`extension: 34`, one click) contrasts the fixed teacher's
two evaluations with one student evaluation conditioned on gamma. It shows a
approximation in score notation to the teacher's CFG output, without a detailed loss,
and keeps the number of sampling steps unchanged. The practical example is
FLUX.2 [dev], with its official model card alongside Meng et al. (2023).
Notes map gamma = 1 + w, explain the score-form adaptation of the paper's x_0
regression, and avoid claiming identical proprietary training recipes.
The five-bullet Summary now includes the reduction in evaluations per step.
The slide is implemented for the author's visual review, not recorded as a final
editorial endorsement. No other body, Recap, section, or shared style was edited in this follow-up.
A concurrent geometry-demo update (separate class marker shapes/colors) was
preserved and included in the final rebuild.

Independent scoped source review passes notation, formula, attribution, map,
Summary and README/Outline. The accepted L9 Recap still describes ordinary CFG;
L14's LCM uses the equivalent gamma = 1 + omega convention. Neither needs edits.
Incoming Recap is unchanged. The deck now has **38 slides / 81 states**.

Isolated finalization passes source checks, **54 existing tests**, build and both
exports. All final reveal states equal their handout pages. The preceding
35 handout pages / 77 reveal states match the saved baseline pixel for pixel,
masking only the folio rectangle (1190,675)-(1280,720) for the new slide total.
The concurrent demo change accounts for handout page 25 / reveal page 48;
that page, new slide states and Summary were visually inspected at full size.
The new-slide source is unchanged by this final integration. Browser checks
cover **36–38 / 5 states**, both neighbor returns, stable geometry, references,
overflow, raw math, resources and errors. Warm captures after dev CSS compilation
are clean. PDF/browser typography matches the approved L1:35 reference: Arial
37 px titles, 24 px body, 24.96 px KaTeX and 12 px sources. Publication checks
**22 lecture inputs and 26 shared inputs** against the isolated build; PDFs match
byte for byte. QA: `../output/qa/lecture8/guidance-distillation-2026-10-03/`.
Baseline source SHA-256: `c28b1cefa338724027ac0eaafc7aca38d8ec86b96603fec970b8a50b29addacc`.

- SHA-256 slides.md: `e2684a4b573baa5f066c38446f5cadc73612049a9162e95405979ca074ccff65`.
- SHA-256 slide-map.json: `744b12716c9bbf1d4148c63d664f09a48601063b96c0666d77b381c4d25717c5`.
- SHA-256 Lecture8.pdf: `d31e951f5f6df9a51a21135ca08f3b4a95082a0e0defedad32e0ce7abdb5b8af`.
- SHA-256 Lecture8-handout.pdf: `94adfaefbebae35aca178e323b436cd9cd9d3a3fb2d7b4d4279bd32f2be057ce`.

## Guidance interval: original Figure 2, 2026-10-03

The author removed autoguidance from the lecture, its source list and Summary.
Slide **36**, `extension: 34`, now reproduces all four panels and original labels
of Figure 2 from Kynkäänniemi et al. (2024). The PNG is extracted from PDF v1,
page 3, at 432 dpi; crop coordinates and hashes are in `public/figs/sources.json`.
One click reveals the toy example's mode loss/recovery at gamma = 6,
right-to-left sampling as sigma decreases, and gamma_t = 1 preserving conditioning
outside the interval. Notes distinguish illustrative endpoints from a general
prescription. This paper is the slide's only link. Summary retains five takeaways.
This decision supersedes the autoguidance scope recorded below.

The current baseline already includes three independently added guidance demos:
**37 slides / 79 states**. Independent source review found no issue in this scoped
diff, figure attribution, interpretation, map or Summary. Existing incoming/outgoing
Recap and schedule checks remain applicable. Initially, only handout pages **36–37**
and reveal pages **77–79** differed; all preceding source blocks were unchanged.
A concurrent update then fixed the geometry demo's scale across gamma and classes.
It was preserved and included in the final rebuild. Relative to the saved baseline,
that update also changes handout page **25** / reveal page **48**; all remaining
pages are pixel-identical without masks. The final source differs before slide 36
only in that demo's explanatory speaker note.

Isolated finalization passes source checks, **53 existing tests**, build and both
exports. Every handout page equals its final reveal state; no raw math was found.
Changed PDF pages were visually reviewed. Browser checks cover **35–37 / 5 states**,
forward/backward reveals and both neighbor returns: no overflow, missing images,
errors or geometry shifts. Stable captures after CSS compilation and transitions
are clean. Typography matches the existing approved L1 evidence (37 px title,
24 px body, 24.96 px KaTeX, 12 px source). Demo interactivity remains outside this
follow-up's browser scope. Publication matched **22 lecture inputs and 26 shared
inputs** against the isolated build; delivered PDFs match byte for byte.
QA: `../output/qa/lecture8/guidance-interval-figure2-2026-10-03/`.

- SHA-256 slides.md: `c28b1cefa338724027ac0eaafc7aca38d8ec86b96603fec970b8a50b29addacc`.
- SHA-256 slide-map.json: `ef6ab4c653a5cefbfba4f2108be5e5714c332e498a5f447734c2fdfb1ee7eb06`.
- SHA-256 Lecture8.pdf: `072779cd9e8874570782a01cd64279dbe5b0441e5bb7d3f9d93e30ef2687b7ca`.
- SHA-256 Lecture8-handout.pdf: `9c1a7ce9cc304373f086ae2fc828076aac80f2109d4de9e3010ea07a1a586f09`.

## Essential reading only, 2026-10-03

At the author's request, slide 33 now cites only its two primary sources:
Kynkäänniemi et al. on guidance intervals and Karras et al. on autoguidance.
The optional CFG++/APG reading row and its speaker-note reminder were removed.
The content, Summary, map and 34-slide / 76-state structure are unchanged.

Isolated finalization and 48 existing tests pass. Both PDFs were regenerated;
only handout page 33 and reveal pages 74-75 changed, with all other pages
pixel-identical without masks. All final states equal handout pages. The two
changed states were visually reviewed; the browser confirms exactly the two
intended source links, stable geometry, both neighbor returns and no errors.
Prior source/interface and typography evidence remains applicable.
QA: `../output/qa/lecture8/essential-links-2026-10-03/`.

- SHA-256 slides.md: `2c2862db39a61cf2bbacf3f7f15c54d2b6b389ee2b672524b6a02f29515a688c`.
- SHA-256 slide-map.json: `fbe4edce65b0760cfb898a4a5a1ca7e08cf33bc0d216c2dc7ef2cfbe6549c7c3`.
- SHA-256 Lecture8.pdf: `cff15633c29cfc1a5cf7fbc4c15ac3c72080b0ce3198042b9659524e0a7532ed`.
- SHA-256 Lecture8-handout.pdf: `6612ce0448a7a5a3c80ef290606afb7333a8d419625c41da9d276c7d10db09bc`.

## Guidance interval and autoguidance, 2026-10-03

The author approved one compact slide after CFG, with CFG++ and APG only as
additional reading. New slide **33**, mapped as `extension: 34`, shows a schematic
guidance interval on the left and reveals autoguidance on one click on the right.
The chart follows sampling from high to low noise (`T` to `0`); outside the middle
interval `gamma_t = 1` preserves conditioning. No universal interval endpoints are
claimed. Autoguidance compares strong and weak scores at the same `(x_t, y)` using
`(1-gamma) s_weak + gamma s_strong`, with `gamma > 1`. Notes state the same-task,
same-conditioning/data requirement for the weaker model and explain the score
adaptation of the paper's denoiser formula. All formulas and graph labels remain
editable; the original schematic uses inline SVG geometry and course KaTeX labels.

Summary is now slide **34**. Its last bullet covers the two extensions while
retaining five takeaways. The other 32 slide blocks are byte-identical to the
baseline. Independent source review confirmed notation, mathematical meaning,
map/reveal consistency, Summary, Outline, root README and artifact catalog.
The accepted Slidev L9's mirrored CFG and Training/Sampling remain consistent;
this short overview does not require extending its Recap. The incoming L8 Recap
is unchanged. The course-refresh item is closed in the agreed scope; timing was
not remeasured. Beamer, shared theme/tools and other lectures were not edited.

Finalization used a physically separate dependency installation at
`/private/tmp/dgm-l8-guidance-20261003/`: source checks, **48 existing tests**, build
and both exports pass. There are **34 handout pages / 76 reveal pages**.
`render-qa.py` found no raw math. All 34 handout pages equal their final reveal
states pixel for pixel. The unchanged content of 32 handout pages / 73 states
matches the baseline at 1280x720, masking only the folio rectangle
`(1190,675)-(1280,720)` because the total slide count increased. The new slide's two
states and the updated Summary were visually reviewed at full size.

Post-export browser checks cover **32-34 / 5 states** and explicit returns to 33
from both neighbors. All pass: no overflow, raw math, missing images, JS/HTTP errors,
empty click or moving geometry. PDF/browser typography was compared at equal scale
with the approved L1:35 references: Arial 37 px headings, 24 px body/graph labels,
24.96 px KaTeX, 12 px sources, and the shared navy/teal palette. The isolated server
was stopped. This is scoped verification, not a new full-lecture browser audit.
Publication required **42 render inputs** to match the verified isolated build;
the delivered PDFs match its files byte for byte.

QA: `../output/qa/lecture8/guidance-extensions-2026-10-03/`.
Baseline slides.md SHA-256: `9f31b67ab5f95525950a1c4c0cc65a406c6c0ab44d6588095c6d825e0ce79ed6`.

- SHA-256 slides.md: `e0ed8583d85a6ab6b25463ebba6f574c73aae720f2af73872457118037480dd8`.
- SHA-256 slide-map.json: `fbe4edce65b0760cfb898a4a5a1ca7e08cf33bc0d216c2dc7ef2cfbe6549c7c3`.
- SHA-256 Lecture8.pdf: `3ece564ae87af1ff65702e2226649151be23b59a88945b6ff6b7f880eea5134c`.
- SHA-256 Lecture8-handout.pdf: `292454a71e1ff2afc45f6815ebff3303d75588e03cd53399c8e0d39b71317861`.

## Guidance interpretation: minimal clarification, 2026-09-27

The author chose to close the course-refresh interpretation item with two small
changes to slide 26: the scaled conditional distribution is explicitly described
**at a fixed noise level**, and the final reveal adds: "Very large gamma can reduce
diversity and introduce artifacts." The original equations and four clicks remain;
the practical caveat cites Sadat et al. (ICLR 2025). No predictor-corrector slide or
required transfer of that detail to another lecture is pending. The lecture remains
**33 slides / 74 states**. The original refresh timing estimate was not remeasured.

Earlier author decisions are also closed in the local course-refresh report:
the Summary item was obsolete because the current five bullets already omit
"DDPMs are quite slow"; velocity-form CFG was moved to the existing L11 task,
after velocity and flow matching in L9-L10. L8 retains score-form CFG.

The final build includes the independently approved Recap clarification recorded
below. Baseline source SHA-256 was
`f53859f543deca2bc88f3d31afea24332eb7447510c337bae07ae9d68a6c386e`;
the baseline PDFs already contained the Recap change. Relative to that baseline,
only handout page **26** and reveal pages **52-56** differ at 1280x720; the other
**32 handout pages / 69 reveal pages** are pixel-identical without masks.
All 33 final reveal states equal their handout pages. The changed handout and all
five reveal states were visually reviewed at full size.

Finalization in the isolated `/private/tmp/dgm-l8-guidance-20260927/` installation
passed source checks, **46 existing tests**, production build and both exports.
`render-qa.py` checked all 107 PDF pages. Browser checks covered slides
**2, 25-27 / 12 states**, including reverse clicks and both neighbor returns for
slide 26; no overflow, raw math, missing resources, JS/HTTP errors or geometry
changes remained. A transient first-load dev UI capture was repeated after resource
compilation; the final Recap capture is clean. The L8:26 PDF/browser were compared
at equal scale with the approved L1:35 PDF/browser references: Arial 37 px titles,
24 px block headings, 24.96 px KaTeX, 12 px sources and navy/teal colors agree.
The isolated dev server was stopped after QA. This is scoped visual verification;
unchanged pages reuse the preceding verified exports.

Before the scoped commit, the current diff contained only the four L8 files;
neighboring tasks had committed their own work. Independent source review confirmed
incoming L7 Slidev and outgoing L9 Beamer Recaps, repeated formulas/notation and
Training/Sampling, five-bullet Summary, Outline, root README and artifact catalog.
The previously recorded "convex combination" wording remains an inherited editorial
observation outside this agreed edit. Shared infrastructure, Beamer and merged
lectures were not changed. Publication required all **40 render inputs** to match
the isolated build; both delivered PDFs match the verified files byte for byte.

QA: `../output/qa/lecture8/guidance-scope-2026-09-27/`.

- SHA-256 slides.md: `9f31b67ab5f95525950a1c4c0cc65a406c6c0ab44d6588095c6d825e0ce79ed6`.
- SHA-256 slide-map.json: `af8ada0b619b5e09a635cec46ef1119214627c8e928b2a356b1da386dc85c171`.
- SHA-256 Lecture8.pdf: `1840de1b5053fc87dc5b0d105750a623b4f902a7a4dc7a3e86e6b37c7f53318c`.
- SHA-256 Lecture8-handout.pdf: `76f8dd542fc6ea107e6c5ded8e104e3731eca7d404bc1219e3cb1bc78012e00c`.

## Recap synchronization with Lecture 7, 2026-09-27

The author requested a consistency pass after changes to Lectures 3–7. Recap slide 2 now explicitly repeats the sufficiently-small-beta assumption and approximate Gaussian conclusion from L7:14; the same note on L7:15 was synchronized. Other L7→L8 equations, ELBO decomposition and DDPM Training/Sampling already agree. No slide/click/map, Summary or schedule change is needed.

Source checks, finalization (33 handout /74 reveal pages), browser overflow/math/resource checks on slide 2 and returns from both neighbors pass. Exactly handout page 2 and reveal page 2 changed; all other 32/73 pages are pixel-identical to the previous PDFs. All final reveal states equal handout pages. The changed PDF was reviewed at 1280 px; fresh PDFs were copied only after render-input hashes matched the workspace. The common Lecture 1 typography is preserved. QA: `/private/tmp/dgm-recap-sync-20260927/lectures-slidev/output/qa/lecture8/`. This is scoped Recap validation, not a new full lecture audit.

## Text-guidance CFG sweep, 2026-09-27

The author approved retaining slide 19 (the VQ-VAE-2 ostriches) and replacing only
slide 20's GLIDE panda with a controlled guidance-scale comparison. After source
research, the author explicitly accepted **SDXL** instead of SD3/Flux. Slide 20
now shows four unmodified baseline CFG samples from **Kasymov et al., AutoLoRA
(2024), Fig. 3, top row, columns 1/3/5/7**: prompt `Anna`, guidance scales
**3.5/4.5/5.5/6.5**, SDXL with Disney Princess LoRA at fixed weight **0.7**. The
published caption confirms identical initial noise. These are ordinary CFG
samples, not the paper's AutoLoRA outputs. The paper's `w` is the lecture's
`gamma`; both use unconditional + scale × (conditional − unconditional).

Local image files retain their original bytes and dimensions. Attribution,
selected-column disclosure and CC BY 4.0 are visible; exact source URLs and
SHA-256 hashes are in `public/figs/sources.json`. Speaker notes record the setup,
the retired GLIDE citation and the limitation that a single seed demonstrates
appearance changes, not a distribution-level diversity measurement. No claims
about an optimal guidance scale or high-scale failure are added to this example.

The map and reveals are unchanged: **33 slides / 74 states**, static slide 20.
Independent scoped source review found no issues. All other slide blocks are
byte-identical to the baseline; incoming/outgoing Recap, Summary, section schedule
and artifact catalog require no update. Shared infrastructure and Beamer were
not edited.

Finalization reused the stopped, isolated copy at
`/private/tmp/dgm-l8-guidance-20260927/` with refreshed course sources and physically
separate dependencies. Node 24.19.0 / Slidev 52.19.1: source checks, **41 existing
tests**, production build and both exports passed. `render-qa.py` checked all
33 handout pages and 74 reveal pages. At 1280×720, exactly handout page **20** and
reveal page **31** changed; the other **32 handout pages / 73 states** are
pixel-identical without masks. Every final reveal state equals its handout page.
The changed page was visually reviewed at full size in both PDF and browser.

Post-export browser inspection covered slides **19–21 / 9 states**, plus explicit
returns to slide 20 from both neighbors. No overflow, asset errors, JS/HTTP errors,
empty clicks or changed reveal geometry were found. Style was compared with the
approved L1:35 browser capture and current L1:35 handout at 1280×720: Arial 37 px
headings / 24 px text, 24.96 px KaTeX, 12 px credits and the shared navy/teal palette
match. The isolated QA server was stopped. This is scoped validation; physical
devices and a fresh full-lecture browser audit are outside this illustration edit.

QA: `../output/qa/lecture8/cfg-sweep-2026-09-27/`.
Baseline slides.md SHA-256:
`9506321cf2df56b8ed71cc76224ff79cd02cbc50bd0195a6f3aa37ac63674133`.

- SHA-256 slides.md: `9cce0cb8960966b69c3542e18f62390409aebb1096e3755c8402b49b85e97d88`.
- SHA-256 slide-map.json: `af8ada0b619b5e09a635cec46ef1119214627c8e928b2a356b1da386dc85c171`.
- SHA-256 Lecture8.pdf: `79bda1f5b1a8454f5062d8135c048e73acb1f4e24d50ea2fc4203313a73cd5b4`.
- SHA-256 Lecture8-handout.pdf: `90c84274cf7b2f6bd73165bed32d87a16a375f0e3115aef4cd79ef80c795567a`.

## Classifier-guidance derivation merge, 2026-09-27

The author approved a narrower course-refresh edit than the original three-slide
proposal: merge former slides **24–25**, keep Guidance Scale and Distribution
Sharpening separate, and retain the Training/Sampling Overview. The classifier
guidance block now has **five slides (23–27)**. In slide 24, the final Bayes-derivation
row introduces the conditional score `s_{theta,t}(x_t,y)`; the separate
`extension: 28` repetition is removed. The guided sampling equation, every Bayes
step, all semantic colors, citation, original block titles and three reveal clicks
remain. Former slides 26–28 are now 25–27, with byte-identical content.

The map is renumbered to **33 slides / 74 states**. Both merged slides belonged to
source frame 28, so removing its continuation requires no `mergedSourceFrames`
declaration. All other source blocks are byte-identical to the baseline. The
course-refresh item is closed in the agreed scope; no Supplementary transfer or
further reduction is pending. The former minus-four-minute estimate was not timed.

Scoped source review covered notation, Bayes/score equivalence, source-frame
coverage, citations and reveals. L9's mirrored definitions and Training/Sampling
remain consistent. The incoming Recap, Summary, sections, root schedule and Slidev
catalog are unchanged and remain applicable; catalog artifact paths are unchanged.
Shared infrastructure, Beamer and `lectures/merged/` were not changed.

Finalization ran in `/private/tmp/dgm-l8-guidance-20260927/` with physically copied
dependencies, Node 24.19.0 and Slidev 52.19.1. Source checks, the **32 existing tests**,
production build and both PDF exports passed. The initial sandboxed export could
not allocate a local port; the export succeeded with local-server permission after
the final build. Existing project servers were left alone; the isolated QA server
was stopped after inspection.

`render-qa.py` verified all **33 handout pages / 74 reveal pages**. All 33 final
states are pixel-identical to their handout pages. Apart from the updated page
counter, the **32 unaffected handout pages and 70 unaffected states** match the
baseline exactly (mask: x=1150–1280, y=675–720 at 1280×720). Slide 24's four states
were visually reviewed at full size in PDF; its final browser state was also
reviewed. No overlap, clipping or prematurely visible content was found.

Post-export browser inspection covered slides **23–27 / 19 states**: all clicks
are meaningful, geometry is stable, backward steps match, assets load and no
overflow or HTTP/JS errors occur. Additional checks confirmed returns to slide 24
from both neighbors and replay of all four states. Typography was compared at
1280×720 with the saved approved L1:35 browser reference and the current L1:35 PDF:
Arial headings (37/24 px, weight 650), KaTeX math (24.96 px), bold vectors and
parameters, source credits (12 px), navy and teal match the shared style. This was
a scoped follow-up, not a fresh full-lecture/browser or physical-device audit.

QA: `../output/qa/lecture8/guidance-merge-2026-09-27/`.
Baseline commit: `61f4ee3d`; baseline slides.md SHA-256:
`c45e4aa15c0372e9890f8e4b0f831d040091e03464eab00a1f722441949606f4`.

- SHA-256 slides.md: `9506321cf2df56b8ed71cc76224ff79cd02cbc50bd0195a6f3aa37ac63674133`.
- SHA-256 slide-map.json: `af8ada0b619b5e09a635cec46ef1119214627c8e928b2a356b1da386dc85c171`.
- SHA-256 Lecture8.pdf: `1f01be4728c1afaa8445bae2f4988aaa2dbd30afbb7bc2c3c9e8dcc3ccc2cf6e`.
- SHA-256 Lecture8-handout.pdf: `7f08cc5ed2a37013e842a385ba10177148eeb96e0bb17d903baaa7ff29a12686`.

## Tweedie cross-reference for noise-to-score conversion, 2026-09-27

As requested alongside the new Lecture 6 derivation, slide 11 (`extension: 18`) now identifies the existing noise-to-score conversion as the identity from **Tweedie's formula (Lecture 6)** at the MSE optimum. This qualification distinguishes the optimal conditional mean from an individual noise realization. The displayed model parameterization and loss, citations, one reveal click, algorithms, neighboring recap interfaces, Summary and sections are unchanged: **34 slides / 76 states**. No new formula or slide was required.

Source check, production build, both exports and `render-qa.py` passed in the isolated Tweedie task copy using Node 24.19.0; the 32 existing tests were run once with L6. Handout 11 and steps 14–15 were visually reviewed; the remaining **33 handout pages and 74 states** are pixel-identical to the baseline. All 34 final reveal states match the handout. Post-export inspection covered slides 10–12 (10 states), backward steps and explicit returns to 11 from both neighbors, with no errors, overflow, empty clicks or geometry changes. The final one-line reference and unchanged Arial/KaTeX typography were checked in browser and PDF against L6 and the saved approved L1:35 references at 1280 px. Shared infrastructure, Beamer and physical-device testing are outside this scoped change.

QA: `../output/qa/lecture8/tweedie-2026-09-27/`.

Baseline SHA-256 slides.md: `4e91f44e9251cdc46c107e0afa12f05e2195c5abd2bae7eead3e4d3cfa6816ba`.

- SHA-256 slides.md: `c45e4aa15c0372e9890f8e4b0f831d040091e03464eab00a1f722441949606f4`.
- SHA-256 slide-map.json: `a68861a4c5a4f53bf2d993d0a493d51ce5c467dc45c01f673b9baa4a4370d134`.
- SHA-256 Lecture8.pdf: `41785062262d4fa778115f76b3d672d199b5e0d78c461eba8b34e8b7abb4b34d`.
- SHA-256 Lecture8-handout.pdf: `b98ddc72631169d57bab693a07b6e6cdb76c505c9f714a238be6b15ea7acbd7f`.

## Boundary update for the redistribution through Lecture 7, 2026-09-26

The author-approved redistribution moves the ELBO completion, Gaussian diffusion reparametrization, and the final DDPM algorithm to Slidev L7: source frames 9–17, including continuations of frames 10/12/13/14. L8 retains frame 17 as a static `Recap of Previous Lecture`, exactly matching the imported L7 Training/Sampling algorithm. The earlier forward-process and DSM recap frames 2–4 now belong to L6 and are omitted here; the reverse-process/VAE recap frames 5–7 and their continuations remain unchanged. Declared omitted frames are 2/3/4/9–16; frame 17 remains covered by its recap.

The two transferred ELBO/reparametrization sections are declared in `omittedSourceSections`. The remaining DDPM section is named `DDPM as a Score-Based Generative Model`, using `sectionTitleOverrides` for the original Beamer title. Its body frames 18–21 and all guidance frames 22–34, including their continuations, are unchanged. Outline slides reflect these two remaining sections and the two guidance subsections. The five static Summary bullets now cover the DDPM/NCSN objectives and sampling, conditional generation, classifier guidance, and classifier-free guidance. No topics from Lecture 9 or later are imported.

Baseline `slides.md` SHA-256: `ee1f2946edb310a6ea18938d879aee24f8683670c7484cab29573401a323b960`. The updated map contains **34 logical slides / 76 states**. Source comparison confirmed exact preservation of all 21 remaining body slides and the five retained recap slides, plus the new static DDPM recap's match with L7. Both maps, click counts, and local image paths are consistent. Beamer, shared styling/macros, and `lectures/merged/` are unchanged.

Проверки текущей редакции завершены: README/Outline, входящий и исходящий Recap, Summary, карты, формулы, раскрытия, ссылки и локальные рисунки согласованы с новыми границами. `check-source` проходит для всех 14 лекций; добавлена проверка продолжений импортированных frames без ослабления собственного покрытия. `finalize 8` (Node 24.19.0) прошёл: **19 тестов**, web build и оба PDF. Сборки и экспорты выполнены последовательно в изолированной копии с физически отдельными зависимостями; работающие серверы исходного проекта сохранены.

Просмотрены все **34 страниц раздатки и 76 страниц PDF с раскрытиями**, плотные выводы и новые блоки дополнительно при ширине 1280 px. Все страницы раздатки попиксельно совпадают с соответствующими финальными состояниями. Браузерный инспектор прошёл все **34 слайдов / 76 состояний**: геометрия стабильна, клики содержательны, обратные шаги воспроизводятся, формулы и изображения загружены, переполнений и HTTP/JS ошибок нет. Стиль сравнен с утверждённой L1: в PDF L7 33/44 и L1 35, в браузере L4 33 и L1 35; Arial/KaTeX, bold vectors/parameters, KL/expectations, заголовки и цвета согласованы. Общая тема и макросы в этой задаче не менялись.

Артефакты QA: `../output/qa/through-lecture7-2026-09-26/`. Физическое перо и проектор повторно не проверялись. Исторические результаты ниже относятся к прежним редакциям.

SHA-256 текущей редакции: slides.md `4e91f44e9251cdc46c107e0afa12f05e2195c5abd2bae7eead3e4d3cfa6816ba`; slide-map.json `a68861a4c5a4f53bf2d993d0a493d51ce5c467dc45c01f673b9baa4a4370d134`; Lecture8.pdf `6f17d3f5a14ae4c0a5619567215a4599de1257303fbe7a525e4ca74d1ce5bc0a`; Lecture8-handout.pdf `c59bf31ded3bb7fc1d24dfb895a6dbd4ae38f3ca6d48e4b7e310b1625f236a5b`.

L9–L14 не изменялись: начальные ELBO/reparametrization recap-слайды L9 теперь повторяют материал L7. Это сохранённая граница задачи «дальше оставить как есть», математических расхождений нет.

Completed on **2026-09-15**. Course workflow: [MIGRATION.md](../MIGRATION.md).
The final source and both reviewed PDFs preserve the Beamer material in the
approved Lecture 1 style. No lecture-specific font sizes, scaling, macro overrides,
or shared theme changes were introduced by this migration.

## Baseline and resulting artifacts

- Repository baseline: `19e673be350344c8ea4fafffb78fa389d8b65e19`.
- Beamer source: `lectures/lecture8/Lecture8.tex`, SHA-256
  `88d1d3237358483405ef26285594fdf2a5d9b997268491e4123c03ca0b5bbe51`.
- Beamer PDF: `lectures/lecture8/Lecture8.pdf`, **109 pages**, SHA-256
  `3abe56efecad221dfb0b83ac3e7a59eb92ea0bdac65ef8a82232a5265f6e989d`.
- Shared notation source SHA-256:
  `85df378eb646f74b973e84a3c38add1ac827ebccb943b3b1e4ae347b659f809a`.
- [slides.md](slides.md): SHA-256 `ee1f2946edb310a6ea18938d879aee24f8683670c7484cab29573401a323b960`.
- [slide-map.json](slide-map.json): SHA-256 `a7ed77ea06c9a2367d8d0bf6dfdb0cda36f7a0c1ef1992b07c571d47d1d75aba`.
- [Lecture8.pdf](Lecture8.pdf): **111 pages**, SHA-256 `750f5518aa4ca456207b32d3c38d6f271e64e8e22e3106084b42a829c8a3718a`.
- [Lecture8-handout.pdf](Lecture8-handout.pdf): **52 pages**, SHA-256 `3745948e87f1b175951453032150e0b3ba400fd6732efc37e6d852138d690aee`.

Beamer sources/PDF and `lectures/merged/` were left unchanged. The parent task owns
the shared infrastructure and the [Slidev artifact catalog](../README.md).

## Content, frame map and reveals

- All **35 explicit source frames**, including the cover, original Outline,
  six Recap frames and the static six-bullet Summary, are accounted for exactly once.
- All **6 automatic Outline transitions** are retained: four sections and the two
  subsections of Model Guidance. Outline slides contain only the original agenda.
- **52 logical slides**, **59 within-slide clicks**, **111 rendered states**.
  The Beamer source has 68 reveal directives. Nine original pauses become boundaries
  between continuation slides; two static-frame splits add the two PDF pages.
- Every slide has an explicit `sourceFrame` and `clicks`, matched by `slide-map.json`.
  All rows of derivations, within-line reveals, semantic colors, citations,
  algorithms, and the original order remain. There are no source `\note` commands.
- The original Training/Sampling blocks remain intact and ordered. The derivation
  inside the source DDPM Sampling block retains its original equation reveal.
  Original equation-only sampling illustrations were not rewritten as new algorithms.
- Reveal rows use cumulative KaTeX ranges; the isolated within-line DDPM inversion
  uses the Lecture 1 `math-chain` pattern. Future content is fully hidden and retains
  its geometry. Final handout states retain every cumulative derivation row.

### Splits at the common course font size

No frame is merged or discarded. Extensions retain the original frame's title and
citation. The following splits provide room for formulas and the source footer.

| Source frame | Slidev slides | Reason / original progression |
|---|---|---|
| 4 | 4–5 | NCSN and Gaussian perturbations, then DSM theorem and its note. |
| 5 | 6–7 | Reverse-process figure and Gaussian approximation, then the two process lists; original static frame. |
| 7 | 9–10 | Latent variables and factorization, then standard ELBO and its decomposition; original static frame. |
| 10 | 14–15 | Variance assumption and optimal endpoints, then Gaussian KL-to-MSE derivation. |
| 12 | 18–19 | Linear relationship and inversion of the forward sample, then mean substitution and simplification. |
| 13 | 20–21 | Two mean parametrizations, then both noise-objective expressions and the prediction interpretation. |
| 14 | 22–23 | Full ELBO and weighted noise loss, then the simplified objective. |
| 18 | 28–29 | Noise loss and conditional score, then score parametrization and DSM form. |
| 20 | 31–32 | Every ancestral-sampling equality, then the complete annealed Langevin algorithm. |
| 28 | 42–43 | Bayes derivation, then the guided-score definition and identity. |
| 32 | 48–49 | Bayes identity for the classifier score, then all three CFG equalities. |

Long expressions are broken only at complete algebraic terms. Fixed-size delimiters
may span the two simultaneously visible display rows; paired `\left`/`\right`,
fractions, roots, and underbraces are never split across separate reveal fragments.
The source's unbalanced-looking color/group syntax in frame 13 was normalized into
one complete model-mean row. Its five original PDF states (pages 28–32) were inspected:
the entire row appears together, exactly as retained in Slidev.

## Sources and assets

All original citation URLs and figure uses are retained. The source checker validates
26 direct linked-citation uses; the nested `\href` citations in frames 7 and 21 were
also checked explicitly. Continuations repeat their source credits. The original
8 bitmap files are copied byte-for-byte into `public/figs/` (no resampling).

| Asset | SHA-256 (matches the Beamer asset) |
|---|---|
| `DDPM.png` | `847ccca8bbde0aaf9749d8d2a24ffd89aae4ebd59ec7847174527a805ac663d6` |
| `cfg.png` | `9ccec7e07f477fc439530b94e3f4857adcefa724b76bd9c9713c1ec35a860bb9` |
| `conditional_diffusion.png` | `a98939cb1c957b4340c591b229164a040d17ae595492c7441f6846daad45d970` |
| `diffusion_objective.png` | `61609f63ec4cb2c0c4b57c1d84be32637845893b101a8513315a6487022ec6a0` |
| `diffusion_over_time.png` | `103b5ab5c1cba74015332ec605b46b93a7c7bd82e04720b9a243d217246aaa94` |
| `label_conditioning.png` | `1dc960f9e699391ec5911041783b450158032f338867600fcbef887a46fccaf4` |
| `shedevrum1.jpg` | `158588c11836767a15315cfa6123f3008ef7d2431bb0781313d7a1985c42a97c` |
| `shedevrum2.jpg` | `64b0555bb654bdad32ebbbe6dbd19d94f0ac448e93a19560a2f61e5d1e3aac5d` |

The taxonomy uses the shared component
`<TaxonomyDiagram class="taxonomy" denoising-diffusion />`, with the original `ddpm`
highlight, at the standard full-width course size. Violet emphasis is mapped to the
approved `#8854c0` palette; the named teal, olive, red and gray meanings are preserved.
Headmatter reuses Lecture 1 geometry, fonts, drawing settings and local theme;
`favicon: "data:,"` avoids a remote favicon. No new interactive demo was needed.

## Source audits and neighboring lectures

The Slidev source was checked with the project `lecture-audit`, `notation-lint`,
`recap-sync`, `summary-sync`, and `readme-sync` workflows. These checks distinguish
content agreement from the separate rendered evidence below.

- **Notation and material:** all 87 course macros match the shared adapter;
  editable KaTeX, complete derivations, local images, source links, sourceFrame map,
  Training/Sampling grouping, and all original semantic colors pass. No raw font
  macros or local symbol substitutions were introduced.
- **Incoming Recap:** final Lecture 7 Slidev → Lecture 8 Slidev passes. Forward
  diffusion, Gaussian/NCSN conditional scores, DSM, reverse and conditioned kernels,
  factorization and ELBO retain the same objects, indices and parameters.
  Compared Lecture 7 source SHA-256:
  `e13e9833bf1f316ae4d5342607806123be397efe5b226a4a1bb56fc2f7cecd7d`.
- **Outgoing Recap:** Lecture 8 Slidev → Lecture 9 Beamer passes against its recap
  frames 2–9: Gaussian ELBO, noise parametrization, DDPM Training/Sampling,
  DDPM/NCSN comparison, classifier guidance and CFG. This is a mixed-format
  content comparison, not a claim about Lecture 9 Slidev typography.
- An independent parent-coordinated source audit confirmed both boundaries at
  Lecture 8 source SHA-256 `ee1f2946edb310a6ea18938d879aee24f8683670c7484cab29573401a323b960`; no migration correction was required.
- **Summary:** six static bullets cover noise prediction, sampling cost, the NCSN
  connection, conditioning, classifier guidance and CFG. No takeaway was added or lost.
- **Schedule:** the root Materials row for Lecture 8 matches all four sections,
  the two nested guidance subsections, and their order. No schedule change is needed.
  The parent task added the completed source/PDF/journal links to the Slidev catalog.

### Preserved source editorial choices

These are inherited observations, not migration defects and not silently corrected:

- Frame 19's NCSN objective omits the `\sigma_t^2` weight used by the earlier
  NCSN Training/objective. Lecture 9 recap frame 5 repeats that omission. The
  coefficient-omission and ELBO/score-matching equivalence wording is also preserved.
- The fixed encoder still appears in the inherited `\cL_{\bphi,\btheta}` notation,
  and the DSM theorem retains `\text{const}(\btheta)`.
- Existing Training blocks without an explicit optimizer update retain that scope.
- Generalized `\alpha_t` in the DDPM/NCSN summary is preserved even though earlier
  discrete DDPM notation uses `\alpha_t=1-\beta_t`.
- CFG keeps the source convention `(1-\gamma)s + \gamma s_cond`, the shorthand
  `\nabla^\gamma`, and “convex combination” wording in frame 33. That wording is
  not literal when `\gamma>1` (the earlier example includes `\gamma=3`).

## Finalization and concrete verification

Builds were isolated in
`/tmp/dgm-slidev-l8-20260915/lectures-slidev/`, with a **physical macOS `cp -cR`
copy of `node_modules`**, not a symlink. The directory contains the current shared
theme/tools; a byte comparison after export found no theme difference from the main
project. Dev, build and export were run sequentially inside that installation.
No dev/build/export was run in the shared workspace by this worker.

The coordinator also checked the shared taxonomy additions against Lectures 1–4:
source checks, builds and both exports passed. All 469 PDF pages were compared with
the initial working copies. Lectures 1/2/4 are pixel-identical; the only differences
in Lecture 3 are randomized existing `v-mark` strokes on 15 pages, with identical
text and pixels outside those strokes. The existing working PDFs were preserved.
Shared browser regression and comparison details are in the
[Lecture 6 journal](../lecture6/migration.md).

Runtime: bundled **Node 24.19.0**, locked Slidev **52.19.1**; bundled Python with
`pypdf`, `pypdfium2` and Pillow. Export and browser inspection use the installed
Yandex Chromium browser.

| Check | Result |
|---|---|
| `node tools/run.mjs check 8` | 35 frames, 6 transitions, 52 slides, 111 states; all assets/citations/macros pass. |
| `node tools/run.mjs finalize 8` | Source check, 13 existing numerical/infrastructure tests, production build and both PDF exports pass. |
| `python tools/render-qa.py 8` | 52 handout and 111 reveal pages; no raw math delimiters. |
| Visual PDF review | All 163 pages reviewed through all 15 contact sheets; dense pages inspected at full size. |
| PDF final-state equivalence | All 52 handout pages are pixel-identical to the corresponding final reveal pages. |
| Postexport `node tools/inspect.mjs 8` | All 52 slides / 111 states; no overflow, missing image, raw math, KaTeX error, console error or failed response; geometry and reverse clicks stable. |
| Additional navigation | Every applicable previous/next-neighbor return tested for all 52 slides, preserving initial and final state geometry/visibility. |
| Resource isolation | External requests blocked; zero external requests, missing assets or page errors during the full return/annotation run. |
| Annotation integration | Slide 18: synthetic pointer ink, Undo/Redo, Save, Save & clear, Restore, and byte-identical saved SVG after all clicks and neighboring-slide return pass. |

Full-size PDF review included slides 2, 4, 5, 8, 10, 14, 16, 21, 27, 28, 30, 41,
42, 44, 45, 49, 50 and 51. The parent independently reviewed handout pages 27, 41
and 49 at full size. No clipping, overlap, source collision or missing reveal content
remains in the final exports. Annotation UI and synthetic marks are absent from both PDFs.

### Actual Lecture 1 and Lecture 7 style comparisons

Reference Lecture 1 source SHA-256:
`e264d0b2af0ecaebd7be0a1fedf7549d28223afcd1f20b618d6c9052183c728e`.
Reference handout SHA-256: Lecture 1
`623b1223a84cede6d012ed83020fce4611b1f7f0419a521cb7717b926980407f`,
Lecture 7
`e711415d77d7eccd5d4c0066ee206a11e9923f206d0a299ade8f6ab2f3e5f895`.

The following pairs were inspected at equal scale in **both PDF and browser**:

- Lecture 8 slide 10 / Lecture 1 slide 35: `\KL`, `\pd`, `\pt`, bold vectors and
  parameters, expectation/optimization operators, title and block hierarchy.
- Lecture 8 slides 2 and 4 / Lecture 7 slides 17 and 20: forward Gaussian kernels,
  `\bar{\alpha}_t`, noise indices, `\cN`, gradients and conditional scores.
- Lecture 8 slide 5 / Lecture 7 slide 21: the complete DSM theorem and its note.
  The matching body region is **pixel-identical in PDF and in browser screenshots**.
- Lecture 8 slide 10 / Lecture 7 slide 39: colored ELBO decomposition, KL indices,
  underbrace and the retained `\bphi,\btheta` notation.

The browser CSS measurements agree with the approved reference: Arial title 37 px /
42.18 px line height / weight 650; block heading 24 px / weight 650; KaTeX main math
24.96 px; source credits 12 px. Navy is `rgb(23,50,77)`, block teal is
`rgb(0,127,130)`. Actual rendered subscripts, bold glyphs and Greek letters were
inspected; agreement is not inferred only from macro names. Reference dev servers
were started sequentially after stopping Lecture 8 and were stopped after inspection.

### Evidence locations and limits

Temporary evidence (not course deliverables):

- `/tmp/dgm-slidev-l8-20260915/lectures-slidev/output/qa/lecture8/`:
  all PDF contact sheets, extracted text, full-size pages, browser slide screenshots,
  `browser-report.json`, `reentry-report.json`, `pdf-final-state-comparison.json`,
  `style-L1-*.png`, `style-L7-*.png`, `style-L8-*.png`, CSS metrics and synthetic
  annotation archives.
- `/tmp/dgm-slidev-l8-finalize.log`, `/tmp/dgm-slidev-l8-inspect.log`,
  `/tmp/dgm-slidev-l8-extra.log`.
- `/tmp/dgm-slidev-l8-source-qa/`: inspected original Beamer frame 13 states.

Physical stylus pressure/palm rejection, projector output and a tablet-to-display
network setup were not available and are not certified. The pointer/browser check
establishes only the tested local annotation behavior. No new demo or presenter/viewer
component-state synchronization was introduced. Temporary QA archives are separate
from the delivered course files. No commit was requested or created.

## Равномерные интервалы Summary, 2026-10-03

По запросу автора общий `class: summary` использует вертикальный flex-список с `justify-content: space-between`, аналог `\vfill` между пунктами. Размер шрифта и содержание сохранены; в L4 удалены локальные margin. Проверены Summary всех 14 лекций в браузере и обоих PDF: одинаковые промежутки, отсутствие переполнений, совпадение handout и финального состояния. Для этой лекции: **33 слайдов / 74 состояний**; source check, web build и оба экспорта прошли с Node 24.19.0 в изолированной копии. Все тексты PDF сохранены, остальные страницы попиксельно совпадают с контрольной версией. Это проверка оформления Summary; полный содержательный аудит не повторялся. QA: `../output/qa/summary-spacing-2026-10-03/`.

## Три согласованных guidance-демо, 2026-10-03

Автор согласовал геометрию classifier guidance, изменение плотности при разных γ
и CFG как экстраполяцию. Отдельное noise-to-score демо не добавляется.
Исходная редакция этой задачи: **34 слайда / 76 состояний**, SHA-256 slides.md
`2c2862db39a61cf2bbacf3f7f15c54d2b6b389ee2b672524b6a02f29515a688c`.
Сохранены все предшествующие правки, включая guidance interval / autoguidance,
иллюстрации, ссылки и Summary.

- **25, extension: 28 — Classifier Guidance: Which Way Does It Push?**
  Два класса, по две Gaussian components с известными weights и variance.
  Точный marginal score, γ × gradient log classifier posterior и их сумма.
  A/B, γ = 0…7, пресеты 0/1/3/7, Reset; перетаскивание наблюдения, стрелки и Home.
  Общий масштаб стрелок сохраняет относительные длины. В PDF: class B,
  фиксированное наблюдение (1, 0), γ = 3.
- **28, extension: 30 — Guidance Scale Changes the Density.**
  Нормированная 1D density qγ ∝ q × p(y|x)γ при фиксированном noise level.
  Те же component x-means и weights, но отдельный scalar classifier:
  tilt 1D marginal не объявляется marginal от tilted 2D density.
  γ = 0/1 восстанавливает unconditional/conditional; 3/7 усиливает classifier
  preferences. Нормировка численная на [-5, 5]. PDF сравнивает все четыре пресета.
  Никакой формулы для конечной density полного guided sampler не утверждается.
- **34, extension: 33 — CFG: Interpolation and Extrapolation.**
  Фиксированные аналитические unconditional/conditional scores при (1, 0),
  общий фиксированный масштаб в score space. γ = 0…5, пресеты 0/0.5/1/3 и Reset.
  PDF одновременно показывает γ = 0/1/3. Значение ∅ объяснено на этом слайде.
  В source frame 33 «convex combination» заменено на «affine combination»,
  чтобы текст согласовывался с γ > 1. Это новое согласованное уточнение прежнего
  сохранённого editorial choice; формулы и раскрытия исходного слайда сохранены.

Существующие slides/Recaps/Training/Sampling и Outline не переписывались.
Независимые scoped source checks проверили новую математику/нотацию,
incoming Slidev L7→L8 и outgoing Slidev L8→L9, Summary и schedule/catalog.
Пять прежних Summary bullets покрывают добавленные примеры; новых тезисов и
разделов нет. Source map и инструкции управления в Slidev README обновлены.
Beamer и `lectures/merged/` не затронуты.

В изолированной физической копии зависимостей
`/private/tmp/dgm-l8-interactive-20261003/work`, Node 24.19.0 / Slidev 52.19.1:
source check, **52/52 tests**, production build, оба экспорта и render-qa.py прошли.
Четыре новых численных теста проверяют scores через finite differences, Bayes
classifier gradient, нормировку/γ endpoints, CFG extrapolation и общие x-marginals.
Они включены в test:demos и finalize.

Браузерный inspect.mjs проверил все **37 слайдов / 79 состояний**: раскрытия,
стабильную геометрию и обратные клики, KaTeX, ресурсы и границы содержимого.
После последнего экспорта повторно проверены 25/28/33/34.
Новый inspector проверил **28 визуальных состояний**, включая static print:
sliders/presets, оба класса, drag/keyboard/bounds, Reset, возврат с обоих соседей,
отсутствие внешних сетевых зависимостей и synthetic pen. Перетаскивание точки
отключено при активном пере; контролы доступны. Реальные stylus/palm rejection,
проектор и синхронизация presenter/viewer этим не проверены.

Все страницы обоих финальных PDF просмотрены на контактных листах, три новых
слайда и affine-правка — крупно. Исправлены footer clearance в live и static
density/CFG; шрифт не уменьшался. Все **37 финальных состояний** steps попиксельно
совпали с handout. С baseline совпали **33 прежние handout pages и 74 reveal states**
после исключения только folio; оставшиеся различия — ожидаемый affine-текст
(handout 33, steps 72–73). Новые страницы steps: 48/58/74.

Стиль сопоставлен в PDF с L1:30 (Histogram) и L6:27 (Tweedie), в браузере —
L1:30 и L8:34. Заголовки совпадают: Arial 37 px / 42.18 px, weight 650,
позиция (58, 72), ширина 1164. Сохранены общие KaTeX macros, DemoPanel,
цвета, кнопки и геометрия 1280×720. Общая тема и макросы не менялись.

Результат: **Lecture8-handout.pdf — 37 страниц**, **Lecture8.pdf — 79 страниц**.
QA: `../output/qa/lecture8/guidance-demos-20261003/`.
Финальные SHA-256:

- slides.md: `1b04bf9518ff51e1f03abbbe15a7192c7c74d0ec727303ebc40f87d279ad8c7d`.
- slide-map.json: `62fb949f79fa5ac7d327b178ce4814462eabb9e42a8ace2cc25dde2b590b3b91`.
- Lecture8.pdf: `e02af932663ce78457764f08086e28416d5a5dbd9ab941a5cb53b50a829117fb`.
- Lecture8-handout.pdf: `703f535dab19abf599e61588bb3e19147ff52f32fa2539078b24b4cfee35f6d6`.

## Фиксированный масштаб стрелок на слайде 25, 2026-10-03

Автор заметил изменение длины unconditional score при движении γ. Численный
score оставался прежним, но адаптивный масштаб всех стрелок зависел от γ и
создавал неверное впечатление. Масштаб теперь определяется только наблюдением:
заранее учитывает оба класса и весь диапазон γ = 0…7. Общий масштаб сохраняет
относительные длины и оставляет запас под arrowheads внутри plot. При смене γ
или класса фиолетовая стрелка неподвижна; при перемещении наблюдения scores и
масштаб пересчитываются. Caption и README уточняют эту семантику.

Добавлены численный regression test на сетке разрешённых наблюдений и проверка
точного совпадения SVG endpoints unconditional arrow при γ = 0/1/3/7, A/B.
Source check, **53/53 tests**, build, оба PDF, render QA и **28 браузерных
состояний** прошли; clipping, KaTeX/JS/HTTP errors и внешних запросов нет.
Дополнительно проверены уже изменённые в исходниках slides 36–37 (3 состояния).
В открытой авторской вкладке endpoints при γ = 1 и γ = 7 также совпали точно.

**37 handout pages / 79 reveal states**; все 37 финальных states совпадают с
handout. Слайды 28/34 и остальные страницы вне 25/36/37 попиксельно совпадают
с PDF baseline перед фиксом. Изменения 36/37 (steps 77–79) отражают сохранённую
предшествующую редакцию Guidance Interval и Summary, которой ещё не было в
baseline PDF; источники этих страниц в этой задаче не менялись. Наш render fix
затрагивает handout 25 / steps 48. Общая тема, formulas, Recaps и schedule
не менялись. Источники и тема сверены с изолированной копией перед сохранением
PDF. QA и SHA-256 manifest: `../output/qa/lecture8/guidance-scale-fix-20261003/`.

## Независимые маркеры классов на слайде 25, 2026-10-03

По замечанию автора центры Gaussian components больше не используют цвета
unconditional score / classifier contribution. A обозначен тёмно-синими квадратами,
B — серыми ромбами; оранжевый круг обозначает наблюдение. Легенда подписывает
Class A/B centers, отделяя центры компонент от наблюдения и score-векторов.
Формы различают классы независимо от цвета. README уточняет обозначения.

Source check, build, оба PDF и **28 браузерных состояний** прошли. Live и print
варианты слайда просмотрены крупно: легенда помещается, footer clearance сохранён.
В первом изолированном экспорте (**37 / 79 страниц**) изменены только handout 25 /
steps 48, остальные **36 / 78 страниц** попиксельно совпадают с baseline перед
правкой. Проверка актуальности перед сохранением обнаружила параллельно
добавленный Guidance Distillation и обновлённый Summary; эти исходники сохранены
и включены в повторный экспорт текущей лекции (**38 / 81 страниц**).
После повторного экспорта scoped browser check проверил slides 25/37/38
(4 states), а новые PDF-страницы просмотрены крупно. Все **38 final states**
steps совпадают с handout. После исключения только folio прежние **35 handout
pages / 77 reveal states** вне слайда 25 совпали с baseline; Distillation и
новая редакция Summary проверены отдельно. Источники и общая тема сверены
с изолированной копией перед сохранением обоих PDF.
Численные тесты повторно не запускались для этой правки только отображения.
QA и SHA-256 manifest: `../output/qa/lecture8/guidance-class-markers-20261003/`.

## LaTeX gamma на слайде 34, 2026-10-03

По просьбе автора все текстовые γ в CFG-демо заменены на L8Math / KaTeX:
пресеты, текущий режим, γ = 0/1/>1, пояснение под plot, takeaway и print context.
Математические подписи в SVG и формула уже использовали LaTeX. Для пресетов
заданы доступные aria-labels. CSS сохраняет regime в одну строку; расстояния
между правыми блоками уменьшены на 2 px, чтобы новый math line box сохранял
не менее 10 px до footer. Размеры шрифтов и общая тема не менялись.

Source check, build, оба PDF и **28 визуальных состояний** guidance inspector
прошли; отдельно просмотрены γ = 3/5 и static print. Postexport scoped check
проверил slides 34/37 (5 states). Входящие PDF были **38 / 81 страниц** при уже
обновлённых исходниках **38 / 83 states**: сохранены параллельные Training/Sampling
и раскрытия Guidance Distillation. Финальные PDF: **38 / 83 страниц**; все
38 final states совпадают с handout. В handout изменены только 34 и сохранённая
редакция 37; первые 78 steps отличаются только на page 74 (наш слайд 34).
Остальные 36 handout pages / 77 прежних reveal states совпали с baseline.
Источники и тема сверены перед сохранением PDF. Численные тесты не запускались
повторно для правки типографики. QA и SHA-256 manifest:
`../output/qa/lecture8/cfg-gamma-latex-20261003/`.
