# Project vision

Durable context for the portal. The content specification itself lives in [curricula/docs](https://github.com/openworkplacecommons/curricula/tree/main/docs); this file does not restate it.

**Open Workplace Commons (OWC)** — _Open knowledge. Better workplaces._ — is an open, community-driven initiative to create, maintain and distribute reusable workplace education resources, reducing duplicated training development across businesses, educators and providers. It is a public knowledge resource, not a proprietary learning platform.

## Principle

OWC owns the open knowledge. Independent applications and organizations decide how to present, deliver, use and evaluate it.

## What OWC maintains

Curricula and learning objectives, competencies, lessons and scenarios, open practice questions with answers and explanations, non-binding evaluation guidance and rubrics, and reviews, references, revision history and attribution.

## What OWC does not do

Run certification exams, hold private official exam banks, issue credentials, accredit providers, record learner results, or guarantee that generic content meets any employer's compliance needs.

## Repositories

- [`curricula`](https://github.com/openworkplacecommons/curricula): canonical content and specification (draft v0.1).
- [`portal`](https://github.com/openworkplacecommons/portal): this public application, a consumer and (later) contributor interface.

## Audiences

Learners and visitors; educators and instructional designers; subject-matter experts; businesses and L&D teams; content creators and training providers; developers and LMS vendors; community maintainers.

## Initial curricula

Responsible AI at Work, Cybersecurity Awareness, Data Privacy Essentials (a Workplace Conduct / Inclusive Teams topic may follow). All are drafts until educational and subject-matter review is complete. Existing example content is illustrative.

## Interoperability

Markdown and YAML/JSON first. SCORM, QTI, CASE and LTI are targets, not claims. Related products (Quizdemics, Anecdote, LMS Grid) are optional consumers, never required.

## Architectural principles

Separate presentation, content access, contribution workflows and publication. Keep `curricula` authoritative. Versioned, reproducible imports. Clear interfaces. Open standards and replaceable infrastructure. Accessibility, mobile and localization from the start. Minimal dependencies; no database or auth without a concrete need. Security boundaries around untrusted submissions; unreviewed contributions are never published automatically. Small, reviewable PRs.
