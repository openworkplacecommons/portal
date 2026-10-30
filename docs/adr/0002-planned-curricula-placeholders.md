# ADR 0002: Planned curricula placeholders

**Status:** accepted, temporary

**Context:** `curricula` has no approved releases and no `courses/` yet, but the portal should show the three planned topics honestly.

**Decision:** `src/content/planned.ts` lists title, one-line scope (from curricula's roadmap) and status for planned topics, always shown as "Coming soon". They contain no outcomes, lessons or questions. A placeholder is dropped once a course with a matching ID is loaded from curricula. The illustrative example under `examples/` is shown as "Draft" with an "Illustrative example" label.

**Consequences:** Small, clearly marked portal-owned presentation data. Remove the file when curricula publishes the first draft courses under `courses/`.
