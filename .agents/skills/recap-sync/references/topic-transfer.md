# Moving a teaching topic

Use this procedure when moving, splitting or deferring a topic between lectures.
It supplements recap-sync; it is not a full-course audit. A transfer request
covers necessary dependent edits under CLAUDE.md. A review remains report-only;
a source-only request does not authorize PDF regeneration.

## Establish what is moving

Before edits, record the source and destination, the moved slide IDs, key results,
and the old recap slides/blocks that recall them. Include definitions, notation,
assumptions, Training/Sampling, citations, figures and demo dependencies. Use the
actual working sources as the baseline, preserving pre-existing edits. For a
retrospective check, identify the revision or snapshot used; do not infer deleted
recap content solely from the remaining files.

For a move from A to B, inspect the affected interfaces A-1 -> A, A -> A+1,
B-1 -> B and B -> B+1, deduplicating overlaps and skipping nonexistent neighbors.
Limit each check to the moved topic and prerequisites affected by it. Even when
A+1 is B, its old recap and its new body have different roles. B+1 is in scope
whether or not its source already appears in the diff. For nonadjacent moves,
check intervening uses for references to material that has not yet been taught.
If the requested order leaves an unresolved prerequisite, explain the concrete
conflict rather than silently moving more topics or treating the topic as known.

## Account for results and removed recap items

Keep a compact mapping in the review notes or response; no permanent report file
is required. Use semantic IDs and source locations, not page numbers alone:

| Result or old recap block | Old body/recap location | New body location | New recap location and disposition | Coverage / fidelity |
| --- | --- | --- | --- | --- |

For every affected old recap item, choose one supported disposition:

- **Moved:** relocated to the recap of the lecture following its new body.
- **Merged / already covered:** identify the exact destination blocks and compare
  the result, definitions, assumptions, notation, algorithm steps and citations.
  An equation repeated elsewhere is not evidence for missing definitions or
  conditions. Partial coverage requires an edit or a reported gap.
- **Omitted:** explain why the item is only a redundant illustration, proof or
  motivation, or cite the author's omission decision. Distinguish a recommendation
  from approval. Unresolved omissions of core results remain findings.

Check the new body as well as the old recap: a newly introduced key result may
never have had a recap item. Do not blindly copy every old recap slide. Prefer
merging into a coherent existing slide; use a separate static slide when full
notation/conditions would overcrowd it or mix topics. Explain that choice.

For example, if a forward-process recap defines alpha and cumulative alpha before
stating a Gaussian conditional, a successor's distribution overview containing
only that conditional provides partial coverage. A pictorial motivation may already
be covered by a forward/reverse overview; these two items need separate decisions.

## Close the affected dependencies

Apply companion skills only to affected content and references; do not turn a
scoped transfer review into a full lecture audit.

- Recheck narrative neighbors at both the removal and insertion points. The
  destination must introduce the topic as new material, not as previously taught.
- Use summary-sync for both changed bodies and readme-sync for Outline/schedule,
  catalog and existing demo references. A recap-only edit need not change the
  lecture's Summary, schedule row or its successor recap when its body is unchanged.
- Use notation-lint for moved/repeated formulas, source citations and algorithms.
  Preserve IDs where possible, resolve collisions, keep body reveals and make
  recap copies fully visible on entry. Verify figure paths and demo imports,
  including implicit child components and inspector lecture/URL ownership.
- Validate the inspected source revision, including temporary snapshots when used;
  running a checker on different live sources is not evidence for a snapshot.
  Then build/export affected lectures sequentially when artifacts are in scope. Inspect changed PDFs and browser states under the course
  conventions. Recheck the revision before exporting if concurrent edits occurred.

Do not declare the transfer complete while a required mapping row is missing or
only partially covered. Report coverage separately from formula fidelity and from
structural/build/PDF/browser checks. An unchanged successor recap needs a concrete
coverage explanation; a successful check or export cannot provide that evidence.
