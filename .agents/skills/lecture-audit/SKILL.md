---
name: lecture-audit
description: Audit course lectures in Slidev, including notation, both recap directions, Summary, schedule, and Slidev PDF/browser evidence. Use for a full lecture check; respect source-only or diff-only scope.
---

# Lecture audit

Read [shared context](references/formats.md) first. This is
the report-only umbrella check for Slidev. Explicit fix requests authorize their specified corrections.

For an audit involving a topic move, resolve affected pairs with the
[topic-transfer procedure](../recap-sync/references/topic-transfer.md) before
assigning checks. Include dependent recaps absent from the file diff; report their
coverage and the disposition of removed recap items. Keep the audit report-only.

## Source checks

Resolve lecture(s), diff/full scope, and approved source baseline before
starting workers. Use parallel subagents for independent source checks when available,
respecting the concurrency limit; run remaining checks sequentially. Pass each worker
the resolved targets, scope, author decisions, and report-only mode. Each worker reads
its own skill and the shared context. Workers must not run competing builds or exports.

1. [notation-lint](../notation-lint/SKILL.md) on the selected sources.
2. [recap-sync](../recap-sync/SKILL.md), N to N+1, when a successor exists.
   Require both body-to-recap coverage of substantive changes and recap-to-body
   fidelity; checking only existing repeated formulas cannot pass this check.
3. Incoming recap N−1 to N for a full named-lecture audit, or when the recap changed
   in a diff audit; skip N = 1. Use the current approved Slidev neighbors.
4. [summary-sync](../summary-sync/SKILL.md) on lecture N.
5. [readme-sync](../readme-sync/SKILL.md) for the selected lecture rows and, for
   Slidev, the corresponding entries in its artifact catalog.

Also inspect Outline transitions, IDs, clicks, assets and source/PDF freshness.
Page count alone does not prove semantic correctness.

## Rendered evidence

This stage applies to a full Slidev audit or an explicit PDF/visual request. A request
limited to source, one issue, or a diff stays within that scope; identify what was not
checked. A source-only audit does not authorize rebuilding PDFs.

- Review the relevant current exports, using the `pdf` skill for reading/rendering.
  A full Slidev audit reviews all pages of the fully revealed PDF, with dense content
  inspected at full size. Use source metadata to locate slides and browser reveal states. If the PDF
  is absent or freshness cannot be established, report the gap; do not export in
  report-only mode or certify an older artifact from a matching page count alone.
- Compare recurring notation and recap blocks with the approved Lecture 1 and the
  relevant previous Slidev lecture in PDF and browser, as required by CLAUDE.md shared-style rules.
  Record the actual pairs and formats inspected. Check source-footnote clearance,
  clipping, overlap, hidden future material, and a self-contained fully revealed PDF.
- One coordinator owns browser inspection. Use a suitable running local server or
  start an isolated inspection session only when it will not conflict with other
  Slidev activity. Read current inspector limits; test missing interactions manually.
  Report unavailable browser/device checks instead of declaring them passed.
- Shared mechanism changes require checking their consumers under CLAUDE.md validation rules.
  Reuse current evidence only when it demonstrably covers the same source revision
  and scope. Browser success does not prove physical tablet/projector behavior.

## Report

Merge and deduplicate source and visual findings with absolute clickable locations.
State the selected sources and scope. Separate regressions, inherited
editorial issues, approved differences, and missing verification. Give a compact status
for notation, incoming/outgoing recap, Summary, schedule/catalog, PDF, and browser;
use not applicable or not checked where appropriate. An audit with missing required
evidence is incomplete, even when source checks pass. Do not end with a mandatory permission question. If correction was already requested,
return findings to the parent workflow so it can apply the authorized fixes.
