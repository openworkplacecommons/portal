# Architecture (as implemented, Milestone 1)

```text
curricula repo (pinned ref in curricula.lock.json)
   │  npm run content:sync  (or CURRICULA_PATH)
   ▼
.cache/curricula  (gitignored build input)
   │
   ▼
src/content  ── FsContentSource → parseCourse → Course view model ─┐
   planned.ts (temporary "Coming soon" stubs) ─────────────────────┤
                                                                   ▼
                                                    catalogue.ts: getCatalogue()
                                                                   │
                                      src/pages, src/components (static HTML, no runtime fetch)
```

## Responsibilities

- **Presentation** (`src/pages`, `src/components`, `src/layouts`, `src/styles`): static Astro pages. Only `catalogue.ts` is imported for content. Design tokens in `src/styles/tokens.css` (light and dark).
- **Content access** (`src/content`): the `ContentSource` interface is the seam. `FsContentSource` reads `courses/*` (catalogue) and `examples/*` (flagged `illustrative`) from a checkout. `parseCourse` is pure and validates against the draft v0.1 manifest shape: `schema_version` must be `0.x`, status must be a known lifecycle label, required fields are enforced, and referenced files are resolved only inside the course directory. A bad course becomes a build warning (`issues`), not a failed build.
- **Version awareness**: every course records `schemaVersion`, content `version` and the source `ref` (SHA/tag); links go to that exact revision. Content changes only when `curricula.lock.json` changes in a reviewed PR.
- **Contribution workflows / publication**: not implemented. The Contribute page points to GitHub. See ROADMAP.
- **Search**: filtering is a pure function (`src/lib/search.ts`) applied client-side as progressive enhancement over server-rendered cards.

## Boundaries

- No database, auth, LMS, assessment engine or runtime API. Nothing stores learner data.
- Lesson Markdown is not rendered by the portal (links open the file on GitHub). Rendering later requires a sanitizing step; see the untrusted-content rule in CLAUDE.md.
- Planned topics: see [ADR 0002](adr/0002-planned-curricula-placeholders.md). Adapter choice: [ADR 0001](adr/0001-build-time-content-adapter.md).

## Limitations

- `curricula` currently has no `courses/` and no releases; only the illustrative example and planned topics display.
- The UI is English only. A course's `locale` is shown, but routes are not localized yet.
- The hosting target is undecided; output is a plain static site.
