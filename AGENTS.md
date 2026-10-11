# Codex — DGM MIPT & YSDA 2026

Before editing, read `CLAUDE.md` for shared course conventions and
`.codex/project-context.md` for the author's later decisions.

- Slidev sources in `lectures/lectureN/slides.md` are authoritative.
  Each lecture has one fully revealed `LectureN.pdf`; keep browser reveals.
- All lectures share the approved Slidev Lecture 1 style. Commands and artifact
  paths are in `lectures/README.md`.
- Use `.agents/skills/lecture-audit` for a full audit and the notation-lint,
  recap-sync, summary-sync and readme-sync skills for focused checks.
  Read the selected skill and shared context before checking.
- Use the PDF skill for reading/rendering course PDFs, generated through the
  existing Slidev sources and commands.
- Do not touch, rebuild or sync `lectures/merged/` unless explicitly requested.
- An explicit commit request authorizes that commit. Review the diff first;
  do not add agent attribution to commits or PR descriptions.
- Before every commit and push follow `.codex/project-context.md`: check affected
  lectures and dependent Recaps, Summary, repeated formulas and Training/Sampling,
  Outline/README and source/PDF freshness, including outgoing committed changes.
  A successful build does not establish semantic consistency.
- Keep lecture content in English; Russian is welcome in chat and internal notes.
- Audits are report-only; an explicit request to apply a fix authorizes that fix.
  Ask only about unresolved editorial choices or missing facts.
