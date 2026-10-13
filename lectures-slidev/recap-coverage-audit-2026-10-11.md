# Проверка покрытия обновлённых лекций в Recap, 2026-10-11

## Исправления по решению автора

Все пять пробелов покрытия из исходной таблицы **закрыты 2026-10-11**. Правило автора закреплено в `CLAUDE.md` и `recap-sync`: сначала дополняем существующий слайд по той же теме; новый добавляем только при нехватке читаемого места или смешении разных тем. Числового лимита и массового сокращения рекапов нет.

Номера ниже относятся к текущим логическим слайдам (и handout), а не к страницам PDF с раскрытиями.

| Граница | Восстановленное покрытие | Почему понадобился новый слайд | Размер Recap |
|---|---|---|---|
| L2→L3 | 6: TarFlow после RealNVP на существующем coupling-слайде; **7: dequantization**, bin probability и Jensen bound | Отдельный переход от continuous density к discrete probability с полными формулами перегружал бы слайды AR/coupling | 6→7 |
| L5→L6 | 2: optimal discriminator/JSD; **3: autoencoder → learned latent prior**, VQGAN/KL варианты | Два этапа latent-модели — самостоятельная тема; GAN-слайд уже содержит objective, optimum и mode collapse | 9→10 |
| L7→L8 | 3: marginal, SNR/log-SNR; **7: ε/x₀/score/v**, полные targets/inverses и различие весов MSE | Полная таблица не помещается на имеющиеся слайды ELBO или Training/Sampling без потери читаемости | 6→7 |
| L8→L9 | **8: полный DDIM Sampling**; 10: guidance interval; 13: guidance distillation | DDIM нужен собственный цикл с сеткой, clean estimate и update; guidance дополнен на соответствующих существующих слайдах | 11→12 |
| L9→L10 | 2: Euler/Heun global error/NFE; 5: Hutchinson; **6: CNF Training/Sampling** | Два полных алгоритма не помещаются рядом с continuity equation и trace estimator | 6→7 |

**Coverage:** все перечисленные основные результаты теперь представлены. **Fidelity:** формулы и алгоритмы сверены с телами предшествующих лекций, включая полные DDIM/CNF циклы; независимая перекрёстная проверка выполнена субагентами. Добавленные слайды проверены по связи с предыдущим/следующим и внутренней последовательности. Доказательства, галереи и интерактивные примеры в Recap не дублируются.

От первого Outline до конца каждого из пяти исходников текст побайтно совпадает с версией до этой задачи: основная часть, Summary и разделы не изменились. Поэтому дополнительных изменений исходящих Recap и README schedule не требуется. Карты слайдов обновлены. Ранее исправленный L11 сохранён.

Сборки, 59 существующих тестов, оба PDF каждой лекции и визуальная проверка всех изменённых/новых страниц прошли. Сравнение всех страниц с предыдущими PDF: **203 страницы handout и 475 страниц steps** вне содержательных правок совпадают попиксельно, кроме folio. Свежая проверка браузером охватывает 31 состояние изменённых и соседних слайдов; все 28 возвратов с соседнего слайда попиксельно идентичны. Подробные результаты и SHA-256 — в `lectureN/migration.md`; QA — `output/qa/recap-fill-2026-10-11/`.

Ниже сохранён исходный аудит как история обнаружения пропусков. Его статусы `missing`, прежние номера слайдов и ссылки на строки описывают состояние **до исправлений**.


### Последующее правило показа Recap

После содержательных исправлений автор установил: каждый recap-слайд открывается целиком, без постепенного раскрытия. Проверены все 106 recap-слайдов Slidev; оставшиеся раскрытия сняты с L3/8, L5/8, L6/6, L7/7, L9/7 и L12/17. Содержание и номера логических слайдов не менялись. Новые числа состояний и SHA-256 — в последних записях соответствующих migration journals. Обновлены шесть PDF с раскрытиями; все раздатки попиксельно совпадают со свежими экспортами. QA: `output/qa/recap-static-2026-10-11/`.

### Проверка перед commit/push

TarFlow по решению автора перенесён с L3/5 после RealNVP на **L3/6**, без нового слайда. Все накопленные изменения L3/5/6/7/8/9/10/11/12 проверены независимыми source-аудитами: incoming coverage/fidelity, outgoing Recap, Summary, повторяемые формулы/алгоритмы, Outline/Materials и каталог. Основные части девяти лекций от первого Outline побайтно прежние. Исправлены устаревшие номера демонстраций в Slidev README для L3/L6/L8/L9. Ранее просмотренные PDF остальных лекций сверены с актуальными source/map/PDF хешами; L3 пересобрана и проверена после переноса.

Отдельное унаследованное замечание вне текущих правок: L11 body и L12 Recap называют равными оптимальные значения FM/CFM; корректно говорить об одинаковых минимизаторах/градиентах (loss values отличаются θ-независимой константой). Текущие изменения этой формулировки не касаются; она сохранена как отдельная содержательная задача. Подробные source-отчёты сохранены в локальном QA `output/qa/tarflow-recap-2026-10-11/`.

## Исходная проверка до исправлений

Проверены девять границ **L1→L2 … L9→L10** в текущем Slidev на HEAD `3b55fdcb`: тела лекций, Outline, Summary, фактические Recap, история содержательных изменений с первичной миграции, migration journals и принятые решения refresh report. Это **проверка исходников**, не новая визуальная проверка всех прошлых PDF. Beamer не изменяется. Отдельно исправлена текущая граница **L10→L11**: добавлен recap-слайд 9 о denoiser/PF-ODE/DDIM, открытие CNF перенесено на 10 и уточнено.

**Результат:** на пяти из девяти предыдущих границ есть новые основные результаты, не представленные в Recap. Существующие повторяемые формулы согласованы; это не устраняет пропуски покрытия. Для L1→2, L3→4, L4→5, L6→7 существенных пробелов покрытия не найдено. Ранее выданные заключения «Recap согласован» в смысле полноты для пяти отмеченных границ этой проверкой пересмотрены.

| Граница | Пропущенное содержание | Предлагаемый объём исправления |
|---|---|---|
| **L2→L3** | Uniform dequantization и нижняя оценка дискретного likelihood; TarFlow как patchwise AR flow с Transformer | Краткий результат dequantization и компактное продолжение AR/coupling recap; без галерей |
| **L5→L6** | Оптимальный discriminator и minimax→JSD; perceptual/adversarial autoencoder и второй этап обучения latent prior | Теорема без доказательства; краткая схема двух этапов |
| **L7→L8** | SNR/log-SNR; ε/x₀/score/v как обратимые параметризации с разными весами plain MSE | Дополнить forward-marginal/parameterization recap, без повторения интерактивных демо |
| **L8→L9** | Deterministic DDIM; guidance interval и guidance distillation | В первую очередь короткий DDIM Sampling/result; дополнить CFG recap выводами об interval и числе network evaluations |
| **L9→L10** | CNF Training/Sampling; точность Euler/Heun и NFE; Hutchinson trace estimator | Обновить существующие ODE/density слайды и добавить компактное напоминание алгоритма |

Приоритет восстановления: DDIM в L9 и CNF algorithms в L10; затем главные новые теоретические результаты и параметризации. TarFlow и modern guidance тоже являются явно добавленными takeaways, но объём повторения можно ограничить одной связкой/фразой. Отсутствие отдельных иллюстраций, доказательств и GP/SN-комментария ниже обосновано отдельно. Это рекомендации проверяющих, а не приписанное автору согласие на исключение. На момент исходного аудита предыдущие лекции ещё не редактировались. После явного запроса автора все пять пунктов исправлены; актуальное покрытие приведено в таблице выше.

## Почему прежний скилл пропускал изменения

Старый `recap-sync` начинал с существующих блоков Recap и искал им соответствия в предыдущей лекции. Для новой темы, которая вообще не попала в Recap, ни один пункт этой проверки не запускался. Последний абзац предлагал лишь отметить возможную смену акцентов. В итоге совпадение формул ошибочно превращалось в заключение о полной синхронизации.

Теперь скилл сначала строит **body→recap mapping** для новых разделов/методов/параметризаций/алгоритмов/основных выводов. Статусы: covered, missing, intentionally omitted с конкретной причиной и разделением решения автора от рекомендации проверяющего. Затем отдельно проверяется **recap→body fidelity**. Неизменность исходника/хешей доказывает версию проверенного материала, но не достаточность покрытия. Обновлены также вызывающий `lecture-audit` и MIGRATION §7, чтобы аудит не считался пройденным только по точности формул.

Штатный `skill-creator/scripts/quick_validate.py` прошёл для обоих изменённых skills. Валидатор проверяет структуру, а не семантику; поведенческой проверкой служат независимые ревизии девяти границ ниже и отдельное сравнение исходного/исправленного L11 Recap.

## Детальные исходные проверки

# Retrospective Recap audit: L1→2, L2→3, L3→4

Source-only, report-only, 2026-10-11. Inspected current Slidev bodies, Outlines, Summaries, successor Recaps, maps, migration journals and refresh report. No source edits/builds/PDF/browser claims. Paths below use repository `/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course`.

## Baseline/history examined

- L1: first committed Slidev `c019545f`; subsequent `43ad0da7`, `2c4de1d7`; journal sections 2026-09-11 on overview additions, course tricks and terminology, 2026-09-19 finalization. Some accepted refresh material already exists in first commit; journal supplies its provenance.
- L2: initial migration `c5350780` to current, including `1e9fe84a` (TarFlow/refresh), `579a9fdb` (blockwise/dequantization), `d0d81c4f`. Read journal 2026-09-13/14 refresh and 2026-09-22 addition/consolidation; refresh report L2 decisions.
- L3: initial migration `bb14aef7` to current, including `1e9fe84a`, `fed440a0`, `2179120a` (VAE boundary restoration), `30b27b4c` (Recap synchronization); current L4 Recap after `1f456d81`. Read L3 journal and refresh report decisions.
- Earlier agent assertions “no recap change needed” were not treated as author decisions. In particular, L2 journal lines 638–710 claims the continuous CoV interface is unchanged, which establishes fidelity only.

## Findings: coverage

### 1. Missing uniform dequantization takeaway in L3 Recap

Body: L2 slide 28, [slides.md:951](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture2/slides.md:951); new Summary takeaway at slide 35, [slides.md:1252](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture2/slides.md:1252).

The body distinguishes discrete bin probability from continuous density and derives the uniform-noise Jensen lower bound. L3 Recap slides 2–7, [slides.md:45](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture3/slides.md:45), recall only continuous CoV/NF likelihood and LVM marginalization: no discrete mass, bin integral, dequantization or lower-bound qualification appears. This is a new explicitly summarized result, relevant to the coming Jensen/ELBO discussion, not merely a modern example.

Concrete remedy: concise Recap block with `P_theta(x)=integral_[0,1)^m p_theta(x+u)du` and `log P_theta(x)>=E_u log p_theta(x+u)`, labelled continuous density versus discrete probability. It need not repeat the entire original derivation. No explicit author decision to omit this result was found.

### 2. Missing TarFlow connection in L3 Recap

Body: L2 slides 26–27, [slides.md:846](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture2/slides.md:846) and [slides.md:918](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture2/slides.md:918); new Summary takeaway slide 35, [slides.md:1251](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture2/slides.md:1251).

Current L3 Recap slide 5 [slides.md:164](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture3/slides.md:164) covers scalar Gaussian AR, and slide 6 [slides.md:199](/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture3/slides.md:199) covers RealNVP. Neither recalls the newly emphasized connection: affine transforms on whole patches conditioned on their strict prefix; Transformer predicts shifts/scales while the flow retains a triangular Jacobian. This method now names the revised “Blockwise Flows (RealNVP / TarFlow)” subsection and has its own Summary takeaway. No author-approved exclusion was found.

Concrete remedy: a short continuation of the AR/RealNVP recap explaining the patchwise combination, causal Transformer parameter predictor, and sequential sampling across patches versus parallel density evaluation. No need to repeat architecture diagram or generated-image gallery.

## Coverage inventory: L1→L2

| Current teaching unit and changed material | Body location | Disposition in L2 Recap |
|---|---|---|
| Generative/discriminative distinction; logistics | L1:4–9, lines 75–234 | Intentionally omitted **reviewer recommendation**, not an explicit author exclusion: motivation/admin information is not a technical prerequisite for NF. |
| Taxonomy and model-family overview; added AI Index/LLMs, LLaDA, Genie; revised Sora/Nano Banana | L1:11–22, lines 285–460; Summary:1130 | Intentionally omitted **reviewer recommendation** for individual examples: contextual gallery, not new algorithms taught here. Family taxonomy is revisited in L2:8/line220, outside Recap. No missing core algorithm. |
| Course tricks: log derivative, Jensen, Monte Carlo, LOTUS, CoV; refined conditions/order | L1:25–27, lines 514–602 | Intentionally omitted from Recap **reviewer recommendation**: standard prerequisite toolbox; relevant CoV is fully reintroduced in L2:9/line230. No need to replay all proofs. |
| Problem statement, density estimation, sampling/evaluation; histogram demo | L1:29–30, lines659–697 | Covered L2:2/line44. Histogram control/example intentionally omitted as illustration. |
| Conditional models | L1:31/line745 | Intentionally omitted **reviewer recommendation**: short extension of problem statement, no conditional-flow method required in L2. |
| Divergence minimization; forward/reverse KL; MLE equivalence | L1:33–35, lines787–871 | Covered L2:2–3/lines44,84. |
| AR factorization, MLE and ancestral sampling; added sampling/density demo | L1:38–40, lines938–1014 | Covered L2:4/line124: both joint/log factorization and sequential Sampling. Demo not repeated; key results retained. |
| MLP/LLM/ImageGPT implementations | L1:41–44, lines1030–1118 | Covered L2:5/line158 for MLP and ImageGPT, including figures/sources. Individual LLM illustration reasonably omitted; shared AR idea covered. |

No actionable missing core coverage found on L1→L2. All six current Summary takeaways have a disposition above.

## Coverage inventory: L2→L3

| Current teaching unit / substantive refresh | Body location | Disposition in L3 Recap |
|---|---|---|
| CoV, Jacobian, NF definition/composition/MLE, exact continuous density | L2:9–14, lines230–444 | Covered L3:2–4/lines45,95,126. Determinant demo illustrative, not needed separately. |
| Linear NF; compressed LU/QR, determinant-sign caveat, direct factor learning | L2:17–18, lines542–597 | Covered L3:4/line126 by structured factors, nonzero diagonals and direct learning. Topological explanation is reasonably omitted proof detail. No stale detailed LU/QR derivation retained. |
| Gaussian AR and parallel/sequential directions | L2:20–21, lines663–716 | Covered L3:5/line164 with both transforms, triangular Jacobian and computation directions. |
| RealNVP coupling/Jacobian; interactive example | L2:23–25, lines744–834 | Covered L3:6/line199; demo reasonably omitted. |
| NEW TarFlow patchwise/Transformer construction, revised named subsection and Summary | L2:26–27/lines846,918; Summary1251 | **Missing**, finding 2. Gallery L2:29/1010 can remain omitted as illustration. |
| NEW uniform dequantization/bin mass/Jensen bound and Summary | L2:28/line951; Summary1252 | **Missing**, finding 1. |
| NEW NF outlook: computation limits → LVM and later CNF/FM | L2:30/line1051; Summary1248 | Covered immediate limitation/next step via L3:4 determinant challenge and L3:7 marginalization. CNF/FM forward pointer intentionally omitted **reviewer recommendation**, as later context rather than new prerequisite theorem. |
| Revised Bayesian introduction; removed MAP branch | L2:32/line1105 | Covered relevant latent-model prior/likelihood/evidence roles in L3:7/line249; no stale MAP. General Bayes formula omission is inherited/reasonable: L3 derives the posterior relation explicitly in its ELBO body. |
| LVM joint/marginal/decoder/prior; MoG/PCA examples | L2:33–34/lines1154,1203 | Covered L3:7/line249. MoG/PCA examples intentionally omitted **reviewer recommendation**, as optional concrete instances. |

Two new Summary takeaways remain unrepresented; continuous-formula fidelity does not close them.

## Coverage inventory: L3→L4

| Current teaching unit / substantive refresh | Body location | Disposition in L4 Recap |
|---|---|---|
| MLE for LVM; corrected naive MC interpretation as lower bound | L3:10/line330 | Covered L4:2/line47, including title “A Naive Lower Bound” and Jensen inequality. Detailed explanation of prior samples omitted, not a new method. |
| ELBO derivations, exact posterior KL gap, optimal q, reconstruction−regularization, NEW consolidation slide | L3:12–16/lines381–576 | Covered L4:2–4/lines47–141: gap identity, decomposition, q optimum and joint optimization. No need to repeat both derivations or demo. |
| Amortization/shared encoder; NEW explanatory slide; revised restricted-family caveat | L3:18–21/lines640–768; Summary1178 | Covered L4:4/line141 through parametric q_phi(z|x), joint update, with gap recalled on2–3. Nonzero restricted-family gap is supported by the recalled gap and restriction, though a one-line reminder could improve clarity; no false claim of tightness for restricted q. No new slide necessary. |
| Theta/phi gradients, Gaussian reparameterization, general transform; improved order/network-role explanation | L3:23–26/lines828–974 | Covered L4:5/line186 with both gradients, Gaussian g_phi, and L4:7 encoder parameter roles. Intermediate proof and removed fixed-noise demo need not recur. |
| MOVED VAE section: architecture, Training/Sampling, encoder unnecessary during generation | L3:27–31/lines1026–1133 | Covered L4:6–7/lines235,290. Training/Sampling verbatim apart from reveal markup; encoder/decoder roles explicit. |
| MOVED VAE vs NF special-case comparison | L3:32/line1149 | Intentionally omitted **reviewer recommendation**: bridge/comparison, not a Summary takeaway nor prerequisite to ELBO surgery/VQ-VAE. No recorded author exclusion; this is a justified recap selection, not a reported regression. |

No actionable missing core coverage found on L3→L4. The moved VAE section was actually propagated; all five current Summary takeaways are represented.

## Fidelity checks, separately

- L1→2: problem/divergence definitions, KL directions, MLE, AR indices/product/log, ancestral ordered steps agree. MLP/ImageGPT figures and attribution match; `sequential_MLP.png`, `pixelcnn1.png`, `imagegpt.png` SHA-256 equal across local copies.
- L2→3: CoV assumptions/determinant directions, composition/log-likelihood, structured factors, Gaussian AR transformations, coupling/Jacobian, and LVM joint/marginal formulas agree. `flows_how2.png` SHA-256 equal. The revised MAP removal leaves no orphan Recap claim.
- L3→4: ELBO/gap/decomposition, unrestricted variational optimum, parametric posterior, joint update, gradient/reparameterization, VAE Training/Sampling and roles agree. `VAE.png` and `vae_scheme.png` SHA-256 equal; recap figure citations retained.
- No introduced formula/algorithm/figure-provenance mismatch found in the selected interfaces. This does **not** upgrade L2→3 coverage to a pass.
- No rendered typography/layout review, no exports, no source/PDF freshness certification in this task.


---

# Retrospective recap coverage audit: Slidev L4→5, L5→6, L6→7

Date: 2026-10-11. Read-only source review; no edits/builds/browser/PDF review.
Root: `/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/`.
All source references below are relative to this root, with current logical slide numbers and one-based lines.

## Scope and historical baseline

Read the updated recap-sync coverage/fidelity workflow, shared formats, lecture-audit, current bodies/Outlines/Summaries and actual successor Recaps. Reviewed the relevant migration journals and refresh-report L4–L6 decisions, plus Git history from initial Slidev migrations `19e673be` (L4) and `371925f5` (L5–8) through current HEAD. Key substantive commits: `2179120a` (boundaries), `7394b122` (blurriness/learned VQ prior), `871f963b` (spatial VQ/collapse), `61d20d30` (modern latent/evaluation/score additions), `1984a580` (DSM proof), `d7326782` (GP/SN), `03c80b41` (Wasserstein properties), `4baae66e`/`61f4ee3d` (evaluation), `30b27b4c` (recap sync), `1f456d81` (current boundaries). Interactive/typographic refresh was distinguished from new teaching results.

Earlier journal statements saying no recap extension was required were NOT treated as author decisions. Explicit author decisions constrain the amount of content taught (e.g. two short GP/SN sentences, limited modern-tokenizer examples); they do not automatically approve omitting it from recap.

## Findings: coverage

### Missing core GAN optimality result in L6 recap

- Body: L5 slides 12–15, `lectures-slidev/lecture5/slides.md:428`, especially optimal discriminator at line 457 and `V(G,D*)=2 JSD−2 log 2` at line 506. Current Summary slide 50 explicitly recalls this at line 1853.
- Successor: L6 Recap slides 2–3, `lectures-slidev/lecture6/slides.md:46` and `:71`, repeats the minimax objective, mode collapse and the disjoint-support special case. None of its slides 2–10 recalls the optimal discriminator or the minimax/JSD relationship. The isolated JSD=log2 statement is not coverage of that theorem.
- History: GAN optimality was moved into the L5 body in `1f456d81`; its premature L5 recap copy was removed, but its result was not placed in the next recap.
- Disposition: **Missing.** This is the main theoretical conclusion of a restored core section and Summary bullet, rather than a proof detail. A compact recap statement with the discriminator formula and resulting JSD objective would suffice; repeating the proof/demo is unnecessary. No explicit author decision to omit this result was found.

### Missing modern latent-generation takeaway in L6 recap

- Body: L5 slides 20–21, `lectures-slidev/lecture5/slides.md:700` and `:760`: perceptual versus learned adversarial reconstruction losses; VQGAN/AR code prior versus KL-autoencoder/latent diffusion prior; freeze the autoencoder before fitting the latent distribution. Current Summary slide 50, line 1854, explicitly includes this teaching unit.
- Successor: the complete L6 recap is lines 46–361 / slides 2–10. It moves from GAN/WGAN to evaluation with no autoencoder, VQGAN, perceptual/adversarial reconstruction, or learned latent-prior representation.
- History: this new two-slide block was accepted and moved from L4 to L5 in September (`61d20d30`; journal `lecture5/migration.md:150`; refresh report L4 item 4). The author limited its scope but did not decide to exclude it from recap.
- Disposition: **Missing.** This is a deliberately added modern-use takeaway and a current Summary bullet, not merely the figure illustrating it. One short recap block could retain the two-stage idea and distinguish the roles of perceptual features, discriminator and generative prior. No need to reproduce both full slides.

## Full teaching-unit inventory and dispositions

“Intentionally omitted — recommendation” below means this review judges omission pedagogically reasonable; it is NOT an existing explicit author decision.

### L4 → L5

| Current teaching unit / body location | Disposition and successor evidence |
|---|---|
| ELBO surgery, marginal/conditional KL and optimal aggregated prior: L4 slides 10–14, `lecture4/slides.md:364`–`:549`; revised meaning of matching prior | **Covered:** L5 recap 2–3, `lecture5/slides.md:49`, `:59`, `:74`, `:96`. Both surgery identity and conditional-KL versus marginal-KL distinction appear. |
| New GenFirst / reconstruction-versus-generatability illustration: L4 slide 15, `lecture4/slides.md:551` | **Intentionally omitted — recommendation:** general learned-prior/aggregated-posterior principle is already recalled on L5 slides 2/5; this named example and joint-training illustration are not prerequisites for L5 GAN/WGAN/evaluation. No explicit author omission decision found. |
| Revised Gaussian decoder optimum and averaging explanation: L4 slides 16–17, `lecture4/slides.md:641`, `:681`; Summary bullet 2 | **Covered:** L5 slide 3, `lecture5/slides.md:97`, states the conditional mean, overlap/averaging and fixed-encoder assumptions. |
| Discrete latents, categorical/uniform-prior KL, vector quantization: L4 slides 19–24, `lecture4/slides.md:733` onward | **Covered:** L5 slide 4, `lecture5/slides.md:115`–`:151`. |
| New spatial code maps, codebook collapse and straight-through: L4 slides 23–26; Summary straight-through bullet | **Covered:** L5 slides 4–6, `lecture5/slides.md:149`, `:163`, `:190`, `:215`. |
| New second-stage learned VQ prior and full generation algorithm: L4 slides 27–29, `lecture4/slides.md:1025`, `:1084`; Summary bullet 3 | **Covered:** L5 slides 5–6, `lecture5/slides.md:199`, `:215`, `:269`. Recap states fitting the aggregated posterior and samples from learned prior; separate AR factorization/MLE derivation need not repeat. |
| VQ-VAE-2 sample showcase, L4 slide 28, `lecture4/slides.md:1065` | **Intentionally omitted — recommendation:** illustrative examples of the already covered learned-prior mechanism, no additional method needed by L5. |
| Likelihood versus sample quality, likelihood-free matching, introductory minimax GAN: L4 slides 31–34, `lecture4/slides.md:1190`, `:1239`, `:1280`, `:1320`; Summary last 2 bullets | **Covered:** L5 recap 7–8, `lecture5/slides.md:305`, `:325`, `:345`, `:362`. |
| GAN optimality removed from L4 in latest boundary change | **Correctly absent** from L5 recap; it now belongs to L5 body. Its successor coverage is the finding above. |

L4 Summary slide 35 has 6 bullets; each is represented in L5 recap. No core coverage gap found for this boundary.

### L5 → L6

| Current teaching unit / body location | Disposition and successor evidence |
|---|---|
| GAN optimal discriminator/JSD/global optimum: L5 slides 12–15, lines 428–568 | **Missing:** first finding above; Summary bullet 1 only partly covered. |
| Parametric GAN objective, training difficulty and mode collapse: L5 slides 16–17, `lecture5/slides.md:585`, `:618` | **Covered:** L6 slides 2–3, `lecture6/slides.md:50`, `:61`, `:84`. Alternating-training illustrations need not repeat. |
| KL/JSD mode covering/seeking examples and discriminator demo: L5 slides 13/18/19, `lecture5/slides.md:478`, `:642`, `:684` | **Intentionally omitted — recommendation:** supporting examples, with minimax/mode collapse and disjoint-support comparison retained. This does not excuse omission of the core optimality result. |
| New VQGAN/perceptual-adversarial autoencoders and two-stage latent generation: L5 slides 20–21, lines 700/760; Summary bullet 2 | **Missing:** second finding above. |
| Wasserstein transport definition, support mismatch and revised continuity/convergence properties: L5 slides 23–27, `lecture5/slides.md:855`, `:892`, `:916`, `:1027` | **Covered:** L6 slides 3–5, `lecture6/slides.md:84`, `:112`, `:142`, `:152`; conditions and one-way implication retained. |
| KR duality, critic objective and clipping: L5 slides 29–32, `lecture5/slides.md:1090`, `:1182`; Summary bullet 3 | **Covered:** L6 slide 6, `lecture6/slides.md:188`–`:218`. |
| New two-sentence GP/SN alternatives: L5 slide 31, `lecture5/slides.md:1216` | **Intentionally omitted — recommendation:** bounded practical aside, not a standalone new section/Summary result or prerequisite for score models. Author explicitly limited body addition to two sentences, but did not explicitly decide recap omission. Could add one phrase if modern-practice recall is desired; not a core missing-coverage defect. |
| Transport-plan bridge to future FM, truncation and interactive examples | **Intentionally omitted — recommendation:** illustrative/forward-reference details; transport plan and precision–recall concepts already covered. |
| Quality axes: fidelity/coverage/alignment, L5 slide 34, `lecture5/slides.md:1276` | **Covered across recap:** L6 7–10 recalls distributional metrics, precision/recall, prompt/preference/composition and human criteria. No separate copy of the introductory example slide needed. |
| FID and new MMD/CMMD: L5 slides 36–40, `lecture5/slides.md:1366`, `:1479`, `:1529`; Summary bullet 4 | **Covered:** L6 slide 7, `lecture6/slides.md:230`, `:246`; correct embedding/Gaussian assumptions, kernel expectation formula. RKHS derivation can remain omitted. |
| Precision/recall and quality-diversity trade-off: L5 slides 42–44, `lecture5/slides.md:1580`; Summary bullet 5 | **Covered:** L6 slide 8, `lecture6/slides.md:266`. |
| New CLIP versus preferences versus compositionality; preference score optimization caveat: L5 slides 46–47, `lecture5/slides.md:1692`, `:1755`; Summary bullet 6 | **Covered:** L6 slide 9, `lecture6/slides.md:294`–`:325`, including PickScore formula, compositional metrics and score-exploitation caveat. |
| Human evaluation / updated Alice example: L5 slide 49, `lecture5/slides.md:1818` | **Covered:** L6 slide 10, `lecture6/slides.md:334`; same local image and provenance. |
| EBM/Langevin removed from L5, restored to L6 body | **Correctly absent** from L6 recap; covered in L6 core section and next recap as below. |

L5 Summary slide 50 has 6 bullets. Bullet 1's JSD conclusion and all of bullet 2 are missing; bullets 3–6 are covered.

### L6 → L7

| Current teaching unit / body location | Disposition and successor evidence |
|---|---|
| Restored Langevin section / approximate sampling from gradients+noise: L6 slides 13–15, `lecture6/slides.md:399`, `:439`; Summary bullet 1 | **Covered at algorithm/result level:** L7 slide 2, `lecture7/slides.md:48`–`:69`, score-based Langevin update. EBM partition-function cancellation is omitted as motivation; reviewer recommendation is to keep concise, not an author omission decision. EBM is explicitly constrained to motivation in refresh report. |
| Score function/Fisher divergence and normalization independence: L6 slides 18–20, `lecture6/slides.md:521`, `:552`, `:583`; Summary bullet 2 | **Covered:** L7 slide 2, `lecture7/slides.md:50`, `:54`; score definition and Fisher objective. Normalization derivation not a separate recap requirement. |
| DSM corruption, theorem, estimable conditional target and compressed proof: L6 slides 22–27/30, `lecture6/slides.md:637`, `:682`, `:782`, `:895`; Summary bullet 3 | **Covered:** L7 slides 3–5, `lecture7/slides.md:83`, `:115`, `:154`. The theorem states the theta-independent constant; the proof is intentionally omitted — reviewer recommendation, standard recap compression. |
| New Tweedie/MSE conditional-mean link and noise prediction: L6 slide 28, `lecture6/slides.md:943`–`:980`; Summary bullet 4 | **Covered:** L7 slide 4, `lecture7/slides.md:139`–`:149`, recalls exact clean conditional mean and MSE interpretation with citation. It does not reproduce the equivalent noise-mean identity, but captures the core parameterization link; the latter follows immediately from x_sigma=x+sigma epsilon. No separate missing teaching unit. |
| New conditional-score/Tweedie demo: L6 slide 29, `lecture6/slides.md:992` | **Intentionally omitted — recommendation:** visual explanation of already recalled DSM/Tweedie result. |
| Multiple noise levels, NCSN, weighted objective, Training/annealed Langevin: L6 slides 32–35, `lecture6/slides.md:1076`, `:1111`, `:1150`, `:1177`; Summary bullet 5 | **Covered:** L7 slides 5–7, `lecture7/slides.md:167`, `:190`, `:216`–`:244`, including weighting and two-index sampling. New one-sentence historical positioning is optional context, not a missing method. |
| Forward Gaussian diffusion transition, closed-form marginal and Gaussian limit: L6 slides 38–42, `lecture6/slides.md:1226`, `:1288`, `:1352`; Summary bullet 6 and first half of 7 | **Covered:** L7 slides 8–9, `lecture7/slides.md:256`, `:270`, `:294`; marginal and terminal distribution recalled. Closed-form proof/demo need not repeat. |
| DSM also applies to diffusion marginals: L6 slide 43, `lecture6/slides.md:1413`–`:1459`; second half of Summary bullet 7 | **Covered compositionally:** L7 recap recalls general Gaussian-kernel DSM and the diffusion Gaussian marginal. It does not copy the specialized conditional-score formula; same theorem applies and score parameterizations are developed later in L7. Reviewer recommends keeping this concise. |

L6 Summary slide 44 has 7 bullets; all main teaching results have recap representation. No core coverage gap found for this boundary.

## Fidelity, independently of coverage

Existing L4→L5 surgery, optimal prior, fixed-encoder blurriness assumptions, discrete KL/spatial quantization, straight-through, learned VQ prior/Training/Sampling, likelihood-free and minimax formulas agree. L5→L6 existing GAN objective, support assumptions, Wasserstein properties/duality/critic, FID/CMMD, precision–recall and preference formulas agree. L6→L7 score/Fisher, DSM theta-independent constant, Gaussian target, Tweedie, weighted NCSN Training/Sampling and forward Gaussian equations agree. No new source-level fidelity drift was found. This does not turn the two coverage gaps into a pass.

All repeated recap images checked byte-for-byte: L4→5 1 image; L5→6 4 images; L6→7 6 distinct images, all identical. No new rendered typography review was performed. Existing scientific caveats not introduced by recap synchronization were not expanded into this coverage report.

Current source SHA-256:
- L4 `80cb1b06495e09879ab666d7b43221b13159e1df4d0196b16716787553157ad9`
- L5 `07d7550e5ae14f148ba72046fba3fb352bc0708fd93eecc94eec5a772eaf5182`
- L6 `1f71a4f87fc866d108924faae6b0a41cf1e833ae8f8b732f167ed81599444aca`
- L7 `b8b69e91aa7f6cd0057cc0225b709f9c7b625e22b5110989a7011c358a03e55a`


---

# Retrospective recap coverage audit: L7→8, L8→9, L9→10

2026-10-11. Read-only source review; no source/PDF/build changes. All locations below are under `/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/`; `L7:585` means `lecture7/slides.md:585`. Slide numbers are current slide-map numbers (L7 41, L8 42, L9 41, L10 50).

## Baseline and evidence

Reviewed current complete teaching units/Outline/Summary and complete successor recaps; compared substantive refresh history to original Slidev migrations `371925f5` (L7/L8) and `f8b37b6f` (L9), including redistribution `2179120a`, SNR `fee73074`, guidance/parameterizations `a99c1ff9`, ODE refresh `20918961`, DDIM `1f433893`, noise-coordinate bridge `3b55fdcb`. Read corresponding dated migration entries and refresh-report L7–9 (lines 214–271). Changes to recap skills were read explicitly. Old statements “recaps remain consistent/approved/no expansion required” are verification claims, not demonstrated author decisions to omit new units. No explicit author decision to exclude the missing units listed below was located.

Prior fidelity-only findings cannot certify coverage. No need to copy every figure, derivation or demo; proposed repairs should mostly replace older repeated recap content with compact takeaways.

## L7→L8: coverage inventory

| L7 teaching unit | L8 recap representation | Disposition |
|---|---|---|
| Reverse process, Gaussian approximation only for small beta (12–15, L7:345–464) | 2–4, L8:47–126; small-beta caveat now present | Covered, including refreshed caveat. Historical T=1000 is illustrative and need not repeat. |
| Conditional reverse Gaussian vs intractable reverse kernel (16–18, L7:470–578) | 4, L8:105–126 | Covered. Conditional-demo example is intentionally omitted in the pedagogical sense (reviewer recommendation, no author omission ruling); core distinction retained. |
| **SNR/log-SNR noise coordinate** (new 19, L7:585–633; Summary first bullet L7:1414) | No SNR or log-SNR in recap 2–7, L8:47–211 | **Missing new core takeaway.** Gaussian coefficients alone do not recall their ratio, log-SNR meaning or schedule interpretation. Add compact definition and noise-coordinate interpretation near forward marginal; do not reproduce schedule demo/high-resolution heuristic. |
| Diffusion as hierarchical VAE/fixed encoder (21–22, L7:659–727) | 5, L8:136–148 | Covered. |
| ELBO decomposition/Gaussian mean squared-error loss (24–30, L7:752–1082) | 6–7, L8:159–211, plus own opening DDPM/score body 10–12 | Covered at result/algorithm level. Full Bayes/telescoping proof deliberately omitted from recap (reviewer recommendation); no missing proof finding. |
| **Equivalent epsilon/clean/score/v outputs; unequal plain-MSE weights** (new 35, L7:1209–1259; Summary sixth bullet L7:1419) | 7, L8:187–211 recalls only epsilon DDPM recipe. L8 body 10–11 later derives noise→score but no full takeaway | **Missing new core takeaway.** Existing recipe does not recall the alternatives or difference of weighting. A compact conversion/result reminder can prepare DDPM↔DSM and DDIM without reproducing interactive demo. |
| DDPM simple noise loss/ancestral sampling (36,39–40, L7:1268–1403) | 7, L8:187–211 | Covered. |

Fidelity: matched reverse Gaussian/conditional Gaussian, VAE factorization, decomposed ELBO, and DDPM Training/Sampling. No new formula mismatch found. Coverage does not pass because the two new Summary takeaways are absent. Source refinements/demos introduced since migration do not each require a new recap item.

## L8→L9: coverage inventory

| L8 teaching unit | L9 recap representation | Disposition |
|---|---|---|
| DDPM↔DSM objective/noise-score identity and DDPM vs NCSN samplers (10–12,14–16; L8:249–491) | 6–7, L9:167–239; DDPM algorithm 5, L9:133–158 | Covered. Same inherited shorthand concerning equivalence/weights is present on both sides; this audit did not silently rewrite it. |
| **DDPM→additive-noise rescaling** (new 13, L8:355–388; Summary L8:1467) | 7, L9:207–239 explicitly says divide by sqrt(alpha_bar_t) | Covered as a concise conceptual result. Repeating the entire new derivation is unnecessary. |
| **DDIM deterministic sampler, shorter grid without retraining, randomness in initial latent** (new 17–19, L8:499–681; Summary L8:1468) | No DDIM anywhere in L9 recap 2–12, L9:44–399 | **Missing new core method and algorithm.** Strongest omission at this boundary. One compact Sampling/result slide should recall clean estimate→reweighted update, reused predictor/grid and initial-noise randomness. Gaussian coupling toy example need not repeat. Important bridge from discrete diffusion sampling to deterministic ODEs, later explicitly used in L10 DDIM/ODE derivation. |
| Conditional models and guidance motivation/examples (21–25, L8:754–895) | Guided-generation setting on 8–12, L9:248–399 | Covered conceptually; label/text pictures intentionally omitted (reviewer recommendation). |
| Classifier guidance, Bayes split, scale, noisy classifier Training/Sampling (27–33, L8:918–1144) | 8–10, L9:248–343 | Covered. Guidance demos need not repeat. The newer fixed-noise interpretation/large-gamma diversity caveat (L8:1068–1085) is absent in L9:305–309; recommend incorporating it into a compact modern-guidance reminder, not a separate slide solely for the caveat. |
| CFG affine combination, label dropout, two evaluations (35–39, L8:1166–1327) | 11–12, L9:351–399 | Covered. |
| **Guidance interval** (new 40, L8:1338–1364; fifth Summary takeaway L8:1471) | No interval statement in recap | **Missing part of revised main takeaway.** Lower priority than DDIM; brief extension of CFG recap is enough: extra guidance only in an interval, gamma_t=1 outside retains conditioning. No need for original four-panel figure or exact interval bounds. Could be intentionally omitted if author chooses a strictly ODE-prerequisite recap, but no such ruling found; old “no mandatory expansion” text is not evidence. |
| **Guidance distillation: two evaluations→one, same step count** (new 41, L8:1371–1436; fifth Summary takeaway L8:1471) | Recap 12 ends at standard CFG's two evaluations (L9:395); no student/teacher distinction | **Missing new algorithm/takeaway.** Compact teacher→student equation plus evaluations-versus-steps distinction, not every training detail, completes the revised CFG result. No author omission decision found. |

Fidelity: existing DDPM losses, guided-score decomposition, classifier Training/Sampling and CFG label-dropout statements agree with current body. New rescaling wording is mirrored accurately. However there is no DDIM, guidance interval or distillation coverage. Prior DDIM “recap remains approved” journal entry (`lecture8/migration.md:3–23`) verifies old repeated equations and does not document an explicit author decision about absent DDIM.

## L9→L10: coverage inventory

| L9 teaching unit | L10 recap representation | Disposition |
|---|---|---|
| Discrete NF/residual inversion and passage to ODE (15–17, L9:436–540) | Flow and uniqueness/invertibility in 2–4, L10:44–150 | Covered core result. Fixed-point iteration and Banach details intentionally omitted as motivation already superseded by Picard (reviewer recommendation). |
| ODE/flow/solver; random initial state induces probability path (18,23–24, L9:551–590,693–750) | 2–3, L10:44–117 | Covered. |
| **Euler/Heun and numerical accuracy versus NFE** (new/expanded 19–21, L9:596–675) | 2 contains Euler and generic Runge–Kutta sentence (L10:73–83); no Heun, orders, or NFE | **Missing practical core prerequisite.** L10 later explicitly calls Euler/Heun “familiar” and compares NFE (L10:822–830). Recall local/global error distinction and 1 vs 2 evaluations or minimal method/cost comparison; no need to repeat interactive rotation demo/RK4 derivation. |
| Picard uniqueness and reversible flow (25, L9:759–791) | 4, L10:127–150 | Covered, same conditions and formulas. |
| Continuity equation and integrated log-density (27, L9:818–846) | 5, L10:159–201 | Covered. |
| **Hutchinson trace estimator; exact identity vs approximate computation** (new part of 27, L9:850–860) | 5 stops at “difficult to efficiently estimate the last term” (L10:197) | **Missing solution to the recalled computational problem.** Replace/update old ending with estimator and numerical-evaluation caveat. L10 body explicitly uses it at 22 (L10:880); full autodiff implementation unnecessary. This is stale pedagogical emphasis, not a conflicting trace formula. |
| **CNF likelihood Training/Sampling, backward data solve + NLL + gradients / forward sampling** (new 29, L9:882–933; revised first Summary bullet L9:1334) | No Training/Sampling in recap 2–7 | **Missing core algorithm/new Summary takeaway.** Strongest omission at boundary. L10 FM comparison later relies on ODE/trace training cost (L10:2091–2097). Recall compact algorithms or exact central loss with directions and gradient dependence; adjoint is an optional differentiation method, not inverse transformation. |
| Wiener process, SDE drift/diffusion, stochastic paths and Euler–Maruyama (31–35, L9:960–1131) | 6, L10:211–253 | Covered core definitions/update. Itô formalism/chain-rule remark is intentionally omitted from recap (reviewer recommendation): not used in later derivations, and author explicitly limited its treatment in L9 (refresh report L9). |
| KFP equation (36–37, L9:1139–1218) | 7, L10:265–305 | Covered. |
| Langevin stationary density and discretization (38–40, L9:1227–1324) | 7, L10:281–303 | Covered. Stationary-particle demo is intentionally omitted (reviewer recommendation), since mathematical result retained. |

Fidelity: ODE/flow, Picard, continuity equation signs/limits, Euler–Maruyama, KFP and Langevin expressions match body. Recap “unstable Euler” generic language is inherited, while current body teaches error/cost carefully; revise alongside the numerical-method reminder rather than treating it as a new formula error. No PDF/browser/layout claims made.

## Repair prioritization

1. Highest-value missing method/algorithm reminders: DDIM in L9, CNF Training/Sampling in L10.
2. Restore L7's two deliberately added Summary takeaways in L8: noise coordinate/SNR and convertible parameterizations vs weighted losses.
3. Update L10's existing ODE and density slides for accuracy/NFE and Hutchinson; these should be edits/compact replacements, not an automatic new slide for every item.
4. Modernize L9 CFG recap with a short interval/distillation continuation or explicit author choice to omit these applied developments. They are currently absent from a revised central Summary takeaway, not merely absent examples.

Do not certify any of these three recap boundaries as fully synchronized until these coverage gaps receive a concrete repair or a documented editorial disposition. Existing formula fidelity is mostly sound.


---

## Поведенческая проверка скилла на L10→L11

Независимому проверяющему даны обновлённый скилл, текущее тело L10 и две версии рекапа L11, без ожидаемого результата. Исходная версия A: fidelity проходит, coverage не проходит — нет denoiser/PF-ODE и DDIM. Исправленная версия B: обе проверки проходят. Полные выводы loss/Euler, NFE и обзор решателей классифицированы как допустимые детали для сокращения; нового отдельного recap-слайда для каждой детали не требуется. Таким образом, скилл обнаруживает исходный пропуск и допускает краткое содержательное исправление. Подробные результаты:

# Independent recap-sync behavior validation

Source-only, read-only review, 2026-10-11. Evaluated request: «Проверь синхронизацию лекции 10 с рекапом лекции 11 перед публикацией.» Read current recap-sync instructions, shared format context, course conventions and relevant recorded author decisions. Historical audit/migration verdicts were not used as synchronization evidence. No source edits, builds, exports or PDF/browser checks.

Sources (line references below use these exact absolute paths):

- **L10:** `/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture10/slides.md` — SHA-256 `6df5f4a3024045f8aee7588cc2736733384db42f7f9cceda7a2256f5bc176375`.
- **A:** `/private/tmp/recap-fix-20261011/before/slides.md` — SHA-256 `0f85c1ddc0aae7502968a22952e6c14677d51a1935c95d0e34dbf3f8521e83c4`.
- **B:** `/Users/r-isachenko/Desktop/DGM/2026-DGM-MIPT-YSDA-course/lectures-slidev/lecture11/slides.md` — SHA-256 `7b113b044521b226264e547ce6c6ad41ca3a1a416623d26940b5e44a3f75a9ca`.

The retrospective baseline is the complete current L10 body, six-section Outline and six Summary takeaways, not an empty working diff. A is compared first; B then differs by one added recap slide and the CNF opening sentence. Only actual “Recap of Previous Lecture” slides count as recap.

## Coverage

| Current teaching unit / L10 location | A | B |
|---|---|---|
| VE/NCSN and VP/DDPM continuous limits, conditions (348–574) | Covered, 44–74 | Same |
| PF-ODE and shared probability path (598–799) | Covered, 84–99 | Same |
| Deterministic sampling and likelihood connection (852–906) | Covered in concise form by PF-ODE, sampling distinction and CNF instantaneous density equation, 84–99, 253–254, 265–288 | Same, CNF now 313–336 |
| Reverse ODE/SDE, score correction, proof idea (1011–1389) | Covered, 107–186 | Same |
| Continuous DSM and tractable Gaussian kernels (1415–1703) | Covered, 193–231; both objectives and VE/VP kernels retained | Same |
| General reverse-SDE sampling (1711–1755) | Covered, 240–254, same Sampling steps | Same |
| Denoiser parameterizes noise-coordinate PF-ODE (1786–1840) | **Missing core coverage** | Covered, 264–281 |
| Training denoiser and explicit Euler generation (1853–1957) | No representation of the parent denoiser concept; loss derivation and full loop themselves need not be copied | Core field/sampling idea covered, 272–281, 293–299; derivation and loop reasonably omitted |
| DDIM equals Euler after state/noise normalization (1966–2020) | **Missing core coverage** | Covered, 285–299 |
| CNF cost motivates FM velocity regression (2047–2173) | Covered, 265–309 | Covered, 313–357 |
| FM algorithm and unknown/nonunique target field (2181–2277) | Objective covered; full loop and target-field discussion omitted | Same |

**A fails coverage.** The entire new “Denoiser Parameterization and Sampling” section and central denoiser/DDIM Summary takeaway (L10:2303) have no representation between A:240 Sampling and A:264 CNF. Generic PF-ODE and deterministic-sampling statements do not recall the denoiser conversion or DDIM/Euler result. Repair must recall these concepts; it need not reproduce all four body slides.

**B passes substantive source coverage.** It supplies the two missing results and the required coordinate definitions. No remaining required recap addition was identified.

Explicit omitted-detail dispositions (reviewer recommendations, not claimed author approvals):

- Solver table/NFE, DPM-Solver/++/UniPC, empirical budgets and optional noise injection (L10:811–845; NFE clause at 2303): intentionally omit from this concise recap. They are sampler comparison details, not prerequisites for L11’s conditional velocity regression. The primary denoiser/DDIM part of that Summary bullet is represented in B.
- Full Tweedie derivation, sigma^-4 clean-target loss, Euler loop/zero-noise endpoint and DDIM algebra (L10:1821–2020): intentionally omit derivations/implementation details once B recalls their governing field and DDIM result. Their absence is not an additional core coverage failure.
- Full PF-ODE/reverse-SDE proofs, moment-ODE derivations and explicit VE/VP substitutions: intentionally omit; the recap retains the results, proof sketch and tractable kernels.
- Likelihood integral, inverse/edit/interpolation examples: intentionally omit details; CNF instantaneous change of variables recalls the density principle.
- FM full Training/Sampling and nonunique unknown target discussion: intentionally omit repeated detail. The recap retains the regression objective and training benefit; L11 immediately develops conditional paths/fields (B:417 onward). The retained objective motivates that development.

## Fidelity

**A passes comparison of represented source content.** VE/VP coefficients and unit-variance condition, PF-ODE factor 1/2 and positivity premise, reverse-time signs, score definition, discrete/continuous DSM conditioning and time indices, VE variance subtraction, VP integral exponents, Sampling steps, CNF trace/divergence equation and FM objective agree with their L10 body counterparts. Recap-specific descriptive theorem titles are traceable, not orphan concepts. Paper citations retain the relevant original sources; the proof sketch cites Song, and reverse-SDE theorem retains Anderson plus Song.

The three referenced recap figures (`probability_flow.png`, `sde.png`, `sbgm.png`) in current L11’s local asset directory match L10 by SHA-256. A is a source snapshot using the same references; it has no separate supplied asset directory, so this verifies the repository assets, not a separately packaged A export.

**B also passes source fidelity; no introduced mathematical drift found.** In particular:

- B:274–277 is the same learned score/denoiser parameterization used at L10:1828–1832 and explicitly substituted at L10:1877–1883. The sign is correct: a negative sigma increment moves toward D_theta. This defines a learned field; equality with true marginal probability flow needs the true score, as retained source notes explain.
- B:290–293 retains the exact DDPM normalization and cumulative alpha-bar from L10:1983–1985. B:295 is the same discrete Euler interpretation concluded at L10:2008–2012. It does not claim exact ODE integration or equality of differently initialized full samplers. The omitted induced-denoiser equation is a permissible concise recap omission, not a changed formula.
- The additive-noise state is declared before the field; the DDPM state is explicitly normalized separately. The equations require positive current sigma and alpha-bar, consistent with the source assumptions. No zero-denominator sampling rule is introduced.
- New Karras/DDIM citations match the corresponding L10 source slides. Existing Sampling block remains verbatim in content.

Narrative checks for B’s addition: preceding Sampling recalls two score-based dynamics; the new slide specializes the deterministic field to a denoiser, then identifies DDIM in its normalized coordinates; the closing statement completes this construction. The next CNF slide opens “Now learn the velocity field itself,” matching L10:2049, and its likelihood cost prepares FM. Internally, additive coordinates precede the field, interpretation precedes DDIM normalization, and the conclusion follows from the two recalled results.

An inherited scope assumption remains in both candidates: generic Sampling starts from N(0,I), exactly as L10’s explicitly assumed terminal prior (L10:1713). This is not a universal VE initialization guarantee; B does not extend that initialization claim to its additive-coordinate sampler.

## Publication distinction

- **A:** not synchronized for publication because core coverage is missing, despite faithful existing formulas.
- **B:** the source-content synchronization gate passes for coverage and fidelity. Overall publication readiness is **not established** here: current rendered PDFs, browser/reveal behavior, slide map/catalog and export freshness were outside this source-only evaluation.

This differentiates the two candidates using the updated skill’s coverage-first requirement, without expanding the recap into every proof, solver detail or algorithm listing.
