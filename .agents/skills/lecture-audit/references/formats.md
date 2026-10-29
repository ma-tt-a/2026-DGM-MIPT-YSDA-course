# Shared context for lecture checks

Read [course conventions](../../../../CLAUDE.md),
[author decisions](../../../../.codex/project-context.md), and
[commands/catalog](../../../../lectures/README.md).

Slidev sources are authoritative: `lectures/lectureN/slides.md`, adjacent
fully revealed `LectureN.pdf`, shared `theme/setup/macros.json`, local `public/figs/`.
Slide metadata has a stable `id`, explicit `clicks`, and `section` on Outline
transitions. Use the installed Slidev parser to respect YAML, code fences, notes
and includes; do not split blindly on `---`.

An audit is report-only. Explicit fix/sync requests authorize the specified edits;
ask only about unresolved editorial direction. Do not regenerate exports during
report-only audits. Never touch `lectures/merged/` without a direct request.

Use the smallest requested scope. Named lectures get full source checks; diff
checks cover changed lines and affected slides/interfaces. Include staged,
unstaged and untracked changes, plus outgoing commits for push. Shared changes
require checking consumers. Documentation-only changes do not require rebuilds.
A PDF-only question does not request a complete semantic audit. For topic moves,
use the [transfer procedure](../../recap-sync/references/topic-transfer.md) to
resolve affected interfaces, including unchanged successor recaps.

Recap slides are titled `Recap of Previous Lecture`; Summary normally ends the
lecture. Use section transitions and Outline hierarchy for the schedule, not every
slide heading. Check current approved neighboring lectures in both directions;
skip nonexistent neighbors and respect Lecture 14's draft status. Report unresolved
body/Recap disagreements with both locations rather than inventing approval.

`npm run check -- N` checks structural conventions, assets and macros, not semantic
agreement or visual quality. Load the PDF skill for PDF inspection. Correct PDFs
through sources/theme and existing export commands when authorized. Full audits
include source, PDF and browser evidence; source-only requests may stop at sources.
Browser inspectors cover only their implemented scenarios. One coordinator owns
build/export; do not conflict with another task's server or artifacts. Browser QA
does not establish physical tablet/projector behavior.

For findings give absolute paths/lines, slide or PDF page, mismatch and concrete
correction; link both sides of comparisons. Distinguish regressions, inherited
issues, approved differences and missing evidence. Page count/build success alone
does not prove freshness, semantic coverage or rendered correctness.
