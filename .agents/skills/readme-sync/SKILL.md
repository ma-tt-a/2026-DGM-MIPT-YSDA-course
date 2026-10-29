---
name: readme-sync
description: Compare the Materials schedule with Slidev section hierarchies and check source/PDF catalog links. Explicit fix direction authorizes the update.
---

# README sync

Read [shared context](../lecture-audit/references/formats.md). Root README is the
schedule; Slidev README is the source/PDF catalog and command guide. A lecture
number limits scope; whole-schedule requests cover all rows.

Locate rows by `<b>Lecture N:</b>`. Compare ordered section/subsection trees with
`section` transitions and actual Outline content. Ordinary headings and repeated
agendas are not sections. Preserve math and distinguish harmless HTML entities
from renamed topics. Check catalog links to `slides.md` and fully revealed
`LectureN.pdf`, and commands against current scripts. Report missing/stale PDFs;
do not maintain duplicate page-count tables. For topic moves, check both schedule
rows and every affected artifact entry. If slide order changes, resolve existing
demo/slide-number references from current semantic IDs and the Slidev parser;
do not apply a numeric offset to references that may already be stale. Check
changed demo ownership, imports and inspector URLs with the transfer procedure.

Audits are report-only. Authorized sync changes only relevant bullets/catalog
entries, preserving dates, unrelated links, publication comment wrappers, Homeworks
and Game rules. Show both locations for mismatches; ask only if direction is unclear.
