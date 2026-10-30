# ADR 0001: Build-time, pinned content adapter

**Status:** accepted

**Context:** `curricula` must stay the only source of truth, imports must be reproducible, and there is no database or backend.

**Decision:** The portal reads a pinned revision (`curricula.lock.json`) of `curricula` at build time through a `ContentSource` interface, producing an in-memory view model for static pages. Nothing from curricula is committed here.

**Consequences:** Builds are reproducible and work offline after sync. Content updates need a PR bumping the pin and a rebuild. A release-based or API source can replace `FsContentSource` without touching pages. Invalid or unsupported-schema courses are skipped with a warning.
