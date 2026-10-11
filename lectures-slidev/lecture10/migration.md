# Lecture 10 migration

Completed 2026-09-16 as part of the course-wide Beamer-to-Slidev migration.
The source remains in English and uses the approved Lecture 1 theme, geometry,
fonts, notation adapter, annotation tools, and export pipeline.

## Baseline and scope

- Repository baseline: `19e673be350344c8ea4fafffb78fa389d8b65e19`, with the existing
  uncommitted course migrations and shared infrastructure preserved.
- Beamer: `lectures/lecture10/Lecture10.tex`, SHA-256
  `db47ec1ddf01effdb83b61742f3c0b8647c0a47fa60e5413c176f5cac18ddfa8`.
- Matching Beamer PDF: `lectures/lecture10/Lecture10.pdf`, 106 pages, SHA-256
  `58b4a52f20614a8f85b3a6b340badc26890d59e6b9aa233d99fb91561242b765`.
  The coordinator also verified source freshness against `.fdb_latexmk`.
- Beamer, `lectures/merged/`, unrelated existing work, and shared notation/style
  were not edited by this lecture worker. Existing Codex configuration already
  points to the preserved shared course conventions; no duplicate configuration
  migration was needed.

## Content, mapping, and presentation

- All 40 explicit Beamer frames and five automatic section Outlines are mapped.
  The initial explicit Outline is retained. `sourceFrame` and `clicks` agree with
  `slide-map.json` for every slide.
- Result: **46 logical slides / 106 reveal states**. All 93 displayed source
  equations remain editable, including every step in the VE/VP limits,
  probability-flow ODE proof, reverse-SDE proof, and conditional-moment derivation.
- Source frame 24, **Proof of Reverse SDE**, is split into slides 27 and 28 at its
  second pause. Slide 27 contains conversion to the PF-ODE and time reversal;
  `extension: 24` contains conversion back to the SDE. This preserves the three
  source states across two readable slides and keeps the standard font sizes.
  No frames are merged; no new teaching examples or numerical demos were added.
- Both Training blocks and all four Sampling blocks are retained as ordered,
  whole-block reveals. The six-bullet Summary remains static and covers all five
  taught sections. It was not expanded or editorially rewritten.
- Approved terminology: the frame-20 title uses **Deterministic Sampling** in
  place of **Deterministic Generation**, and Summary uses **sampling steps** in
  place of **inference steps**.
- TeX layout commands are replaced by Markdown/HTML spacing; `multline*`/`align*`
  are editable KaTeX `aligned` equations. Unsupported `\mbox` becomes equivalent
  `\text`. Violet uses the existing course `#8854c0`; teal and olive retain their
  semantic roles. Paired delimiters, fractions, integral bounds, and derivatives
  remain intact. Prose spacing commands are not printed as literal TeX.
- Five local PNGs are copied byte-for-byte. The seven image uses plus shared SDE
  taxonomy are retained. All 36 original citation occurrences are represented;
  the proof continuation repeats its source, giving 37 visible source footers.
- Taxonomy uses the coordinator-provided shared `sde-based-diffusion` variant,
  exported from the existing course TikZ. No lecture-specific theme or macros
  were introduced.

## Coherence checks

- Incoming recap: final Slidev Lecture 9 body versus Lecture 10 slides 2–7,
  covering ODE dynamics/Euler, probability path, Picard and reversibility,
  continuity theorem/solution, SDE/Wiener/Euler-Maruyama, and KFP/Langevin.
  The source recap's concise wording and omission of intermediate body steps
  remain; no new formula or assumption drift was found. The Lecture 9 worker
  independently checked the same pair.
- Outgoing recap: final Slidev Lecture 11 recap versus Lecture 10 body.
  VE/VP, PF-ODE, reverse-time signs and score, discrete/continuous DSM,
  NCSN/DDPM transition kernels, Sampling, continuity equation, and FM objective
  agree. Existing condensed wording and different recap block titles remain.
  The coordinator additionally inspected the L10/L11 repeated PDF blocks.
- The five section titles and order match the root README Lecture 10 row.
  The common Slidev artifact catalog is maintained by the migration coordinator;
  its Lecture 10 entry links `slides.md`, both PDFs, and this record.
- Source notation uses the shared 87-macro adapter. No local font-size, font-family,
  zoom, scale, or symbol overrides are present. Math, citations, algorithms,
  Summary, and both Recap directions were checked in Slidev mode.

## Validation and visual evidence

All dev/build/export commands ran in the isolated physical dependency copy at
`/private/tmp/dgm-slidev-l10-20260916/lectures-slidev`, sequentially within that
installation. QA files and synthetic annotation archives remain there, outside
tracked course files.

- `node tools/run.mjs check 10`: passed, 40 source frames, five transitions,
  46 slides, 106 states, 36 source citations, and eight image uses.
- `node tools/sync-notation.mjs --check`: passed via source check.
- An independent strict KaTeX pass (`math-parse.mjs`) parsed all **93 display
  formulas and 158 inline formulas** with the shared macros and `throwOnError`.
  This supplements `inspect.mjs`: Slidev can otherwise emit raw TeX after a
  server-side parse failure without a `.katex-error` element.
- `node tools/run.mjs finalize 10`: passed all **13 existing tests**, production
  build, and both PDF exports. Final page counts are 46 handout / 106 steps.
- `python tools/render-qa.py 10`: passed. Every page of both PDFs was visually
  inspected on 13 contact sheets. Dense pages were additionally read at native
  1280-pixel width: handout 2, 5–7, 10, 12, 16, 18–19, 21–23, 25, 27–32, 34,
  36–39, 42, 44–46. No clipping, overlap, raw TeX, hidden future content in the
  handout, or source-footer collision remains.
- Final prose-spacing cleanup changed only handout pages **21, 23** and steps
  pages **42, 43, 49**. These were re-rendered and reviewed. Pixel comparison of
  the final exports against the first completely reviewed exports confirmed
  all other **147 pages** unchanged. A final whitespace-only diff cleanup was
  followed by another source check, strict math parse, and PDF export; all
  **152 rendered pages** were pixel-identical to the reviewed PDFs afterward.
- Fresh `node tools/inspect.mjs 10` passed all 46 slides / 106 states after the
  supported-math fixes: forward/backward visibility and geometry, meaningful
  clicks, content/footer boundaries, image loading, and no browser errors.
  After the final two prose-spacing edits, their complete state sets were
  rechecked with `QA_SLIDES=21,23`; the other slide bodies were unchanged.
- Fresh-server `extra-checks.mjs` passed **45 neighbor-slide returns**, preserving
  geometry and visibility. On slide 10: mouse ink, Undo/Redo, Save, Save & clear,
  Restore, all reveals, next-slide return, and equality of the saved annotated
  slide before/after return passed. Synthetic ink was cleared after testing.
- The same fresh-server run blocked every non-local network request and completed
  with **zero external requests, HTTP failures, or page errors**. All course
  resources and fonts are local; the headmatter uses a data favicon. This is
  evidence of independence from external Internet resources, while the local
  Slidev server itself remains required for this dev-mode test.

### Equal-scale style comparison

- At 1280×720, actual Lecture 1 browser slide 35 and handout page 35 were compared
  with Lecture 10 slide/page 44: `\bx`, `\btheta`, `\pd`, parameter subscripts,
  operators, headers, block titles, and body text use the same rendered style.
- Actual Lecture 9 browser slides 23/27 were compared with Lecture 10 slides 2/5:
  Euler `\ODESolve`, vector field/dynamics, continuity theorem, trace, integral,
  and Solution block. Actual handout pages L9 27/34 versus L10 5/7 were compared
  at equal 1280-pixel width for continuity and KFP formulas/assumptions.
- Observed computed values: Arial 37px titles, Arial 24px block/body text,
  KaTeX 24.96px, shared navy/teal colors, and loaded local KaTeX fonts.
  The 24px paragraph leading is inherited from Slidev's shared
  `client/styles/layouts-base.css` (`p { @apply my-4 leading-6; }`), not a local
  layout adjustment. The course stylesheet changes paragraph margins only.
- Reference evidence: coordinator's
  `/private/tmp/dgm-slidev-parent-20260916/reference-captures/`, Lecture 9 worker's
  `output/qa/lecture9/`, and this installation's `output/qa/lecture10/` and
  `output/qa/style/`. The final L9 source hash is
  `b81b8b68952d019a102693537fdf4e153da6bbc08c430a3e239dba0fb23f3d36`;
  final L9 handout hash is
  `8658a0f298683db3aac15ff8cd21fe742e18c1eb1274d4bd3ac9b993f09b0324`.

## Preserved source choices and limits

- The source's numerical-solver discussion labels Euler-Maruyama's
  `O(sqrt(Delta t))` as “local error”; the broad performance ranges and the
  adjoint-method characterization are preserved, not editorially revalidated.
- The source's generic Sampling block starts at `N(0,I)` even while the lecture
  also discusses VE-SDEs, and it explicitly omits the variance derivation.
  Those choices remain, including the next lecture's matching recap.
- The PF-ODE sampling block is titled “Euler / Heun / RK4” but displays an Euler
  update, as in Beamer. No unrequested solver derivations were inserted.
- Real stylus hardware, palm rejection, projector behavior, tablet-to-screen
  networking, and multi-device presenter/viewer synchronization remain untested.
  Browser mouse tests do not establish those device capabilities.

## Final artifact checksums (SHA-256)

| Artifact | SHA-256 |
|---|---|
| `slides.md` | `c9a725dc8bf19f71cbb0b094d7ddbf2fe341b46ddbeeeff60dacbb2647af2d94` |
| `slide-map.json` | `34e48739c96fc140d135b3ebd296f284fab146f05e97afcc1380d4ed6009c06e` |
| `Lecture10.pdf` | `126d7b35008873ac686502d644bc0383a4aa33ededd8fa3a3342725fb4738775` |
| `Lecture10-handout.pdf` | `a83e6060759a4ecf1024b940c837757fbd65f27ed80757245ef3ace822dbb2a4` |
| `public/figs/cnf_flow.png` | `2485f9b7208f4834e0fd62f1bf6af7cf72fb606fd94887e5e20901bd022f0137` |
| `public/figs/multiple_dynamics.png` | `cf63396c1146971187b75ae025bc4215b036e0c0e85b934b16f86c6343faa4a4` |
| `public/figs/probability_flow.png` | `1870e962ba3ca79c400a47af581a4e9a0692878653e7f23eca4bf4e9f535c8ad` |
| `public/figs/sbgm.png` | `93f1b1311c5997697bce847a36beaa763617af91c98defc448339260be26e1b8` |
| `public/figs/sde.png` | `41136d85412315b79a7520c9289ba1963700c630e67745923a16067c1f1b91eb` |

## Final course integration — 2026-09-17

The final catalog integration is complete: the Slidev README links the editable source, both reviewed PDFs and this journal for all Lectures 1–14; the root README now points to the full catalog. The existing Materials hierarchy and schedule comment wrapper were preserved. Final main-workspace checks passed for the source/map/assets, all 251 strict KaTeX expressions, PDF page counts and the artifact hashes recorded above. The final Lecture 11 recap retains the corrected source `\frac12` documented in its journal. This documentation-only integration did not change the reviewed lecture source or PDF bytes.

## Равномерные интервалы Summary, 2026-10-03

По запросу автора общий `class: summary` использует вертикальный flex-список с `justify-content: space-between`, аналог `\vfill` между пунктами. Размер шрифта и содержание сохранены; в L4 удалены локальные margin. Проверены Summary всех 14 лекций в браузере и обоих PDF: одинаковые промежутки, отсутствие переполнений, совпадение handout и финального состояния. Для этой лекции: **46 слайдов / 106 состояний**; source check, web build и оба экспорта прошли с Node 24.19.0 в изолированной копии. Все тексты PDF сохранены, остальные страницы попиксельно совпадают с контрольной версией. Это проверка оформления Summary; полный содержательный аудит не повторялся. QA: `../output/qa/summary-spacing-2026-10-03/`.


## Course refresh: CNF training → Flow Matching, 2026-10-03

На слайдах **42–43** исправлено назначение adjoint: это вычисление градиентов через решение ODE, а не прямое решение continuity equation. Удалена безусловная характеристика «unstable and unscalable». Пояснено, что FM обучает velocity регрессией без model ODE solves / trace. Соответствующий пункт Summary (46) обновлён без изменения числа пунктов. Source map и reveals сохранены. Итог: **46 слайдов / 106 состояний**.

`finalize` в изолированной копии прошёл: 60 тестов, source/map checks, strict math parsing, web build и оба PDF. Все изменённые страницы и состояния просмотрены; browser inspector проверил целевые слайды, reveals и отсутствие overflow/math/resource errors. Отдельно проверен возврат с соседнего слайда к финальному состоянию. Новый слайд L9 визуально сопоставлен с утверждённым стилем L1; shared theme не менялся.

Из 152 страниц двух PDF 144 совпадают попиксельно; восемь изменённых страниц относятся только к слайдам 42–43 и Summary.

Проверены затронутые зависимости: формулы L9 и incoming Recap L10 сохранены; новое объяснение обучения раскрыто в body L10, body L10 42–43 и Recap L11 9–10 согласованы. Body L11 и outgoing Recap L12 не затронуты. Section hierarchy / расписание не менялись; каталог и source maps согласованы. Это проверка текущей правки, не новый полный аудит лекций. Beamer и `lectures/merged/` не менялись.

QA: `../output/qa/cnf-training-2026-10-03/`. Перед публикацией проверено побайтовое совпадение slides/map/components/lib/public и shared theme с экспортированной копией. Актуальные SHA-256:

- `slides.md`: `abc06a43e1f5dd369172052fdd68495ec28ea0cab1d036f4bd4b457b78dc907f`.
- `slide-map.json`: `34e48739c96fc140d135b3ebd296f284fab146f05e97afcc1380d4ed6009c06e`.
- `Lecture10.pdf`: `5a6303b970131b738eb49d57c7028211f723302976e1a60fc4152a25774e51be`.
- `Lecture10-handout.pdf`: `da06644cfdf0b8e16c7cf3a6c64f43480aa0c17cd898cd9bb84a98def5547f6f`.

## Course refresh: exact identity vs numerical likelihood, 2026-10-03

По согласованию автора на слайде **22** заголовок блока заменён на “Log-likelihood via the probability-flow ODE”. Под сохранённой формулой добавлено: “Exact change-of-variables identity; numerical evaluation uses an ODE solver and, optionally, Hutchinson's trace estimator.” Добавлена ссылка FFJORD. Формулировка в Summary **46** согласована: “log-likelihood evaluation” вместо неоговорённых “exact log-likelihoods”. Структура, формулы, два раскрытия, source map и общий стиль сохранены: **46 слайдов / 106 состояний**.

Проверки перед коммитом: `finalize 10` — 59 тестов, source/map/macros, web build, оба PDF; `render-qa.py 10` — 46/106 страниц. В изолированной копии использованы локальные зависимости: первоначальный экспорт со ссылкой на внешние node_modules отклонён из-за недоступных математических шрифтов. Финальный экспорт полностью проверен попиксельно относительно предыдущей просмотренной версии: 146 страниц совпадают; изменены только handout 22/46 и steps 44/45/46/106. Все новые состояния просмотрены крупно, handout совпадает с последним reveal. Browser inspector: слайды 22/42/43/46, 10 состояний, стабильная геометрия и обратные шаги, нет overflow, math/resource errors. Проверен возврат с соседнего слайда для 22/42/43. Общая тема не изменена; неизменённые формулы и их шрифты совпадают с предыдущим проверенным экспортом.

Содержательная проверка охватила L9 body → L10 Recap, L10 body → L11 Recap, Summary L10/L11 (6/5 пунктов), повторные формулы и Training/Sampling, Outline/README и source maps. L10 42–43 и L11 9–10 дословно согласованы в пояснениях CNF/adjoint/FM; уточнение likelihood согласуется с L9 27. Body L11 → Recap L12 не затронут; ранее записанные проверки L11 переиспользованы после проверки хешей исходника, карты и обоих PDF. Незавершённая DDIM-редакция L8 и её README-нумерация рассмотрены как контекст diff, но исключены из этого коммита; её разделы и Recap L9 не требуют изменений из-за текущей правки. Source checks L8/L9/L11/L12 прошли. Beamer и `lectures/merged/` не менялись.

QA: `../output/qa/likelihood-2026-10-03/`. Перед публикацией проверено побайтовое соответствие исходника, карты, assets, зависимостей package/lock и shared theme экспортированной копии. Актуальные SHA-256:

- `slides.md`: `31c732f4278e6757f10864fce36e1c1011170f377391594f786f36474e9648bb`.
- `slide-map.json`: `34e48739c96fc140d135b3ebd296f284fab146f05e97afcc1380d4ed6009c06e`.
- `Lecture10.pdf`: `42776e5f560883a2095bc2eb9422b21c3ccf057c5b92d40faefdba0e0740110f`.
- `Lecture10-handout.pdf`: `563c2535b79ce7bffc3e8a83ec30935bac53d560354b43eff979b8f69d449dc2`.


## Course refresh: полное доказательство среднего на одном слайде, 2026-10-04

По согласованию автора на слайде **37** (`sourceFrame: 32`) собраны все шаги доказательства уравнения среднего. Оба уравнения моментов сохранены и размещены в одной строке; размер шрифта, общая тема и обозначения не менялись. Вместе с Proof появляется оговорка: “We prove the mean equation only; the variance equation is stated without proof.” На **38** (`sourceFrame: 33`) остались уравнение среднего и примеры NCSN/VE, DDPM/VP без повторного доказательства. Со слайда **39** перенесена только оговорка; Training и обе формулы conditional kernels сохранены.

Карта обновлена: 37 — четыре клика, 38 — два, 39 — прежние два; итог **46 слайдов / 104 состояния**. Первый пункт L10 в course-refresh закрыт в согласованном объёме; исходная рекомендация ошибочно считала оговорку отдельным фреймом. Оценка экономии трёх минут снята, тайминг не измерялся.

Проверки в изолированной копии с Node 24.19.0: `finalize 10` — source/map/macros, 59 тестов, web build и оба PDF; `render-qa.py 10` — 46/104 страницы. Все состояния изменённых слайдов просмотрены, финальные страницы — крупно. Попиксельное сравнение всего экспорта: 43 handout + 95 steps страниц совпадают с предыдущими проверенными PDF; отличия только на слайдах 37–39. Раздатка сохраняет весь вывод. Общая тема не менялась; проверка стиля переиспользует предыдущую проверенную редакцию, неизменённые страницы совпадают пиксельно.

Browser inspector: 11 состояний слайдов 37–39, стабильная геометрия, непустые раскрытия, обратные шаги, отсутствие overflow/math/resource errors внутри слайдов. Отдельно проверен возврат с соседнего слайда: финальные состояния 37–39 совпадают попиксельно. В dev-снимках Yandex остаются видимые подписи штатной панели Slidev поверх страницы; тот же эффект подтверждён в QA предыдущей редакции (`/private/tmp/dgm-l10-likelihood-20261003/.../slide-22.png`), текущая правка его не вводит. В обоих PDF эти подписи отсутствуют. Общий UI не менялся в рамках этой редакторской задачи.

Проверка затронутых зависимостей: весь исходник вне 37–39 совпадает с базовой редакцией. Incoming Recap L10, Summary (6 пунктов), разделы/Outline и README не требуют изменения. Условные распределения на 39 согласованы с Recap L11; доказательство среднего там не повторяется. Training/Sampling сохранены. Beamer и `lectures/merged/` не менялись. Это проверка текущего diff, не полный повторный аудит лекции.

QA: `../output/qa/moments-2026-10-04/`. Источник, карта и package/lock побайтово сверены с экспортированной копией перед переносом PDF. SHA-256:

- `slides.md`: `ca34643b4464304b760adb46b88e93dbd1479f802f9930d86d109bbadf6e3400`.
- `slide-map.json`: `56f048c42da229d5ab663d9351a29ea3884dd57c1d3769ec5bc422cf6133393a`.
- `Lecture10.pdf`: `89a1b965d64418d54bc1f492feca4dba99b78b1fbbe3f144da9a6eec8793d4dd`.
- `Lecture10-handout.pdf`: `67d1eebc8d31ea07d5911875340f764276aa113b6fb7500e6d75caba92174bd2`.


## Course refresh: VE/VP на одном сравнительном слайде, 2026-10-04

По согласованию автора прежние слайды **31–32** объединены в **31 “VE and VP: Probability Flow and Reverse SDE”**. Две колонки VE/NCSN и VP/DDPM используют общую `.columns` без изменения шрифтов или темы. Forward SDE и условия (рост σ(t), сохранение единичной начальной дисперсии) видны сразу; первый клик раскрывает обе PF-ODE, второй — обе reverse SDE и пояснение `dt<0` / reverse-time Wiener process. Score сокращён до `\bs` с явным определением вверху. Повторное выделение f/g и дискретная запись VE-шагов удалены в рамках согласованного уплотнения; все шесть SDE/ODE эквивалентны прежним формулам. Источник Song сохранён.

Provenance: `sourceFrame: "27"`, `mergedSourceFrames: [28]`; карта содержит `frame: 27`, `mergedFrames: [28]`, два клика. Все 40 исходных frames покрыты. Итог **45 слайдов / 101 состояние**. Последующие слайды сдвинулись на один: доказательство среднего теперь 36, примеры 37, Training 38, Summary 45. Course-refresh report обновлён; прежняя оценка −3 мин снята, тайминг не измерялся.

Проверки в изолированной копии с Node 24.19.0: `finalize 10` — source/map/macros, 59 тестов, web build и оба PDF; `render-qa.py 10` — 45/101 страница. Просмотрены все три состояния нового слайда и страница раздатки; нет обрезки, наложений или потери формул. При сравнении всех страниц по frame/click с предыдущим экспортом **44 handout + 98 steps** совпали попиксельно после исключения только области номера слайда (число слайдов изменилось с 46 на 45). Общая тема и размеры не менялись; применяется ранее проверенный стиль L1.

Browser inspector: три состояния, стабильная геометрия, непустые раскрытия, обратные шаги, нет overflow/math/resource errors в содержимом. Финальное состояние после возврата с соседнего слайда проверено попиксельно. Прежние подписи штатной панели в dev-снимках Yandex остаются известной особенностью, описанной выше; в PDF их нет.

Содержательная проверка: VE использует f=0 и g²=dσ²/dt; VP — f=−βx/2 и g²=β. Подстановка в общие PF-ODE / reverse SDE даёт соответственно коэффициенты −g²/2 и −g² перед score; знаки шума и временная конвенция сохранены. Forward-формулы и условия совпадают с ранним VE/VP-блоком L10 и Recap L11. Весь исходник вне двух объединённых слайдов побайтово сохранён относительно состояния после предыдущего пункта: доказательства, incoming Recap, Training/Sampling, Summary (6 пунктов), разделы/Outline и README не требуют редакции. Каталог с прежними путями актуален; карта обновлена. Beamer и `lectures/merged/` не менялись. Это проверка текущей правки, не повторный полный аудит.

QA: `../output/qa/ve-vp-2026-10-04/`. Источник, карта, package/lock, общая тема, компоненты, lib и локальные assets сверены с экспортированной копией перед переносом PDF. SHA-256:

- `slides.md`: `0074c4c3e24ba414d58366b3616437796659a17f72c729e19059b21807aa6ec7`.
- `slide-map.json`: `c38b951d8c06364d2cb79c98bb279d20e6396d0d5c838bc4f483d5daef2331be`.
- `Lecture10.pdf`: `1a0fbc1f583590cc0cf7877668e4e8d8af3306d363d50841322cd6586503c8e9`.
- `Lecture10-handout.pdf`: `541da795092756cf9087c24336e7d672de11bb77874e79dc418e81c1f4cd87f8`.


## Course refresh: первоисточник теоремы reverse SDE, 2026-10-04

По согласованию автора ссылка [Anderson B. D. O. Reverse-time diffusion equation models, 1982](https://doi.org/10.1016/0304-4149(82)90051-5) добавлена к формулировкам теоремы reverse SDE: **L10 25/26/29 ↔ L11 Recap 4**. Song сохранён второй строкой источников. Anderson относится к теореме обращения SDE; блок PF-ODE сохраняет прежнюю ссылку Song. Содержание доказательств и все раскрытия оставлены прежними.

Проверка исходников относительно предыдущей просмотренной редакции: после исключения source-footers оба `slides.md` совпадают побайтово, карты также неизменны. Поэтому нотация, Training/Sampling, Summary (L10 6 / L11 5 пунктов), incoming Recap L10, body L11 → Recap L12, Outline/README и каталог не затронуты. Ссылки в L10 body и L11 Recap согласованы. Beamer и `lectures/merged/` не менялись. Это узкая проверка библиографической правки.

В изолированной копии с Node 24.19.0 последовательно выполнены `finalize 10` и `finalize 11`: source/map/macros, по 59 тестов, web builds и четыре PDF. `render-qa.py`: L10 **45 слайдов / 101 состояние**, L11 **36 / 80**. Попиксельное сравнение всех 262 страниц: **248 полностью совпадают**, 14 изменены исключительно в нижней области источников (12 L10 + 2 L11). Все изменённые состояния просмотрены; финальные страницы — крупно. Сноски читаемы и не пересекают материал, ссылки DOI и arXiv активны в обеих раздатках. Общая тема и геометрия сохранены; повторная типографическая проверка опирается на предыдущую просмотренную редакцию и неизменность всех пикселей содержимого.

Browser inspector: L10 25/26/29 — 9 состояний, L11 4 — одно; без переполнений, пустых кликов, сдвигов, math/resource errors. Обратные шаги проверены; отдельный возврат с соседнего слайда к финальным состояниям L10 совпадает попиксельно. Известные подписи штатной панели в dev-снимках Yandex остаются прежними и отсутствуют в PDF; shared UI не менялся.

Course-refresh пункт закрыт. QA: `../output/qa/anderson-2026-10-04/`. Исходники, карты, shared theme/components/lib, локальные assets и package/lock сверены с экспортированной копией перед переносом PDF. Актуальные SHA-256:

- `slides.md`: `69d7d910ac7a1de863395b589230ea7442a07682049e347e1aaf52645f2c4969`.
- `slide-map.json`: `c38b951d8c06364d2cb79c98bb279d20e6396d0d5c838bc4f483d5daef2331be`.
- `Lecture10.pdf`: `737577c417fa58e4e25e037d2300743f3e59c90da7eb6a1dd7ab62ebe5e85bdd`.
- `Lecture10-handout.pdf`: `5925eb93ff6cc394dd11f9748e41a4c7666183f719385addd45b0787e550a6b1`.


## Course refresh: краткий обзор сэмплеров с опорой на L9, 2026-10-04

По запросу автора сохранён компромисс ширины и глубины: **один слайд 21** (`sourceFrame: 19`) вместо прежнего общего сравнения затрат. Он начинает с ODE-солверов L9 и знакомой формулы обученного PF-ODE поля. Сразу виден Euler/Heun (1/2 вычисления поля за шаг; EDM использует Heun); первый клик открывает идеи DPM-Solver / DPM-Solver++ и UniPC; второй — напоминание NFE и краткое замечание о стохастичности. Для DPM-Solver объяснено использование известной линейной части VE/VP и связь ++ с guidance из L8; UniPC описан как коррекция ODE-шага с переиспользованием предсказаний. Выводы новых солверов не добавлялись.

Результат 10–20 NFE атрибутирован DPM-Solver и ограничен зависимостью от модели. Общего обещания «100–1000 SDE → 20–50 ODE steps» нет. Добавление шума может помогать, но не каждой модели — это соответствует различным результатам EDM, без безусловного вывода по одному лишь NFE. Полные ссылки Karras/Lu/Lu/Zhao стоят в источниках. В speaker notes оставлены пояснения: фиксированная score-сеть, data-prediction форма ++, отличие UniPC от стохастического Langevin-корректора, отдельные экспериментальные результаты и отложенная EDM-параметризация.

На **23** (`sourceFrame: 21`) исправлено пояснение: одна score-сеть задаёт две sampling dynamics; ODE-блок называется `Sampling (PF-ODE, Euler)`, согласно приведённой формуле. Убрано безусловное K ≪ K_SDE. Формулы обоих алгоритмов и их whole-block reveals сохранены. В **Summary 45** заменён только тезис о гарантированном диапазоне шагов: эффективные ODE-солверы, использование структуры diffusion ODE, сравнение стоимости по NFE. Все шесть тезисов сохраняют охват пяти разделов.

Карта, число слайдов и кликов прежние: **45 слайдов / 101 состояние**. Source-сравнение с предыдущей просмотренной редакцией подтверждает изменения только 21/23/45. Incoming Recap L10 не затронут. Связь с L9 Euler/Heun и NFE согласована; общий Sampling в Recap L11 не повторяет конкретный Euler-блок и не требует правки. Обзор новых солверов в Recap L11 не добавлялся; формулы и алгоритмы его body не изменились. Разделы/Outline, README и каталог сохранены. Beamer и `lectures/merged/` не менялись.

В изолированной копии с Node 24.19.0: `finalize 10` — source/map/macros, 59 тестов, web build и оба PDF; `render-qa.py` — 45/101 страницы. Все 7 состояний изменённых слайдов просмотрены; 21/23/45 в раздатке — крупно. Сравнение всего экспорта: **136 страниц совпадают попиксельно**, 10 изменились только на 21/23/45. Shared theme, шрифты и размеры не менялись; таблица использует стандартные стили и ширину первого столбца 24%. Предыдущая проверка стиля L1 переиспользована с подтверждённой неизменностью остальных страниц.

Browser QA: 7 состояний 21/23/45, стабильная геометрия, непустые раскрытия, обратные шаги, отсутствие переполнений/math/resource errors; отдельный возврат на финальные состояния 21/23 проверен попиксельно. Стандартный `inspect.mjs` не отслеживает видимость tr/td и ложно считает табличный клик пустым; проверка выполнена временной копией инспектора с добавленными tr/th/td в выборку. Репозиторный инструмент не менялся. Известные подписи штатной панели в dev-снимках Yandex не относятся к текущей правке; PDF чистые.

Course-refresh пункт закрыт в согласованном кратком объёме. EDM-параметризация и DDIM↔PF-ODE остаются отдельными задачами. Тайминг не измерялся. QA: `../output/qa/samplers-2026-10-04/`. Перед переносом PDF сверены source/map, package/lock, theme/components/lib и assets экспортированной копии. SHA-256:

- `slides.md`: `a5d9f4308075bc9f185ddfa3ed4738fad73ae5d7e3f6c93f609f6ebb05f146e1`.
- `slide-map.json`: `c38b951d8c06364d2cb79c98bb279d20e6396d0d5c838bc4f483d5daef2331be`.
- `Lecture10.pdf`: `50dcfbe00ff2f613769bdaede5ca19a6336c5453fc3f1d2d73e4263f8eee4712`.
- `Lecture10-handout.pdf`: `b23d6866ea67d889cac5f9dd8b8009218ffa147cc81681b8e2148af8c0d672a5`.

## Course refresh: EDM-параметризация для просмотра, 2026-10-11

По запросу автора добавлен **слайд 24 “EDM: Denoiser Parameterization”** после прежнего 23 Sampling: Reverse SDE vs PF-ODE. Это версия для критики, не окончательно принятый пункт рефреша. Основа — рабочая редакция после sampler overview, SHA-256 `a5d9f4308075bc9f185ddfa3ed4738fad73ae5d7e3f6c93f609f6ebb05f146e1`; существующие незакоммиченные правки L10/L11 сохранены.

Gaussian perturbation и conditional-mean denoiser видны сразу; первый клик раскрывает Tweedie и PF-ODE с σ как временем, второй — preconditioning сети. Основные коэффициенты названы и объяснены на слайде, конкретные выражения EDM оставлены в speaker notes вместе с выводом PF-ODE, оговоркой о σ>0 и отличием от consistency model L14. Источник — Karras et al. (2022), формулы сверены с авторскими `NVlabs/edm/training/networks.py` (EDMPrecond) и `generate.py`. Provenance: `extension: 21`, два клика; карта перенумерована. Итог **46 слайдов / 104 состояния**. В Summary 46 заменён один из шести тезисов; заметка слайда 21 теперь указывает на введённую параметризацию.

Scoped notation/Summary/Recap checks: макросы, параметры сети, формулы и источник соответствуют общей нотации; общий score→PF-ODE согласован с L10 и Recap L11. Входящий Recap L10, Training/Sampling и остальные повторённые формулы не изменены относительно базовой рабочей редакции. Новый EDM-denoiser не повторяется в Recap L11, обязательного расширения Recap нет. Существующий L14 slide 13 задаёт consistency boundary при ε; его коэффициенты не отождествлены с EDM без модификации, L14 не редактировалась. Разделы/Outline, README schedule и каталог не менялись. Beamer, shared theme/macros/components и merged не затронуты.

QA выполнен в изолированной копии на Node 24.19.0. `finalize 10`: source/map/macros, 59 тестов и web build прошли; sandbox не разрешил localhost-порт для export, поэтому тот же штатный этап `export 10` выполнен с разрешённым браузерным запуском. Оба PDF успешно экспортированы; `render-qa.py 10` подтвердил 46/104 страницы. Все страницы сопоставлены с ранее просмотренными PDF: **44 handout + 100 steps** совпадают попиксельно за исключением области нумерации; новые три состояния и Summary просмотрены отдельно, новый слайд и Summary раздатки — крупно. Обрезок, наложений, потери формул нет. Единые шрифты/геометрия сохранены; визуально сопоставлен эталон Lecture 1, остальная проверка стиля переиспользует прежнюю редакцию и неизменность shared files.

Browser inspector проверил 24 (3 состояния) и 46 (1 состояние): стабильная геометрия, содержательные клики, обратные шаги, нет content overflow, math/resource errors. Возврат с 25 к финальному состоянию 24 совпадает попиксельно. Известное наложение подписей штатной панели Slidev в dev-браузере сохраняется, в PDF отсутствует; shared UI не менялся. QA: `../output/qa/edm-2026-10-11/`. Source/map, package/lock, theme/components/lib и assets экспортированной копии сверены перед переносом PDF.

SHA-256:

- `slides.md`: `86bd4185857da932a4a9db0d2273807b979f26bd93bf3c065ff3ab9d33bd8a2e`.
- `slide-map.json`: `b0d18adde385a0d708890a6c2c863fc1d64359e3c3d6ad23fc0097fccd194394`.
- `Lecture10.pdf`: `b59bba8011462bb453d0ba7c27aaa048173224a2001b541bca15bd06ff1b32cd`.
- `Lecture10-handout.pdf`: `6880b5e51f7ae18e7cfedac68b8ad63c2293ccc7a615261e8604ef52220a6617`.

## Course refresh: связное изложение EDM, 2026-10-11

Эта редакция заменяет первый вариант EDM на слайде 24. Автор указал на отсутствие логики переходов и согласовал перенос между Training и Sampling и разделение на два слайда. Три общих требования к новым слайдам (входящая связь, исходящая связь, последовательность аргумента внутри слайда) закреплены в `CLAUDE.md` §3 и `MIGRATION.md` §1.

Текущая цепочка: **38 Training → 39 From Denoiser to PF-ODE → 40 EDM: Preconditioning the Denoiser → 41 Sampling**. Оба новых слайда имеют `sourceFrame: "extension: 34"`, по два клика; итог **47 слайдов / 107 состояний**. Старое размещение перед Reverse SDE удалено. Все прежние содержательные слайды, включая Summary из предыдущей EDM-редакции, сохранены; изменена лишь заметка слайда 21 о месте введения denoiser. Материал остаётся для просмотра автора, пункт рефреша открыт.

Три связи проверены отдельно:

- Слайд 39 принимает задачу оценки score из Training. Сначала специализирует Gaussian perturbation до аддитивного шума, затем напоминает Tweedie, затем подставляет denoiser в PF-ODE с σ как координатой. Определив роль denoiser, подготавливает вопрос о его параметризации на 40.
- Слайд 40 начинает с необходимости обрабатывать разные масштабы шума, вводит нормировку входа и residual-выхода, поясняет low-noise предел. Заключение возвращает denoiser в score, используемый в следующем Sampling.
- Общая схема Training/Sampling не переписана под полный рецепт EDM. Speaker notes различают исходное uniform-time score objective и noise-weighted denoising loss EDM, фиксируют 1/σ⁴ при прямой подстановке в исходный score loss, переход к σ>0 и масштаб terminal noise в координатах EDM. Коэффициенты/EDM loss сверены с `NVlabs/edm` (networks.py, generate.py, loss.py). Отличие от consistency endpoint model L14 сохранено.

Проверки: source/map/macros, 59 тестов и web build в `finalize 10`; после исправления лишнего знака, замеченного при просмотре первой сборки, повторены check, build, оба export и визуальный QA. `render-qa.py`: 47/107 страниц. Все шесть новых состояний и обе страницы раздатки просмотрены. Сравнение всех PDF со снимком предыдущего варианта: **45 handout + 101 steps** совпадают попиксельно, кроме области номера; удалён старый EDM-слайд, добавлены только два новых. Общая тема и размеры шрифтов прежние, применяется проверенный стиль L1. Browser inspector: вся цепочка 38–41 проверена, новые 39/40 повторно проверены после исправления — стабильная геометрия и обратные шаги, непустые клики, без content overflow/math/resource errors. Возврат с соседнего слайда к финальному состоянию каждого из 39/40 совпадает попиксельно. Прежние dev-подписи штатной панели остаются известной особенностью и отсутствуют в PDF.

Scoped notation/Recap/Summary checks: новые формулы используют общие макросы и согласованы с общей PF-ODE и Tweedie; incoming Recap, повторяемые в L11 формулы и Training/Sampling не изменены. Summary остаётся шестипунктным и покрывает EDM. Исходники всех прежних блоков побайтово совпадают с предыдущей редакцией, кроме speaker notes frame 19. Разделы, Outline, README schedule и каталог сохраняются. L11/L14, Beamer и merged не редактировались. Перед переносом PDF сверены source/map, package/lock, theme/components/lib и assets изолированной копии. QA: `../output/qa/edm-revised-2026-10-11/`.

SHA-256:

- `slides.md`: `0d2a6475dfb78547deb35138ea99585cfd45419015664a195804dd75fa7a7201`.
- `slide-map.json`: `e803b4c0718d0a1508775adecf49f84b00c2824f2ec82a68ec84217df16ae8e1`.
- `Lecture10.pdf`: `6578e10bb28eaaf945b913a503de25a79f17a4379ee13c17eea82c220d21aa0a`.
- `Lecture10-handout.pdf`: `7fc7b2d20fa34bc81bfe62d8bf3b993100e63e2af854e43850c181fc4a1d5cf2`.


## Course refresh: явная цепочка обучения и сэмплирования на 39, 2026-10-11

По запросу автора слайд **39 From Denoiser to PF-ODE** переписан в три последовательных блока: denoising loss с весом 1/σ⁴ для сохранения предыдущего score-matching objective и распределения уровней шума; полная формула Tweedie с conditional mean и переводом D_theta в score; исходная PF-ODE, подстановка f=0, g²=dσ²/dt=2σσ̇ и chain rule для перехода к dx/dσ. Завершение — интегрирование от большого шума к малому Euler/Heun. Это эквивалентная параметризация обучения/поля для выбранного аддитивного Gaussian path, а не новый принцип генерации. Отличие от полного weighting/sampling recipe EDM явно оставлено в заметках. Слайд 40 отвечает на следующий вопрос о параметризации самой denoiser-сети.

Изменён только слайд 39 и его заметки. Два клика, карта, Summary (6 пунктов), соседние Training/Preconditioning/Sampling, Recap L10/L11, разделы и README сохраняются. Проверены нотация, связь с исходным DSM loss и PF-ODE: условный score target равен -(x-x0)/σ², подстановка даёт denoising loss/σ⁴; chain rule применяется при положительной производной schedule и σ>0, что оговорено в notes. Исходники остальных слайдов не изменены. Существующие незакоммиченные правки сохранены; Beamer/L11/L14/merged не редактировались.

Node 24.19.0, `finalize 10`: source/map/macros, 59 tests, web build, оба PDF. `render-qa.py`: **47/107** страниц. Все три состояния и handout 39 просмотрены крупно, без переполнений и изменения шрифта. При сравнении всех страниц с предыдущей просмотренной редакцией изменены только handout 39 и steps 87–89; остальные **46 + 104** совпадают попиксельно (область folio исключена из сравнения). Общий стиль не менялся, предыдущие проверки L1 применимы. Browser inspector: три состояния 39, стабильная геометрия, содержательные клики, обратные шаги, без content overflow/math/resource errors; возвраты на финальные состояния 39/40 попиксельно совпадают. Известные dev-подписи панели отсутствуют в PDF. Source/map и shared экспортные входы сверены перед переносом. QA: `../output/qa/edm-slide39-2026-10-11/`. Пункт рефреша остаётся для просмотра автора.

SHA-256:

- `slides.md`: `1a6ac8d27bc28b2d5781474352d85f45b9e517aaff13fa7364b83c9d77d85a3c`.
- `slide-map.json`: `e803b4c0718d0a1508775adecf49f84b00c2824f2ec82a68ec84217df16ae8e1`.
- `Lecture10.pdf`: `e5715734042147b1d2ba727af461301cc1e20a258d9c6f86fe2ffb097d72d3b0`.
- `Lecture10-handout.pdf`: `bd125466201e362747a498aca61719eaa414fed23b323d6cc2c001cf18254cb8`.


## Course refresh: вывод denoising loss из предыдущего слайда, 2026-10-11

По запросу автора изменён только **слайд 39** и его notes. Порядок: (1) Gaussian conditional, полная Tweedie identity и параметризация score через D_theta; (2) исходный loss одной пары слайда 38, conditional Gaussian score, явная подстановка и сокращение x до ||D_theta−x0||²/σ⁴; (3) прежняя подстановка в PF-ODE и смена временной координаты. Убраны новое обозначение L_D и ожидание по обучающим парам. Сохранён символ L из предыдущего Training. Вес 1/σ⁴ теперь получен алгебраически, а не введён готовым. Два клика сохранены. Следующий вопрос о параметризации D_theta раскрывается на неизменённом слайде 40.

Source diff: все остальные слайды, Summary (6 пунктов), Training/Sampling, incoming/outgoing Recap-интерфейсы и карта побайтово сохранены. Scoped notation/math check: conditional score −(x−x0)/σ², знак при подстановке и σ⁴ проверены; начальная формула Tweedie относится к marginal p_sigma, training target — к conditional q. Notes сохраняют различие exact identity / learned approximation и weighting исходного DSM / полный EDM recipe. Разделы, Outline/README/catalog не затронуты. Beamer, L11/L14, shared style и merged не менялись.

`finalize 10` на Node 24.19.0: source/map/macros, 59 tests, web build и оба PDF. `render-qa.py`: **47/107** страниц. Все три состояния 39 и handout просмотрены крупно, переполнений нет, размер шрифта сохранён. Сравнение всех страниц с предыдущим проверенным экспортом: изменены только handout 39 и steps 87–89; **46 handout + 104 steps** совпадают попиксельно вне folio. Стиль L1 и его предыдущие проверки применимы: shared inputs не менялись. Browser inspector: все три состояния, непустые клики, стабильная геометрия и обратные шаги, без content overflow/math/resource errors. Финальные состояния 39/40 после возврата с соседнего слайда совпадают попиксельно. Прежние dev-подписи панели отсутствуют в PDF. Source/map/shared inputs и assets сверены перед переносом. QA: `../output/qa/edm-loss-chain-2026-10-11/`. Пункт рефреша ждёт просмотра автора.

SHA-256:

- `slides.md`: `950d4a1c04994d442875b314c7defac0f0baadd2e774f9b6e7982c37a8d7b832`.
- `slide-map.json`: `e803b4c0718d0a1508775adecf49f84b00c2824f2ec82a68ec84217df16ae8e1`.
- `Lecture10.pdf`: `33e05dc996cc504439d711a94706f2cd3e2e01f3f063b34b6e49d87b7bfb5c86`.
- `Lecture10-handout.pdf`: `45065ca751335ba5cb4a95a070c31e12852ff6a5e5de830eec37ec57b893d25e`.


## Course refresh: отдельные слайды denoiser Training и Sampling, 2026-10-11

Автор попросил разделить плотный слайд 39 на два, добавить основные тезисы и не сокращать формулы. Теперь **39 Denoiser Parameterization: Training** содержит Gaussian conditional, полную формулу Tweedie, conditional-mean prediction и score conversion; первый клик — исходный per-pair DSM loss и conditional Gaussian score, второй — полная подстановка и отдельная строка результата. Итоговый тезис: “Same training objective, different prediction target”; вес 1/σ⁴ следует из замены, распределение уровней шума сохраняется.

**40 Denoiser Parameterization: Sampling** начинает с роли обученного denoiser и коэффициентов additive Gaussian path. Первый клик показывает общую PF-ODE и подстановку с сохранёнными аргументами f(x(t),t), g(t), s_theta(x(t),sigma(t)); второй — chain rule и поле через denoiser. Производные расписаны как dσ(t)/dt, без сокращения до σ̇. Итог: “The denoiser defines the field; the solver takes the steps”, далее high-to-low noise и Euler/Heun. Существующий preconditioning сдвинулся на **41**, общий Sampling — на **42**. На 39 и 40 по два клика, provenance `extension: 34`; **48 слайдов / 110 состояний**.

Три narrative-проверки: 39 принимает задачу оценки score из Training 38, выводит способ обучить denoiser и подготавливает его использование; 40 принимает обученный denoiser, выводит сэмплирование, подготавливает вопрос об устройстве сети для разных шумов на 41. Внутри каждого слайда постановка предшествует формулам и заканчивается явным выводом. Все формулы сохранены с аргументами и промежуточными равенствами, Euclidean norm явно обозначена индексом 2.

Scoped content/notation/Recap/Summary: различены conditional training target и marginal score; точная Tweedie identity и learned approximation, исходный σ^-4 weight и полный EDM recipe. Chain rule предполагает положительную производную schedule и σ>0 (notes). Все исходники до прежнего 39 и от preconditioning до конца побайтово сохранены. Summary (6 пунктов), Training/Sampling algorithms, Recap L10/L11, разделы и README/catalog изменений не требуют. Карта перенумерована. Beamer/L11/L14/shared style/merged не менялись. Пункт рефреша ждёт просмотра автора.

`finalize 10` на Node 24.19.0: source/map/macros, 59 tests, build и оба PDF. `render-qa.py`: 48/110 страниц. Обе новые страницы и все шесть состояний просмотрены крупно: формулы/тезисы/источники помещаются без изменения размера шрифта. Все остальные **46 handout + 104 steps** совпадают с предыдущим проверенным экспортом попиксельно вне folio. Shared theme не менялась, применим предыдущий проверенный стиль L1. Browser inspector: 39/40, все состояния, содержательные клики, стабильная геометрия/обратные шаги, без content overflow/math/resource errors; финальные состояния после возврата с соседнего слайда совпадают попиксельно. Прежние dev-подписи панели отсутствуют в PDF. Экспортные source/map/shared inputs/assets сверены перед переносом. QA: `../output/qa/edm-training-sampling-2026-10-11/`.

SHA-256:

- `slides.md`: `39a7b46fbe31a33da6a9a2b9a353c0b24e0e5f4d30e92550ad51ac2b5208d02a`.
- `slide-map.json`: `4b2c4f2e92612121edddbd3e245608f362fa07dfa4d57b0f5e597dd8568200ee`.
- `Lecture10.pdf`: `8af31d1e162797193e422627af36b857c043a7b935328bbee79a9826a4eec165`.
- `Lecture10-handout.pdf`: `75024f1382bc0f33a7b1a1cc833a57941b00eab571b3e3f66d776c4379ffd90b`.


## Course refresh: от знакомой параметризации к циклу генерации, 2026-10-11

По согласованию автора Training 39 прямо отсылает к clean-data parameterization из L7 (34–35). Убраны очевидная фраза о весе и неясное указание о sampling noise levels; оставлен вывод “Same training objective, different prediction target”. Полные Tweedie и loss derivation сохранены. Sampling 40 начинает с вопроса о генерации и явной ссылки на ранее выведенную PF-ODE этой лекции. Полная подстановка и chain rule сохранены; заключение требует дискретизировать поле на убывающих уровнях шума.

Добавлен **41 Generate Samples with a Denoiser**: единый Sampling (Euler) block раскрывает Gaussian initialization, повторное вычисление D_theta, полный Euler update и возврат результата. Superscript (i) отличает численные состояния от clean target x_0. Основной тезис — пересчитывать условное среднее на каждом шаге; следующий вопрос о работе на всём диапазоне шумов ведёт к preconditioning 42. Общий Sampling теперь 43. Связи предыдущий → текущий → следующий и развитие мысли внутри каждого слайда проверены. Denoiser prediction и свобода выбора sampler уже известны из L7/L8; добавлена их явная реализация через ODE/Euler из L9. Это не объявлено новым принципом генерации. Карта перенумерована: **49 слайдов / 112 состояний**.

Scoped notation/Recap/Summary: знаки поля и отрицательного шага Δσ проверены. Notes оговаривают Gaussian approximation при большом σ_0, точность Euler, положительный текущий σ в последнем шаге к нулю и отсутствие оценки сети при нуле, финальный Euler вместо Heun на сингулярном конце. Сохранены различия exact Tweedie / learned approximation и исходного DSM weighting / полного EDM recipe. Summary из шести пунктов, Recap L10/L11, разделы/Outline/README/catalog не требуют изменений. Прежние слайды вне 39/40 сохранены, у preconditioning изменена только narrative note. L11/Beamer/merged/shared theme не менялись в этой правке.

`finalize 10` на Node 24.19.0: source/map/macros, 59 tests, build и оба PDF прошли. При визуальном просмотре исправлено сближение заголовка и первой формулы ODE локальным отступом; размер шрифта не менялся. После исправления повторены finalize и browser QA. `render-qa.py`: 49/112 страниц. Просмотрены все восемь изменённых/новых состояний и handout 39–41. Остальные **46 handout + 104 steps** совпадают с предыдущим проверенным экспортом попиксельно вне folio; изменены только прежние 39/40 и добавлен 41. Предыдущая проверка стиля L1 применима, shared theme сохранена. Browser inspector 39–41: без overflow/math/resource errors, стабильная геометрия, содержательные клики и обратные шаги. Финальные состояния 39–41 после возврата с соседнего слайда совпадают попиксельно. Source/map/package/lock/theme/components/lib/public и lecture assets сверены с изолированной экспортной копией. QA: `../output/qa/edm-euler-2026-10-11/`. Пункт рефреша ждёт просмотра автора.

SHA-256:

- `slides.md`: `a37c61b2703256d86256c1c1dd16d37ed8b8c85b8c3cf3948ec82a1cf02a59c2`.
- `slide-map.json`: `c2a574ea6e4e33c43a0d121f841031f08dd4612fdf92c7d783913d1dbb69527e`.
- `Lecture10.pdf`: `6aeef5788181ddf35293dd9e7e3019296cb9802f3ff82eaef91d1888e40a5f3f`.
- `Lecture10-handout.pdf`: `20c415cf38ef04caaef43ac27b8d31174484765f1d32ad3e56496e089b67601c`.


## Course refresh: ODE по σ → denoiser training → sampling, 2026-10-11

Автор согласовал перестройку логики трёх слайдов: сначала переход от времени к уровню шума и выбор denoiser, затем обучение, затем генерация. Теперь **39 From Time to Noise Level** принимает score и Gaussian perturbations из Training 38. Первый клик полностью подставляет f/g в прежнюю PF-ODE и применяет chain rule t→σ; второй выбирает знакомый из L7 conditional-mean denoiser для поля. Заключение объясняет направление шага при уменьшении σ и задаёт вопрос об обучении. Дублирование score conversion на этом слайде не нужно: полная формула сохранена вместе с Tweedie на следующем.

**40 Denoiser Parameterization: Training** отвечает на вопрос предыдущего слайда. Полная Tweedie identity, score conversion, исходный per-pair score loss и оба шага его преобразования сохранены. Заголовок явно указывает на loss слайда 38; conclusion ведёт к использованию обученного denoiser в sampler. **41 Generate Samples with a Denoiser** начинает с этого применения, сохраняет полный Euler loop и переход к noise-range preconditioning на 42. Три narrative-связи проверены для каждого слайда. Выбор denoiser не объявлен необходимым следствием смены времени или универсально лучшим выходом сети; notes сохраняют различия точной identity / learned approximation и прежнего DSM objective / полного EDM recipe.

Карта синхронизирована; **49 слайдов / 112 состояний**, клики 39/40/41 = 2/2/1. Все исходники до 39 и от 42 до конца побайтово совпадают с предыдущей редакцией. Scoped notation/math check: аргументы функций, коэффициент 1/2, chain rule, σ^-4 и знак убывающего Euler step сохранены. Summary содержит шесть пунктов и покрывает denoiser/PF-ODE; incoming Recap не затронут, outgoing Recap L11 согласован с неизменившимися исходными формулами. Нового материала для расширения Recap нет. Разделы/Outline/README/catalog, Beamer/L11/merged/shared style не менялись.

`finalize 10` в изолированной копии на Node 24.19.0: source/map/macros, 59 tests, web build, оба PDF прошли. `render-qa.py`: 49/112 страниц. Все восемь изменённых состояний и handout 39–41 просмотрены крупно; формулы сохранены без уменьшения шрифта, нет наложений/обрезки. При первоначальной проверке устранён лишний повтор score conversion на 39, затем проверки повторены. Сравнение всех страниц с предыдущим проверенным экспортом: **46 handout + 104 steps** полностью совпадают попиксельно; изменены только handout 39–41 и steps 87–94. Общий стиль и предыдущая проверка с L1 применимы, shared inputs не менялись. Browser inspector: все состояния 39–41, стабильная геометрия и обратные шаги, содержательные клики, нет content overflow/math/resource errors; возврат с соседних слайдов на финальные состояния попиксельно идентичен. Все 32 экспортных входа source/map/package/lock/theme/components/lib/assets сверены перед переносом. QA: `../output/qa/edm-order-2026-10-11/`.

SHA-256:

- `slides.md`: `4c0e1e2fda490f273beee2f363126bf8fce86fa3fbd707ca4c7c425f47c82d92`.
- `slide-map.json`: `b12e7e5321b6459b09fbf8d9965dbcddaa22d2fdda8a8457b7fbc6ce57643adb`.
- `Lecture10.pdf`: `c191ee31677950f1cd231ae68a7f3f59a48ee3c3a33b872aef1d2b63d3f618d5`.
- `Lecture10-handout.pdf`: `4876a8a17263a65217faf7f8f975d538ef5b67550aba09ec7f299490f9984b81`.


## Course refresh: формула шума и Tweedie до использования, 2026-10-11

По замечаниям автора на 39 вместо слов “additive Gaussian noise” явно записаны x=x₀+σε и ε∼N(0,I). Полная Tweedie identity перенесена с 40 на 39 перед формулой поля через denoiser. Заголовок теперь “Choose a denoiser using Tweedie's formula”; отсылка к номеру лекции удалена, notes также ссылаются на темы. На 40 сохранены score conversion и весь вывод loss, вводная фраза использует уже напомненную identity. Заголовок score-loss больше не зависит от номера слайда. В `CLAUDE.md` §3 закреплено пожелание автора: в слайдах ссылаться на понятия/темы, а не номера лекций, которые меняются со временем.

Логика 39: явное зашумление → PF-ODE по σ → Tweedie → denoiser field → вопрос об обучении. 40 отвечает loss derivation и ведёт к неизменённому Euler Sampling 41. Все прежние формулы сохранены; исходники вне 39–40 и карта побайтово совпадают с предыдущей редакцией. **49 слайдов / 112 состояний**. Scoped notation/math check: Gaussian perturbation, marginal score в Tweedie, learned approximation и conditional training target различены; веса/знаки/аргументы не изменены. Summary (6 пунктов), оба Recap-интерфейса, разделы и README/catalog сохраняют прежнее проверенное содержание. Beamer/L11/merged/shared style не менялись.

`finalize 10`: source/map/macros, 59 tests, web build и оба PDF; `render-qa.py`: 49/112. Все шесть изменённых состояний и handout 39–40 просмотрены: нет наложений/обрезки, размер шрифта сохранён; для добавленной строки скорректированы локальные отступы. Сравнение всех страниц: **47 handout + 106 steps** полностью совпадают попиксельно; изменены только handout 39–40 и steps 87–92. Browser inspector до и после export: все состояния 39/40, стабильная геометрия, содержательные клики и обратные шаги, без content overflow/math/resource errors. Финальные состояния после возврата с соседнего слайда попиксельно совпадают. Shared inputs не менялись, применяется прежнее сравнение с утверждённым стилем L1. 32 экспортных входа source/map/package/lock/theme/components/lib/assets сверены перед переносом. QA: `../output/qa/edm-tweedie-2026-10-11/`.

SHA-256:

- `slides.md`: `d8dee5f43ecc646292b5e6f1670c3b8c584e49f70a4a17cb01046cfbd3224f2c`.
- `slide-map.json`: `b12e7e5321b6459b09fbf8d9965dbcddaa22d2fdda8a8457b7fbc6ce57643adb`.
- `Lecture10.pdf`: `dba8b571198e265659b6b24d316a14288f9e92dcb633829bf868b312994859dc`.
- `Lecture10-handout.pdf`: `41e1f84ab05a00059408b4981a4f5fcce9edfd6f0d9e63f56017579da4e3e4da`.


## Course refresh: аудит переходов 38–43 и удаление повторных введений, 2026-10-11

Автор указал, что после переноса Tweedie слайд 40 всё ещё заново объясняет установленную на 39 связь, и попросил проследить всю последовательность. Проверена цепочка от общего Training 38 до Sampling 43, включая выход через Outline к Flow Matching. На 39 Tweedie вводится единственный раз; 40 теперь сразу использует результат вместо нового определения denoiser, условного среднего и отдельной score conversion.

- **38 → 39:** известный score-training objective и Gaussian transitions → специализация к аддитивному шуму, полная PF-ODE по σ, Tweedie и выбор denoiser. Слайд 39 сохранён; его финальный вопрос задаёт задачу следующего.
- **39 → 40 Train the Denoiser:** исходный score loss виден сразу; первый клик вычисляет conditional Gaussian target, второй полностью подставляет уже выбранный denoiser и получает weighted clean-data MSE. Повторных упоминаний Tweedie и определения conditional mean в видимом содержимом 40 нет. Вывод приводит к обученной функции для sampler.
- **40 → 41:** обученный denoiser используется в неизменённом полном Euler loop. Вместо нового объяснения conditional mean и ответвления к выбору solver заключение выделяет следствие алгоритма: одна сеть вызывается на разных уровнях шума. Вопрос — как её параметризовать на всём диапазоне.
- **41 → 42:** зависимость масштаба входа и требуемой коррекции от σ мотивирует preconditioning; его полная формула, объяснение коэффициентов и low-noise предел сохранены. Заключение открывает использование score representation в reverse SDE.
- **42 → 43 Sampling with the Reverse SDE:** вступление явно обозначает stochastic sampling и возврат к общей SDE с terminal prior N(0,I), чтобы не смешивать её координаты с предшествующим additive-noise Euler loop. Сам Sampling block, изображение и два тезиса о reverse SDE / PF-ODE сохранены. Далее Outline и CNF/Flow Matching переходят к обучению velocity field.

Нотация и математика: ни один шаг loss derivation или Euler update не сокращён. Повторная standalone score-conversion formula убрана с 40; соответствующее выражение полностью стоит в подстановке в loss. Различия marginal/conditional score, learned approximation, σ^-4 objective / полный EDM recipe сохранены в notes. Содержательные clicks 40 теперь последовательно раскрывают target и substitution; остальные click counts прежние. Карта обновляет два заголовка; **49 слайдов / 112 состояний**. Summary (6 пунктов), входящий Recap и исходные формулы исходящего Recap не менялись; общий Sampling block совпадает с предыдущей редакцией побайтово. Расширения Recap не требуется. Разделы/Outline/README/catalog, Beamer/L11/merged/shared style не изменены.

`finalize 10`: source/map/macros, 59 tests, build и оба PDF прошли; `render-qa.py`: 49/112. Вручную просмотрены все девять изменённых состояний и handout 40–43, включая каждый переход; нет обрезки/наложений, шрифт прежний. **45 handout + 103 steps** совпадают с предыдущим проверенным экспортом попиксельно; изменены только handout 40–43 и steps 90–92, 94–99. Browser inspector проверяет всю цепочку 38–43 (16 состояний), включая обратные шаги: без overflow/math/resource errors, стабильная геометрия и непустые клики. Повторная проверка после export и возвратов на финальные состояния выполнена. Общая тема и математические макросы не менялись; предыдущая проверка стиля L1 применима. Все 32 экспортных входа source/map/package/lock/theme/components/lib/assets сверены перед переносом. QA: `../output/qa/edm-narrative-2026-10-11/`.

SHA-256:

- `slides.md`: `2b8156d47728f83c568d37b155e7f840fdb80dd289efc5d54a19ad07054d7bce`.
- `slide-map.json`: `be5a3dc1d06142f6011a3e25d5d5eddc163b54411868f9581d8f9b2d31c1b432`.
- `Lecture10.pdf`: `01272793e611cf8848f965e0133f2d60c965c00b08a2684ebfd597d2946ca295`.
- `Lecture10-handout.pdf`: `2c03102b16a643bd63c11a58a798976f0215a316445d5759f1cef706a6c32e73`.


## Course refresh: EDM после полной пары Training / Sampling, 2026-10-11

По указанию автора блок denoiser/EDM перенесён после общего Training / Sampling и перед Flow Matching. Новый порядок: **38 Training → 39 Sampling with the Reverse SDE → 40 From Time to Noise Level → 41 Train the Denoiser → 42 Generate Samples with a Denoiser → 43 EDM: Preconditioning the Denoiser → 44 Outline → 45 Continuous-Time Normalizing Flows**. Карта источников синхронизирована; provenance четырёх расширений сохранён. **49 слайдов / 112 состояний**.

Вступление 39 прямо использует обученный score с предыдущего слайда. На 40 переход явно обозначен как специализация к аддитивному шуму после завершённой общей схемы. Финал 43 задаёт вопрос о прямом обучении velocity field и ведёт к Flow Matching через Outline/CNF. Исправлены устаревшие переходы в notes; на 21 удалены две видимые отсылки к номеру лекции согласно сохранённому предпочтению автора. Полные формулы, Training, общий Sampling и Euler Sampling сохранены; три алгоритмических блока побайтово совпадают с предыдущей редакцией.

Scoped semantic checks: последовательность предпосылок и три narrative-связи проверены; Tweedie вводится на 40 до использования, 41 применяет её в loss без повторного введения. Различия marginal/conditional score, terminal prior общей SDE и additive-noise координат, learned approximation и полного EDM recipe сохранены. От Outline Flow Matching до конца исходник не менялся. Summary (6 пунктов), incoming/outgoing Recap и повторные исходные формулы сохраняют проверенное содержание; расширения Recap не требуется. Разделы/Outline/README/catalog, Beamer/L11/merged/shared style не менялись.

`finalize 10` в изолированной копии: source/map/macros, 59 tests, web build и оба PDF прошли. `render-qa.py`: 49/112 страниц. Все девять изменённых PDF-состояний и handout 21, 39–43 просмотрены крупно: без наложений/обрезки, формулы и размеры шрифта сохранены. Сравнение по source frame/title/click с учётом перестановки: **45 handout + 103 steps** совпадают попиксельно вне folio; изменения только handout 21/39/40/43 и steps 41–43, 87–91, 99. Добавленных страниц нет. Shared style не менялся, предыдущее сравнение с утверждённым L1 применимо.

Browser QA до и после export: **23 состояния девяти слайдов (21, 38–45)**, без overflow/math/resource errors, стабильная геометрия и обратные шаги. Для slide 21 временная изолированная копия inspector дополнена селекторами tr/td/th: исходный инспектор не учитывал раскрытие строк таблицы и ошибочно сообщал empty click. Общие инструменты проекта не менялись. Финальные состояния 21, 38–43 и 45 попиксельно совпадают после возврата с соседнего слайда. Все 32 экспортных входа source/map/package/lock/theme/components/lib/assets сверены с изолированной копией. QA: `../output/qa/edm-placement-2026-10-11/`. Пункт рефреша остаётся на просмотре автора.

SHA-256:

- `slides.md`: `b2cba47b1c20533c59aff03b054bc0ece3e4da8a4f82c9ed1d5a0bbfd7c6eb61`.
- `slide-map.json`: `a2241e85ce928e679c99dd62c37f38e20a8f9e01c06aad08d942ccb0b6c8d3e5`.
- `Lecture10.pdf`: `bbce8f42680515edc57f166ed870662f2e2b1ab8a5532640a00bcb8558054dcc`.
- `Lecture10-handout.pdf`: `ad51e5ac7c9161c65c281e07da6ab1d4544c972359c93393dd0646860789a275`.


## Course refresh: удалить preconditioning из основной линии, 2026-10-11

Автор согласовал удаление прежнего слайда 43 «EDM: Preconditioning the Denoiser»: необъяснённые масштабы и коэффициенты открывали отдельную практическую тему после уже законченного вывода обучения и генерации. Разбор preconditioning отложен; его необходимость и коэффициенты следует мотивировать отдельно, если эта тема вернётся. Решение записано в refresh report. Три слайда 40–42 с ODE по σ, Tweedie, полным выводом denoiser loss и полным Euler Sampling сохранены.

На 42 новый финал: “The denoiser defines the velocity field used by the ODE solver. Can we train a velocity field directly?” Далее **43 Outline → 44–45 CNF → 46 Flow Matching: Training and Sampling → 47 Flow Matching → 48 Summary**. Это завершает вопрос 41 об использовании обученного denoiser и открывает прямое обучение поля. Удалены висящие ссылки на preconditioning в notes. Summary сохраняет шесть пунктов; вместо preconditioned denoiser/EDM отмечает denoiser parameterization of PF-ODE. Карта синхронизирована: **48 слайдов / 109 состояний**. Удалено только extension:34, исходные Beamer frames покрыты полностью.

Scoped source/semantic checks: все три алгоритмических блока Training / Sampling / Euler Sampling побайтово неизменны. Входящий Recap не затронут; исходящий Recap Slidev L11 проверен — preconditioning в нём не было, все повторяемые SDE/PF-ODE/loss/Sampling/CNF/FM определения остаются прежними. Переписывать Recap не требуется. Формулы/нотация не менялись, Summary больше не заявляет удалённую тему. Разделы, Outline и README/catalog неизменны; Beamer/L11/merged/shared style не затронуты.

`finalize 10`: source/map/macros, 59 tests, web build и оба PDF прошли. `render-qa.py`: 48/109 страниц. Сравнение всех сохранённых страниц по frame/title/click: **46 handout + 107 steps** попиксельно совпадают с предыдущей просмотренной редакцией вне folio. Изменены только handout 42/48 и steps 96/109; удалены ровно прежний handout 43 и три состояния preconditioning. Обе изменённые страницы каждого PDF просмотрены крупно: без наложений/обрезки. Прежняя проверка утверждённого стиля L1 применима — тема/макросы/размеры сохранены.

Browser QA после export: **13 состояний слайдов 40, 41, 42, 43, 44, 48**, без overflow/math/resource errors, стабильная геометрия и обратные шаги. Финальные состояния 40–44 попиксельно совпадают после возврата с соседнего слайда, включая переход через Outline. Все 32 экспортных входа сверены с изолированной копией. QA: `../output/qa/remove-preconditioning-2026-10-11/`.

SHA-256:

- `slides.md`: `086b695472e2c6118dcea170a8ae6e37809d371349846a08dabfcf6539acd3b5`.
- `slide-map.json`: `023b2807a466ae0319cd24707f5d9e28c62b75d4896b53e831208683a61977b3`.
- `Lecture10.pdf`: `7b08ddb09d943263ed620205eca9f25c1c298e07f50de0920008c7e880c33950`.
- `Lecture10-handout.pdf`: `145de6aabfc31798b387435de3ac77622b0ca87e0241d44539a359f5f3fa00b2`.


## Course refresh: пункт принят и закрыт; pre-commit/push review, 2026-10-11

Автор принял результат и попросил закрыть пункт рефреша, закоммитить и запушить наработки. Итоговое название — **Denoiser-параметризация PF-ODE**. Оглавление остаётся прежним: блок является конкретизацией общей score-based схемы. Отдельный разбор EDM preconditioning отложен и не заявляется выполненным. Локальный `reading-notes/course-refresh-report-2026.md` обновлён (папка намеренно исключена из Git). Следующий открытый пункт L10 — связь deterministic DDIM с дискретизацией PF-ODE; новых слайдов по этому пункту пока нет.

Перед коммитом проверен весь накопленный diff L10/L11: обзор сэмплеров, два вида sampling dynamics, Anderson, объединение VE/VP, moment-ODE, denoiser chain, Summary, карта и durable author preferences. Независимые source checks подтвердили формулы, нотацию, источники, полные Training/Sampling и последовательные переходы. Summary L10/L11: 6/5 пунктов. Source/map/macros/assets checks: L10 48/109, L11 36/80, 87 macros. Section hierarchy, Outline, Materials и каталог совпадают; отдельный раздел EDM не добавляется.

Проверены интерфейсы L9→L10, L10→L11 и L11→L12: повторяемые определения, алгоритмы и картинки согласованы. L9 и incoming Recap L10, body L11 и L12 не менялись; предыдущие проверки неизменённых редакций применимы. Расширять Recap из-за denoiser specialization не требуется. Все восемь SHA-256 исходников/карт/обоих PDF L10/L11 совпадают с последними проверенными записями; повторная сборка для изменения статуса не нужна.

Также проверен уже существующий исходящий коммит `1f456d81` (границы L4–6). Все 12 hashes source/map/PDF совпадают с журналами; L3–7, shared style/dependencies и README/catalog с момента его проверки неизменны. Ранее сохранённые семантические, browser/PDF и demo checks остаются применимы. Задокументированные исходные научные оговорки не являются новым drift. Shared UI и физическое оборудование текущим изменением не затрагиваются. Beamer и merged не менялись.


## Course refresh: DDIM как Euler в координатах шума, 2026-10-11

По запросу автора добавлен один слайд **43 DDIM Is Euler in Noise Coordinates**, после полного Euler Sampling 42. Повествование: 42 ставит вопрос о связи полученного sampler с deterministic DDIM; 43 напоминает именно прежние noise/clean predictions и DDIM update, затем определяет нормированное состояние и marginal noise clock, индуцированный denoiser, и полностью преобразует DDIM в предыдущий Euler step. Конец 43 открывает прямое обучение velocity field; далее 44 Outline и 45–46 CNF подводят к Flow Matching. Отсылок к номерам лекций нет.

Связь с прежними темами сверена по `lecture8/slides.md`: сохранены cumulative alpha_bar, epsilon_theta,t(x_t), xhat_0 и s<t. Нормировка tilde x=x/sqrt(alpha_bar) приводит DDPM marginal к уже использованному x_0+sigma epsilon; sigma — уровень аддитивного шума в нормированных координатах. D_theta определяется через существующий predictor, не требует новой сети. Тождество касается шага при одинаковых predictor/grid; notes явно различают Euler в исходном t и новом sigma, transition noise и marginal noise, точность интегрирования и алгебраическую эквивалентность. Также учтено отличие рескейленного DDPM initial prior N(0,(1+sigma_T^2)I) от приближения N(0,sigma_max^2 I) в предыдущем additive sampler. При s=0 обе записи шага возвращают xhat_0 и не вычисляют сеть при нулевом знаменателе.

Первоисточник проверен: Song, Meng, Ermon, DDIM, Section 4.3, eqs. (13)–(15), https://arxiv.org/html/2010.02502v4#S4.SS3. Статья использует alpha_t для cumulative schedule, в курсе сохранено alpha_bar_t. Все формулы нового слайда записаны полностью; ни шрифт, ни shared theme не менялись. Summary остаётся из шести пунктов; denoiser/PF-ODE takeaway включает DDIM в rescaled state/noise coordinates и NFE. Карта: **49 слайдов / 112 состояний**, новый слайд имеет два содержательных клика. Refresh пункт отмечен реализованным для просмотра автора, не закрыт автоматически.

Scoped notation/semantic check и независимый read-only source review прошли. Предшествующие слайды 1–41 и все три алгоритмических блока Training / Sampling / Euler Sampling побайтово неизменны. Incoming Recap и L10→L11 повторные формулы не менялись; нового материала для обязательного расширения Recap нет. L8, L11, разделы/Outline/README/catalog, Beamer/merged не редактировались.

`finalize 10`: source/map/macros, 59 tests, web build и оба PDF прошли; `render-qa.py`: 49/112. Сравнение всех страниц: **46 handout + 107 steps** попиксельно совпадают с предыдущей проверенной редакцией вне folio; изменены только handout 42/49 и steps 96/112, добавлены handout 43 и steps 97–99. Все новые/изменённые страницы обоих PDF просмотрены крупно, без наложений/обрезки. Общая тема и макросы прежние, предыдущее сравнение с утверждённой L1 применимо.

Browser QA до и после export: **10 состояний 42/43/44/45/49**, без overflow/math/resource errors, стабильная геометрия и обратные клики. Финальные состояния 42–45 попиксельно идентичны после возврата с соседнего слайда. Все 32 экспортных входа сверены с изолированной копией. QA: `../output/qa/ddim-pfode-2026-10-11/`.

SHA-256:

- `slides.md`: `e781f3e146c1d0588872dde8e5177dc688052da52ee7861438957f9ea4fd4368`.
- `slide-map.json`: `1301635a50fe6d7b453e1e55b5782a6f17feb93c8236e1d5dcbd43f3d1b35ce6`.
- `Lecture10.pdf`: `e30d56c9a0288b7fab224ed51a5a80fe55cecbeeed6cbe8b01cb5d22ae8d4d07`.
- `Lecture10-handout.pdf`: `0fa4463d9d05160290c41f3e02c696f7766071ec5339c407a29d8c8cc62c6b86`.


## Course refresh: ранний мост DDPM/NCSN и последовательность denoiser → DDIM → CNF, 2026-10-11

Автор запросил отдельный пункт оглавления и более естественный переход от DDIM к следующей теме. Добавлен раздел **5 Denoiser Parameterization and Sampling**, Outline 40, согласованы все семь Outline и Materials в корневом README. Flow Matching теперь раздел 6. Это уточняет прежнее решение не выделять блок: после добавления DDIM он рассматривается как самостоятельная последовательность. Отдельного разбора EDM preconditioning по-прежнему нет. Проверка Beamer baseline считает пять разделов; фактический Slidev Outline содержит шесть.

Повествование: общая пара Training 38 / Sampling 39 → Outline 40 → noise-level ODE 41 → denoiser training 42 → Euler sampling 43 → DDIM 44. Теперь 41 напоминает знакомую additive-noise form, а 44 прямо отсылает к ранее введённому DDPM/NCSN rescaling (L8/13). Полный вывод сохранён. Последняя фраза 44: «DDIM implements this Euler step using the existing noise predictor.» Искусственный вопрос о velocity field убран. **46 CNF** начинается с «Now learn the velocity field itself», затем стоимость likelihood training мотивирует Flow Matching. Notes согласованы; Summary остаётся из шести пунктов. Incoming Recap, повторные CNF-формулы и L10→L11 не менялись.

Итог **50 слайдов / 113 состояний**. Browser QA до и после export: 8/9/15/24/32/39/40/41/43/44/45/46/50, **21 состояние**; 7 возвратов с соседнего слайда попиксельно идентичны. PDF comparison вне folio: **40 handout / 98 steps** неизменны; изменены handout 8/9/15/24/32/41/44/45/46, добавлен 40; изменены steps 8/9/26/50/68/90–92/99–104, добавлен 89.

Scoped notation, Summary, Recap и Outline/README проверки, включая независимые read-only reviews, прошли. `finalize` прошёл source/map/assets/macros checks (87 macros), 59 tests, web build и оба PDF. `render-qa.py` отрендерил все страницы. Все новые/изменённые страницы обоих PDF просмотрены: без обрезки/наложений. Browser: без overflow/math/resource errors, стабильная геометрия и обратные клики. 71 экспортный вход L8–10 и корневой README сверены с изолированной сборкой. Размеры шрифтов, shared theme и macros не менялись; прежнее сравнение с утверждённой L1 применимо. Beamer и merged не затронуты. QA: `../output/qa/noise-coordinates-2026-10-11/lecture10/`. Изменения подготовлены для просмотра автора, новый пункт автоматически не закрывается.

SHA-256:

- `slides.md`: `6df5f4a3024045f8aee7588cc2736733384db42f7f9cceda7a2256f5bc176375`.
- `slide-map.json`: `38e6a427fe9fe8008503b7e40cb5cc298a17203902bfafc61c5b5d18a2beeabe`.
- `Lecture10.pdf`: `e3f3954729bc068e47554b8c28b7f934cc304a3760166b7f0b3b3a6d15e60915`.
- `Lecture10-handout.pdf`: `cd33e9cd37e7599ec8dbe3dab17097dffd8abdd36ea791fab7d0fee9913b9720`.

## Course refresh: принято автором; pre-commit/push review, 2026-10-11

Автор одобрил DDPM/NCSN noise-coordinate bridge, DDIM↔PF-ODE и отдельный раздел denoiser sampling; запросил commit/push. Соответствующие пункты локального refresh report закрыты. Следующий открытый пункт — термин rectified flow в L11; его слайды этим коммитом не меняются.

Проверен весь текущий diff L8–10 и README, staged/unstaged/untracked scope; исходящих коммитов перед этой правкой нет. Повторные source/map/assets/macros checks прошли. Независимый semantic review подтвердил incoming/outgoing Recaps L7→8→9→10→11, повторяемые определения и Training/Sampling, Summary (5/5/6 пунктов), фактические шесть разделов L10, все семь Outline и README/catalog. Все 12 source/map/PDF hashes совпадают с предыдущими QA-записями; 54 текущих входа (sources/maps/assets/theme/components/lib/package/lock) и README совпали с изолированной сборкой. Предыдущие проверки browser/PDF относятся к этой же редакции; для обновления статуса повторная сборка не требуется. Нового semantic drift не найдено. Beamer/merged и shared infrastructure не менялись.


## Исправление исходящего Recap после refresh, 2026-10-11

По замечанию автора пересмотрен прежний вывод «нового материала для обязательного расширения Recap нет»: он подтверждал fidelity существующих формул, но не проверял coverage нового основного раздела. В L11 добавлен recap-слайд 9 denoiser/PF-ODE/DDIM перед CNF; исходники и PDF L10 не менялись. Исправление проверено source/PDF/browser, подробности в `../lecture11/migration.md`. Skills recap-sync/lecture-audit и MIGRATION §7 теперь требуют отдельного body→recap mapping. Ретроспективные пропуски других границ задокументированы в `../recap-coverage-audit-2026-10-11.md`; старые общие заключения о полноте на этих границах заменены текущими результатами.

## Восстановление покрытия Recap, 2026-10-11

- По явному запросу автора исправлена граница **L9→L10**. Правило: дополнять существующий слайд по той же теме; новый — только при нехватке читаемого места или смешении тем. Числового лимита нет; массового сокращения прежних рекапов нет.
- 2: Euler/Heun global error и NFE; 5: Hutchinson identity и определение Jacobian; новый 6: полные CNF Training/Sampling. Два алгоритма не помещаются рядом с continuity equation/trace estimator. Для читаемости вторичная оговорка local error перенесена в notes, пояснение Hutchinson сокращено до одного абзаца; все формулы и размер шрифта сохранены.
- Всего добавлен один слайд. Recap: **7** слайдов; вся лекция: **51 слайдов / 114 состояний**. Карта и нумерация обновлены.
- **Coverage:** соответствующие пропуски из `../recap-coverage-audit-2026-10-11.md` закрыты. **Fidelity:** формулы, обозначения и алгоритмы сверены с фактическим телом предыдущей лекции, выполнена независимая перекрёстная проверка субагентами. Проверены переходы до/после новых слайдов и внутренний порядок.
- Исходник от первого Outline до конца побайтно совпадает с версией до исправления: body, Summary и разделы не менялись. Исходящий Recap и README schedule дополнительных изменений не требуют. Изменение ограничено входящим Recap; Beamer и merged не затронуты.
- `finalize 10`: source check (карта, источники, assets, macros), **59/59 существующих тестов**, production build и оба PDF прошли. Перед сборкой и после неё 86 входных файлов изолированной копии + корневой README сверены побайтно с каноническими. Общие тема/стиль/шрифты не изменены.
- `render-qa.py 10`: оба PDF имеют ожидаемое число страниц, raw math delimiters отсутствуют. Визуально просмотрены все изменённые/новые страницы обоих PDF; обрезки, наложений и переполнений не обнаружено. Все остальные **48 handout / 111 steps** страницы попиксельно совпадают с прежними PDF, кроме folio.
- После экспорта свежий dev и `inspect.mjs`: слайды **2, 3, 4, 5, 6, 7**, **6 состояний**; KaTeX/assets/границы/геометрия раскрытий/обратные клики прошли. **6** возвратов с соседнего слайда попиксельно идентичны.
- QA и логи: `../output/qa/recap-fill-2026-10-11/lecture10/`. Это проверка конкретных изменений и соседей, а не новый полный аудит неизменённого тела.

SHA-256 итоговых файлов:

- `slides.md`: `75f71af6b4e6b595f0e41816f4d529f5ec00dd855fcac6ee67066c63ba78b7a5`.
- `slide-map.json`: `1179dbba3d14e7a46568eedc9a2da416995f7085a5619e1ebc4302b6e3a0e044`.
- `Lecture10-handout.pdf`: `97dcf263a1b5bdedd23ca73a38b5d16e4f7c38372c8f7aa92290c31f0fbcc9fb`.
- `Lecture10.pdf`: `dae4813bf01cbe003a2b6c889cbaea743a9514f6c5b6c2f374f128bbdd7f2239`.
