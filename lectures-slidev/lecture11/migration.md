# Lecture 11 migration

Verification date: 2026-09-16. The lecture is migrated and both PDFs are finalized and visually reviewed. The final L10 → L11 recap comparison has been completed in source, browser, and PDF, with the final PDF pair review performed by the parent coordinator. No physical-device validation is claimed.

## Baseline and scope

- Beamer source: `lectures/lecture11/Lecture11.tex`, current repository HEAD `19e673be350344c8ea4fafffb78fa389d8b65e19`; last source commit `e73f11b8a39240c0bafc1fc959d045b9300c5a85`.
- Source SHA-256: `b1bdb762a48793e72b89d292251fa99022c64af45a49d16152b11343eefd85d0`.
- Baseline PDF SHA-256: `4d341ee9feb61a36fea3de8e94e907ffea36ba75d93e3e5d0f9b61b4c08dd76a`; 78 pages.
- The baseline PDF is the same revision: source MD5 `3cfcd0636825bbd1c6d7e5d65bd17888` and 26,631 bytes match the successful `Lecture11.fdb_latexmk` record.
- Pure format migration: all definitions, derivation stages, claims, conditions, citations, illustrations, Training/Sampling algorithms, seven incoming recap frames, and the static five-bullet Summary are preserved. No new demonstrations or editorial content.
- Existing Beamer files, shared notation, and `lectures/merged/` were not edited or rebuilt. Shared taxonomy support was coordinated by the parent; this lecture uses `flow-matching`.

## Mapping and adaptation

`slide-map.json` covers all **28 source frames exactly once**, **four automatic Outline transitions**, and four continuation slides: **36 logical slides / 80 reveal pages**. The source has 32 logical frames including automatic transitions and 78 overlay pages. Two additional states are the two static recap splits; the two proof-split boundaries replace existing pauses.

| Source frame | Slidev slides | Reason and preserved sequence |
|---|---|---|
| 4 | 4–5 | Reverse ODE/SDE and separate Proof Sketch at the approved type size; both static. |
| 8 | 9–10 | Dynamics and continuity equation followed by the original Flow Matching block; both static. |
| 12 | 16–17 | Theorem/question then all five cumulative proof rows; the original pause before Proof becomes the slide boundary. |
| 14 | 19–20 | Theorem and quadratic-loss expansion then all inner-product marginalization identities; the original pause becomes the boundary. |

- Every other source frame stays on one logical slide. All four section/subsection transitions and the initial Outline contain only the original agenda.
- Unsupported `multline*` presentation becomes equivalent `aligned` rows. Explicit cumulative row ranges preserve the four conditional-vector-field proof additions, the two CFM inner-product additions, and the one-sided CFM substitutions. Whole Training/Sampling blocks remain indivisible reveal groups.
- Source violet is mapped to the approved Lecture 1 violet `#8854c0`; teal/olive meanings are preserved. There is no local font scaling, font-size override, new style sheet, or notation redefinition.
- Long displayed equations are rewrapped at equality boundaries without deleting expressions. End-point implications use complete math fragments so braces, fractions, and delimiters do not cross reveal boundaries.
- All eight PNG assets are byte-identical local copies from Lecture 11, with nine uses plus the shared taxonomy. `favicon: "data:,"` removes Slidev's default external favicon request for offline use.

## Source and interface checks

- `check 11`: 28 source frames, four transitions, 36 slides, 80 states; all 24 source citation occurrences and ten image uses checked; 87 shared macros synchronized.
- Manual content/notation check: equations, indices, signs, conditionals, scalar/vector macros, semantic color groups, initial states, and derivation sequence compared with Beamer. No migrated source-level omission found.
- Strict direct KaTeX rendering with the actual shared macro adapter: **144 expressions** (54 display / 90 inline), `strict: 'error'`, `throwOnError: true`, all pass. This supplements the browser inspector, whose `.katex-error` test alone can miss some parse failures.
- Incoming recap: Lecture 10 Beamer body and current stable Slidev body checked against Lecture 11 frames 2–8. Matching topics are VE/VP SDEs, probability flow ODE, reverse ODE/SDE, continuous/discrete DSM, NCSN/DDPM kernels, Sampling, continuity equation, and FM objective. `probability_flow.png`, `sde.png`, and `sbgm.png` match Lecture 10 by SHA-256. The approved deterministic PF-ODE sampling wording is preserved.
- Outgoing recap: Lecture 12 Beamer recap frames 2–10 checked against Lecture 11 body; CFM objective/theorem, conditional velocity, Q1/Q2, Gaussian paths, endpoint conditioning, one-sided velocity/objective, both algorithms, and conditional/marginal figures agree. Lecture 12's older multiple-dynamics material and plural recap title are retained source choices. The final Slidev-to-Slidev comparison is recorded below.
- Summary: all five source takeaways retained, covering CFM latent conditioning, posterior-mean marginal velocity, equal minimizers, Gaussian conditional velocity, and endpoint straight paths.
- Course README Lecture 11 hierarchy matches both Beamer and Slidev exactly. The parent coordinator owns the shared Slidev catalog update.

### Preserved editorial observation

Source frame 13 says FM and CFM have the same **optimal value**. The following theorem (frame 14), derivation up to a parameter-independent term, and Summary instead assert the same **optimal solution**. The original wording is also repeated in Lecture 12's recap. This mathematical distinction predates the migration and is preserved, not silently rewritten.

## Build, PDF, and browser evidence

- Runtime: a physical copy of the shared installation under `/private/tmp/dgm-slidev-l11-20260916/lectures-slidev`; Node 24.19.0 and the existing lockfile. Dev, build, and export were sequential within this installation; no shared-workspace server/build/export was run.
- `finalize 11` passes: source check, **13 existing tests**, static build, and both page-count-checked PDF exports. An initial isolated-copy test failure was resolved by copying the existing deferred KL test dependency; no test or dependency changes were made.
- `render-qa.py 11`: **36 handout pages and 80 reveal pages**, no raw math delimiters. All **116 pages** visually reviewed through all ten contact sheets.
- Additional 1280×720 full-page PDF review: handout pages **2, 6, 7, 9, 17, 19, 20, 21, 22, 24, 27, 28, 30, 31, 32, 33, 34, 36**; intermediate reveal pages **21, 22, 23, 31, 36, 37, 41, 55, 56, 61, 65, 69**. No clipping, overlap, missing glyphs, footnote collisions, visible future rows, or lost handout derivation states found.
- Every handout page is pixel-identical, rendered at 1280-pixel width, to its corresponding final reveal page in the steps PDF (**36/36**).
- Canonical `inspect.mjs 11`: all 36 slides / 80 states pass nonempty-click, forward/backward geometry, math, image, and content/footer-boundary checks. The final source was also checked by an isolated superset of that inspector after export.
- Extended final browser check: slides 1–35 tested on return from the next slide, plus Summary slide 36 on return from slide 35, retaining the same final state; all external requests blocked, with **zero external requests**, page errors, or HTTP failures. This checks locally served operation without internet dependencies, not an unserved `file://` build.
- Annotation integration on logical slide 16: synthetic mouse stroke, Undo/Redo, Save JSON download, Save & clear, Restore, click-through, neighboring-slide return, and byte-identical returned drawing archive pass. Synthetic drawing cleared; neither final PDF contains UI or session ink. The archive remains only in temporary QA.
- Evidence files (temporary): `output/qa/lecture11/browser-report.json`, `extended-browser-report.json`, `strict-math-report.json`, all page contact/full renders, and `session-test.json`, and `last-slide-return.json`; command logs are in `/private/tmp/dgm-slidev-l11-20260916/`.

## Rendered style comparisons

All comparisons used 1280×720 at equal scale, not only matching macro names.

- **Lecture 1 slides 27 and 35 ↔ Lecture 11 slides 17, 19, and 22**, in PDF and browser: expectation/integral/operator geometry, bold vector/parameter glyphs, loss/objective displays, header/body/block typography, line spacing, and course colors agree. Current clean Lecture 1 captures were supplied by the parent at `/private/tmp/dgm-slidev-parent-20260916/reference-captures/`; matching Lecture 11 captures and PDF renders are in its QA directory.
- **Lecture 10 slides 14 / 17 / 34 / 40 ↔ Lecture 11 slides 2 / 3 / 7 / 8**, browser: VE/VP, PF-ODE theorem, discrete/continuous DSM, and Sampling match in typography and notation. These were inspected from the final stable content captures supplied by the Lecture 10 worker; its remaining re-export affected separate efficient-sampling prose pages.
- **Lecture 10 final handout pages 14 / 17 / 34 / 40 ↔ Lecture 11 final handout pages 2 / 3 / 7 / 8**, PDF: the parent coordinator reviewed these exact pairs at 1280×720 after the final L10 export. Bold/Greek/score/solver notation, math sizes, and headers/footers agree. Source-preserved recap context, labels, colors, and figure sizes remain distinct. Evidence: `/private/tmp/dgm-slidev-parent-20260916/independent-review/L{10,11}-pageN.png`.
- Parent additionally reviewed Lecture 11 handout pages 3, 20, 28, and 34 at 1280×720: clean math, layout, and citations.
- Parent shared-taxonomy regression checked all 1001 existing L1–8 PDF pages: pixel-identical except 15 L3 pages with random native v-mark strokes; the parent verified that all other pixels/text match. Existing main PDFs were not overwritten. Evidence: `/private/tmp/dgm-slidev-parent-20260916/regression-report.json`.

## Artifacts and remaining limits

| Artifact | Pages | SHA-256 |
|---|---:|---|
| `Lecture11.pdf` | 80 | `e3c06b478c50729a17c60c1435ddd1b4ad5dcf7d8e8758c8177fb5f74eea2170` |
| `Lecture11-handout.pdf` | 36 | `9db19f1b2fc4e042c45e6b0c6b169fb3b7428a72fea36861145b8d0a0abbc0ca` |
| `slides.md` | 36 slides | `18b2fd6640df367a7af827ff31c160fab8c5e73e9edd9f6a5a0e8b58685fe52e` |
| `slide-map.json` | 36 entries | `91fef77d722831c6e27b2f61a7bd893ee92b8239201bcd8e7ccf0f4234b12ba6` |

The actual tablet pen, palm rejection, projector, and tablet-to-screen connection have not been tested. Browser mouse/keyboard and archive integration do not establish those physical-device properties. Shared catalog integration is coordinated by the parent; all required local source, PDF, and browser migration checks are complete.

## Final recap typography correction

The parent restored the display-size `\frac12` in the reverse-SDE equation on
logical slide 6 (source frame 5), matching the Beamer baseline and Lecture 10
slide 30. This replaces the smaller `\tfrac12` introduced during conversion; the
equation itself is unchanged. Source checking, strict parsing of all 144 formulas,
the web build and both PDF exports were repeated. Only page 6 changed in each PDF;
the other **114 pages are pixel-identical** to the reviewed versions. Both changed
pages and the browser state were reviewed at 1280×720, and `inspect.mjs` passed
slide 6 without overflow or math/resource errors. The artifact hashes above refer
to these final corrected files. Evidence is in the parent temporary directory:
`l11-correction-report.json`, `l11-correction-inspect.log`, and
`independent-review/L11-corrected-*-6.png`.

## Final course integration — 2026-09-17

The outgoing comparison now uses the final Slidev Lecture 12 (`slides.md` SHA-256 `3001163a798dbb23ab03722b50c4fb7e1b70cbd73df0369d2c613812a245ccbd`). All nine source recap frames (Lecture 12 frames 2–10, logical slides 2–17) were compared with this lecture's body: CFM objectives/algorithms, conditional marginalization, Gaussian paths and velocity, endpoint conditions, one-sided loss/algorithms and the conditional/marginal figures. No new content or notation drift was found; the previously recorded optimal-value distinction remains an inherited source choice.

The coordinator compared final handout pages **L11 21 / 28 / 31 / 34 ↔ L12 5 / 10 / 12 / 16** at 1280×720 and final browser captures **L11 34 ↔ L12 16**. Shared heading/body styles, vector and parameter glyphs, Gaussian/expectation/solver notation, semantic colors and footer clearance agree; the documented recap continuations retain the complete formulas. Five common recap images were checked byte-for-byte. Evidence is in ignored `output/qa/resume-integration/reference-captures/`, `recap-assets.json`, and `output/qa/lecture12/`.

The Slidev catalog and root README integration are complete. The final main-workspace source check, all 144 strict KaTeX expressions, both PDF page counts and the recorded hashes pass; the lecture's reviewed source and PDF bytes are unchanged.

## Равномерные интервалы Summary, 2026-10-03

По запросу автора общий `class: summary` использует вертикальный flex-список с `justify-content: space-between`, аналог `\vfill` между пунктами. Размер шрифта и содержание сохранены; в L4 удалены локальные margin. Проверены Summary всех 14 лекций в браузере и обоих PDF: одинаковые промежутки, отсутствие переполнений, совпадение handout и финального состояния. Для этой лекции: **36 слайдов / 80 состояний**; source check, web build и оба экспорта прошли с Node 24.19.0 в изолированной копии. Все тексты PDF сохранены, остальные страницы попиксельно совпадают с контрольной версией. Это проверка оформления Summary; полный содержательный аудит не повторялся. QA: `../output/qa/summary-spacing-2026-10-03/`.


## Course refresh: CNF training → Flow Matching, 2026-10-03

Recap **9–10** синхронизирован дословно с исправленными формулировками L10 42–43 о likelihood-based CNF training, adjoint и Flow Matching. Добавлена ссылка на Neural ODE. Source map, reveals, body и Summary сохранены. Итог: **36 слайдов / 80 состояний**.

`finalize` в изолированной копии прошёл: 60 тестов, source/map checks, strict math parsing, web build и оба PDF. Все изменённые страницы и состояния просмотрены; browser inspector проверил целевые слайды, reveals и отсутствие overflow/math/resource errors. Отдельно проверен возврат с соседнего слайда к финальному состоянию. Новый слайд L9 визуально сопоставлен с утверждённым стилем L1; shared theme не менялся.

Из 116 страниц двух PDF 112 совпадают попиксельно; изменены только слайды 9–10 в обоих PDF.

Проверены затронутые зависимости: формулы L9 и incoming Recap L10 сохранены; новое объяснение обучения раскрыто в body L10, body L10 42–43 и Recap L11 9–10 согласованы. Body L11 и outgoing Recap L12 не затронуты. Section hierarchy / расписание не менялись; каталог и source maps согласованы. Это проверка текущей правки, не новый полный аудит лекций. Beamer и `lectures/merged/` не менялись.

QA: `../output/qa/cnf-training-2026-10-03/`. Перед публикацией проверено побайтовое совпадение slides/map/components/lib/public и shared theme с экспортированной копией. Актуальные SHA-256:

- `slides.md`: `543b8336356e16e950e9a33319f06a73c47c54d65a5d330e64cf741d14e9ab3d`.
- `slide-map.json`: `91fef77d722831c6e27b2f61a7bd893ee92b8239201bcd8e7ccf0f4234b12ba6`.
- `Lecture11.pdf`: `e0ab10bdc81f70591a3d810383324ea06d2ed26dc357218957e4821d3ad26ba0`.
- `Lecture11-handout.pdf`: `f0d7d092113301ae8215981a00b3e4985740f864243ee569ebe95a51e5a8b396`.


## Course refresh: первоисточник теоремы reverse SDE, 2026-10-04

По согласованию автора ссылка [Anderson B. D. O. Reverse-time diffusion equation models, 1982](https://doi.org/10.1016/0304-4149(82)90051-5) добавлена к формулировкам теоремы reverse SDE: **L10 25/26/29 ↔ L11 Recap 4**. Song сохранён второй строкой источников. Anderson относится к теореме обращения SDE; блок PF-ODE сохраняет прежнюю ссылку Song. Содержание доказательств и все раскрытия оставлены прежними.

Проверка исходников относительно предыдущей просмотренной редакции: после исключения source-footers оба `slides.md` совпадают побайтово, карты также неизменны. Поэтому нотация, Training/Sampling, Summary (L10 6 / L11 5 пунктов), incoming Recap L10, body L11 → Recap L12, Outline/README и каталог не затронуты. Ссылки в L10 body и L11 Recap согласованы. Beamer и `lectures/merged/` не менялись. Это узкая проверка библиографической правки.

В изолированной копии с Node 24.19.0 последовательно выполнены `finalize 10` и `finalize 11`: source/map/macros, по 59 тестов, web builds и четыре PDF. `render-qa.py`: L10 **45 слайдов / 101 состояние**, L11 **36 / 80**. Попиксельное сравнение всех 262 страниц: **248 полностью совпадают**, 14 изменены исключительно в нижней области источников (12 L10 + 2 L11). Все изменённые состояния просмотрены; финальные страницы — крупно. Сноски читаемы и не пересекают материал, ссылки DOI и arXiv активны в обеих раздатках. Общая тема и геометрия сохранены; повторная типографическая проверка опирается на предыдущую просмотренную редакцию и неизменность всех пикселей содержимого.

Browser inspector: L10 25/26/29 — 9 состояний, L11 4 — одно; без переполнений, пустых кликов, сдвигов, math/resource errors. Обратные шаги проверены; отдельный возврат с соседнего слайда к финальным состояниям L10 совпадает попиксельно. Известные подписи штатной панели в dev-снимках Yandex остаются прежними и отсутствуют в PDF; shared UI не менялся.

Course-refresh пункт закрыт. QA: `../output/qa/anderson-2026-10-04/`. Исходники, карты, shared theme/components/lib, локальные assets и package/lock сверены с экспортированной копией перед переносом PDF. Актуальные SHA-256:

- `slides.md`: `0f85c1ddc0aae7502968a22952e6c14677d51a1935c95d0e34dbf3f8521e83c4`.
- `slide-map.json`: `91fef77d722831c6e27b2f61a7bd893ee92b8239201bcd8e7ccf0f4234b12ba6`.
- `Lecture11.pdf`: `5b09b09fc5c64a23a48166b72434aa3fa231589d7b7a6fe7098f7a12561760c1`.
- `Lecture11-handout.pdf`: `407b5f2305007ed8e5f5b0588bb69628b49f4e142aac9b5ddbf6e3545920c53c`.


## Recap: новый denoiser/DDIM раздел предыдущей лекции, 2026-10-11

По запросу автора добавлен статический recap-слайд **9** между общим Sampling 8 и CNF (теперь 10). Содержит additive Gaussian coordinates, score через denoiser, PF-ODE по sigma и DDIM как Euler после нормировки DDPM. Полные выводы training loss и DDIM не повторяются. Первая фраза CNF теперь вводит непосредственное обучение velocity field, как в предыдущей лекции. Повествование: общий score-based Sampling → конкретное поле через denoiser/DDIM → обучение velocity field/CNF → Flow Matching. Заметки различают исходное/нормированное состояние, learned/exact score и тождество дискретных шагов/точное интегрирование. Формулы, источники и нотация согласованы с L10/41–44.

Прежнее утверждение, что новый раздел не требует адаптации рекапа, было результатом неполной проверки: она проверяла точность существующих блоков, но не покрытие новых тем. Теперь `recap-sync` требует обе проверки раздельно, а `lecture-audit` и MIGRATION §7 явно вызывают их. Независимый поведенческий тест скилла на исходном/исправленном рекапе обнаружил пропуск в исходном и подтвердил обе проверки в исправленном. Полные loss/алгоритм/solver детали допускается не повторять. Ретроспектива прошлых границ и оставшиеся задачи: `../recap-coverage-audit-2026-10-11.md`.

Source/map/assets/macros checks (87 macros), `finalize 11` с 59 tests, web build, оба PDF и `render-qa.py` прошли. **37 слайдов / 81 состояние.** Все страницы сравнены с прошлой проверенной редакцией: вне folio **35 handout / 79 steps** попиксельно неизменны; добавлена страница 9, изменена только страница 10 в обоих PDF. Новые/изменённые страницы просмотрены крупно, без overflow/обрезки. Browser QA до и после export: слайды 8–11, 4 состояния; ошибок ресурсов/KaTeX/геометрии нет, 4 возврата с соседнего слайда попиксельно идентичны. 35 экспортных входов и README сверены с изолированной сборкой; тема, макросы, font sizes прежние, проверенный L1 style сохраняется. QA и manifest: `../output/qa/recap-fix-2026-10-11/`.

Основная часть L11, Summary (5 пунктов), Training/Sampling и L12 incoming Recap не менялись; outgoing interface не затронут. Разделы и README/catalog сохраняются. Beamer/merged не менялись. Изменение recap не требует переэкспорта L10 или L12.

SHA-256:

- `slides.md`: `7b113b044521b226264e547ce6c6ad41ca3a1a416623d26940b5e44a3f75a9ca`.
- `slide-map.json`: `e673d6674446b20814053479c04c88929da674efea64ac82e6ff4a7b7f44a756`.
- `Lecture11.pdf`: `ab45530e40008b6f90f34b1c589046fee3e4b36729a6b9057ee43568db0c27e9`.
- `Lecture11-handout.pdf`: `1b1aaa1c85f839867675bb27aee67083b8b4e8a60d0882624b222b05859634c2`.

## Rectified Flow: название и условные/маргинальные траектории, 2026-10-11

По согласованному автором плану выполнены локальные правки без новых слайдов. На 34 после полного вывода loss добавлены название Rectified Flow, ссылка Liu/Gong/Liu 2022 и оптимальное поле как conditional expectation скорости x1−x0. Уточнено: прямые условные training paths не гарантируют прямые ODE trajectories. Обе картинки сохранены и подписаны; высота иллюстраций 115 px, шрифты прежние. Правая подпись сокращена до «ODE trajectories: not necessarily straight», чтобы исключить перенос и сохранить зазор до источников. На 35 изменён заголовок и добавлен источник; формулы и Training/Sampling побайтно прежние. В Summary 37 термин встроен в существующий последний пункт; осталось 5 пунктов.

Повествование L11: 33 даёт target x1−x0 → 34 подставляет его в CFM, называет Rectified Flow и различает conditional paths / marginal ODE → 35 собирает алгоритмы. Формула оптимального поля согласована с posterior-mean identity на 23; notes различают population optimum и приближение конечной сетью. Reflow не вводится. Покрытие нового термина и уточнения синхронизировано с L12 Recap 14–15, fidelity сохранена. Изменение терминологии не меняет разделы и README Materials; карты обновлены для заголовка L11/35, нумерация прежняя. L12 body/Summary/outgoing Recap не затронуты.

Проверки: source checks, 59 существующих тестов, production build и оба экспорта через `finalize 11` прошли. `render-qa.py`: **37 handout / 81 steps**. Все изменённые страницы и состояния обоих PDF просмотрены, плотный L11/34 крупно; переполнений/обрезки нет. Остальные **34 handout / 74 steps** страницы совпадают с предыдущими PDF попиксельно вне folio. Browser inspector до/после экспорта: 14 состояний на слайдах 33, 34, 35, 36, 37; KaTeX/resources/геометрия/обратные клики прошли. Все 4 возврата с соседнего слайда попиксельно идентичны.

Экспорт выполнен в изолированной копии: 76 входов сверены до/после сборки; package.json и tools/run.mjs взяты из проверенного commit 48f50d2e, поскольку параллельная задача регистрирует новые тесты L10. Остальные export inputs и корневой README совпадают с текущими каноническими. Дополнительные тесты параллельной задачи не входят в заявленные 59; shared rendering/theme/export не менялись. Параллельные изменения L10/README/tools не редактировались этой задачей. QA: `../output/qa/rectified-flow-2026-10-11/lecture11/`.

SHA-256:

- `slides.md`: `000a8c77fda938c3a4ffe88fe3c4ab19981dee68cbda8f60ce568c0122e34060`.
- `slide-map.json`: `c531df44efc037c16c2c75b90fb5a681fe3eb2e54cb99680885a965127e41db3`.
- `Lecture11.pdf`: `6d37b6a82cba46349271f16e4b7963bc246383d6f1c1ac06a36de1e7104c958a`.
- `Lecture11-handout.pdf`: `21d31de845ac93d491946dbcfe3c98d21bbeda308fc4566a0b3936bced2e43bd`.

Автор одобрил итоговую версию и явно закрыл пункт Rectified Flow в рефреше, 2026-10-11.


## Исправление FM/CFM и categorical posterior, 2026-10-11

Теорема FM/CFM на слайде 19 теперь утверждает различие objectives на константу, независимую от theta, и совпадение minimizers.

Автор явно разрешил исправить обе ранее отмеченные неточности. При column-stochastic convention likelihood по предыдущим состояниям равен Q_t^top x_t; знаменатель сохранён. FM/CFM share minimizers, но не обязаны иметь равные optimal values. Всего исправлены 3 утверждения (L11/L12) и 5 posterior formulas (L12/L13/L14). Предыдущие записи о сохранении этих inherited defects теперь исторические.

Scoped source review: повторы body/Recap синхронизированы, Summary и Training/Sampling согласованы; разделы, README, карты и reveals не меняются. Beamer и merged не редактировались. Параллельное time-convention уточнение L11/10 сохранено и входит в экспорт L11; отдельная работа L10 не перезаписывалась.

Node 24.19.0, изолированная копия: source/map/macros/assets, 63/63 tests, build и оба PDF прошли. Экспортные входы побайтно сверены с каноническими. PDF: 37 handout / 81 steps; изменены только handout [10, 19] / steps [10, 27, 28], остальные страницы попиксельно прежние. Все затронутые слайды просмотрены; браузер проверил раскрытия, обратное скрытие и геометрию. Нормализация posterior проверена на несимметричной матрице; независимая от theta разность losses — на простом условном распределении.

QA: `../output/qa/math-corrections-2026-10-11/lecture11/`. SHA-256:

- `slides.md`: `45bd6d32cc90ad26acbe5a757320f1cf9bff18a922e0184e34ed4071413712b8`.
- `slide-map.json`: `c531df44efc037c16c2c75b90fb5a681fe3eb2e54cb99680885a965127e41db3`.
- `Lecture11.pdf`: `7cfa56b972b9b71faa665d1146a90b7fbc4b6297a5eeb257df8665c8b8ef0f58`.
- `Lecture11-handout.pdf`: `97b32584ed80b103bb68f0fbe6af38829c4bd8fcb474b5f4308c3f094e705749`.


## Course refresh: явное направление времени, 2026-10-11

По прямому запросу автора в L10/51 (sourceFrame 36) и статичном Recap L11/10 (sourceFrame 8) добавлено одинаковое пояснение до ODE: «Time convention: unlike the diffusion sections, here t=0 denotes noise and t=1 denotes data. Sampling runs forward in time.» Определения концов пути, уравнения, клики и карта сохранены. Уточнение покрыто в следующем Recap и совпадает с основным материалом; новых результатов нет. Summary, Training/Sampling, разделы и README/catalog не требуют правок. Исходный refresh-пункт закрыт.

Проверки в изолированной копии, Node 24.19.0: source/map/macros, 63 штатных теста, production build и оба PDF (`finalize 11`); `render-qa.py` подтвердил 37/81 страниц. Все страницы сравнены попиксельно с экспортами перед правкой; изменённые страницы и состояния просмотрены крупно, переполнений и пересечений с источниками нет. В L10 изменены только handout 51 и steps 109–111 (остальные 54+117 страниц идентичны). В L11 — handout 10/19 и steps 10/27/28 (остальные 35+78 идентичны): параллельная задача исправила формулировку FM/CFM на 19, эта правка сохранена и включена в повторный экспорт L11. Изменения соседних L12–14 принадлежат той задаче.

Browser inspector до/после export: L10/51 — три состояния; L11/10 — одно, L11/19 — три. Геометрия стабильна, обратные клики проходят, content overflow/KaTeX/resource errors отсутствуют; возврат с соседних слайдов попиксельно идентичен. Известные подписи dev-панели L11 отсутствуют в PDF. Shared theme/макросы/размеры шрифтов не менялись; подтверждённая идентичность остальных страниц сохраняет прежнюю проверку стиля L1. 81 экспортный вход сверен перед переносом PDF. QA: `../output/qa/time-convention-2026-10-11/` (manifest и сравнение).

SHA-256:

- `slides.md`: `45bd6d32cc90ad26acbe5a757320f1cf9bff18a922e0184e34ed4071413712b8`.
- `slide-map.json`: `c531df44efc037c16c2c75b90fb5a681fe3eb2e54cb99680885a965127e41db3`.
- `Lecture11.pdf`: `57eb0cbafa24653584fa992c9bd12607ec4903d1ceb2a693e52304399a8d4395`.
- `Lecture11-handout.pdf`: `42385cd34544793491eaf0236749d24612626f5fcdbcd30cc36afce22aab1ae2`.
