---
name: recap-sync
description: Check both coverage of new lecture material in the next Recap and fidelity of existing recap content in Beamer, Slidev, or a mixed pair. Use after substantive edits or for recap review/synchronization; preserve approved differences and apply an explicitly requested fix direction.
---

# Recap sync

Read [shared context and format selection](../lecture-audit/references/formats.md)
first. Recap elements mirror the relevant body definitions, equations, block titles,
algorithms, figures, and sources. Existing concise recap wording is not a reason to
expand it into the entire original slide.

## Select the pair

A number N means body N to recap N+1. An explicit incoming check means N−1 to N.
For a diff, inspect the body changes and any changed recap; identify the corresponding
neighbor. Use the shared rules to choose Beamer, Slidev, or a mixed pair and state
both source paths. Do not skip the incoming recap on a full named-lecture audit
just because there is no diff. Skip nonexistent neighbors and respect draft status.

## Check coverage from body to recap

Before matching existing recap blocks, inventory the previous lecture's substantive
changes: new or removed sections, methods, parameterizations, algorithms, and revised
takeaways. Use the requested diff plus the current Outline, Summary, body and relevant
migration/refresh decisions. For a retrospective check, state the baseline or history
examined; an empty working diff does not mean there is no new material to review.

For each changed teaching unit, record its body location and one disposition:

- **Covered:** name the recap slide/block that recalls its key result accurately.
- **Missing:** a new core result or prerequisite has no recap representation.
- **Intentionally omitted:** give the pedagogical reason and any explicit author
  decision; distinguish a documented decision from the reviewer's recommendation.

A new section or a new Summary takeaway always needs an explicit disposition.
An unchanged successor recap is not evidence that it remains complete. Do not treat
an earlier agent's "no recap change needed" as author approval. Conversely, a recap
need not repeat every example, demo, proof or implementation detail. Judge omissions
by the lecture's main takeaways and what the successor needs; do not add slides merely
to mirror its table of contents. Missing core coverage remains a finding even when
all existing formulas match.

## Check fidelity from recap to body

1. Find the actual `Recap of Previous Lecture` frames/slides near the start. Use
   TeX frames or Slidev headings/frontmatter, not a generic slice that also treats
   every Outline or introductory remark as recap content.
2. For each block or standalone equation, locate its source in the previous body.
   Start with an exact title/LHS match, then inspect context and approved renames.
   A title that is not found verbatim is not yet proof of an orphan block.
3. Compare formulas, assumptions, indices, parameters, operators, block/algorithm
   names, and the associated source citation. Normalize only harmless markup and
   whitespace; do not normalize away signs, subscripts, conditioning, or scope.
   Account for equivalent TeX/KaTeX layout and the approved terminology policy.
4. Compare figures by content/provenance (hashes for unchanged copies), not only
   filename. Recap assets belong in its own local directory or in the shared theme.
5. A new recap item with no matching body content is an orphan; a real equation or
   notation difference is drift. During migration, distinguish these from approved
   Slidev edits and inherited source issues. Keep either format's mathematical
   inconsistency visible even if the source checker passes.
6. When visual review is in scope, compare repeated notation/blocks in browser and
   PDF using MIGRATION §3. A mixed pair can establish content agreement but does not
   by itself prove cross-Slidev typography; use the approved Slidev reference as well.

## Report or fix

Every recap slide must be fully visible on entry, including Training/Sampling.
Check Slidev frontmatter and map for `clicks: 0`, with no `v-click`, `v-after`,
click-dependent visibility, or other gradual reveals. Beamer recaps have no
overlay/reveal commands. Preserve the complete final content and layout when
removing reveals; verify the initial state and return from the neighboring slide.
This overrides general body-slide animation rules. Author decision, 2026-10-11.

When fixing coverage, prefer adding the missing result to an existing recap slide
on the same topic. Add a new slide only when the existing slide has no readable
space or the addition would mix distinct topics. Preserve complete formulas and
the approved font sizes; do not cram content or broadly reorganize recaps just to
meet a slide count. There is no numeric cap. A recap summarizes the previous
lecture rather than repeating its proofs and examples. For any added slide, record
why extending an existing one was unsuitable. Author decision, 2026-10-11.

For every mismatch give both absolute source locations and the concrete difference.
Summarize matches, introduced mismatches, inherited issues, and missing evidence.
Defer general formatting findings to notation-lint to avoid duplicate reporting.
Report **coverage** and **fidelity** separately, with a compact body-to-recap mapping
for substantive changes (or all current teaching units in a full retrospective).
Do not report synchronization as passed when coverage has not been checked or a
required addition remains unresolved. Source/PDF freshness proves the inspected
revision, not completeness of the recap. Reused evidence must cover both dimensions.

A check stays report-only. If the user explicitly requested copying the agreed body
into the recap, or the reverse, apply that direction without asking again. During an
authorized migration, repair migration drift in the new source; do not silently
rewrite the preserved Beamer baseline. Ask only when the intended source or content
is unresolved. A substantial body change may require an editorial decision about
recap emphasis in addition to formula synchronization; identify that separately.
