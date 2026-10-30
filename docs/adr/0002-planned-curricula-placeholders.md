# ADR 0002: Planned curricula placeholders

**Status:** accepted, temporary

**Context:** `curricula` has no approved releases and no `courses/` yet, but the portal should show the three planned topics honestly.

**Decision:** `src/content/planned.ts` lists title, one-line scope (from curricula's roadmap) and status for planned topics, always shown as "Coming soon". They contain no outcomes, lessons or questions. A placeholder is dropped once a catalogue course (from `courses/`) is loaded whose ID is listed in `replacedByIds` or whose title matches the placeholder's. Topics with no agreed ID (Cybersecurity, Data Privacy) are therefore retired by title, and no ID is invented for them. Illustrative `examples/` never replace a placeholder; they are listed separately on the catalogue page under "Illustrative examples", labelled Draft.

**Consequences:** Small, clearly marked portal-owned presentation data. Remove the file when curricula publishes the first draft courses under `courses/`.
