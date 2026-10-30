# Roadmap

Aligned with the [curricula roadmap](https://github.com/openworkplacecommons/curricula/blob/main/docs/08-roadmap-and-decisions.md). Only Milestone 1 exists.

## Milestone 1 — Portal foundation

Static Astro site: Home, Curricula catalogue (search/filter), Course details, Contribute, About, Documentation. Version-aware content adapter, planned-topic placeholders, tests and CI.

## Next (not started)

- Consume tagged curricula releases (release manifests, integrity digests) once published; replace the commit-SHA pin and the placeholders.
- Lesson pages with sanitized Markdown rendering; competency and tag filters; version history and review-status display.
- Localization-ready routing and UI strings.
- Choose a hosting target and add a deploy workflow.

## Later (explicitly out of scope until a concrete need)

- Contributions: submission forms, then sign-in, rich-text editing, drafts, translation, asset upload, automated PR creation by a trusted service. Controlled workflow: submission, validation, editorial review, subject review, approval, PR/merge, publication. Unreviewed content is never auto-published.
- Community: profiles, discussion, proposals, reviewer roles.
- Exports and integrations (HTML, SCORM, QTI, CASE, LTI) are interoperability targets owned primarily by curricula tooling; the portal will not claim support before it is tested.
