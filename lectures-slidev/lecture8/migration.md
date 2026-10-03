# Lecture 8: migration to Slidev

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
