# Open Workplace Commons — Portal

**Open knowledge. Better workplaces.**

The public portal for [Open Workplace Commons](https://openworkplacecommons.org) (OWC): a static Astro site for discovering draft and planned workplace curricula. Canonical content lives in [`curricula`](https://github.com/openworkplacecommons/curricula); the portal reads it and never keeps its own copy.

OWC is not an LMS, exam engine or credential issuer. This milestone has no accounts, database or submissions. All courses are drafts or "Coming soon".

## Local setup

Requires Node 20+ (CI uses 22).

```sh
npm ci
npm run content:sync   # optional: fetch the pinned curricula revision into .cache/
npm run dev            # http://localhost:4321
```

Without a sync, the catalogue shows only the planned topics. To use a local checkout instead: `CURRICULA_PATH=../curricula npm run dev`.

| Command          | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `npm run verify` | Format check, lint, type check, tests, build (what CI runs) |
| `npm test`       | Vitest unit tests                                           |
| `npm run check`  | `astro check` (types)                                       |
| `npm run build`  | Static site to `dist/`                                      |

## Architecture

Presentation (`src/pages`, `src/components`, `src/styles`) depends only on the content adapter (`src/content`), which turns a pinned `curricula` revision into a read-only catalogue. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/ROADMAP.md](docs/ROADMAP.md), [docs/PROJECT_VISION.md](docs/PROJECT_VISION.md) and [CLAUDE.md](CLAUDE.md).

Updating content: change `ref` in `curricula.lock.json` (a commit SHA or version tag) in a reviewed PR, so every build is reproducible.

## Deployment

`npm run build` produces a plain static site in `dist/` that any static host can serve. The hosting target is not decided. Set `SITE_URL` (default `https://openworkplacecommons.org`) and, for sub-path hosting such as GitHub Pages project sites, `BASE_PATH`. Run `npm run content:sync` before building so the deploy includes real content.

## Contributing

Open an issue or PR. Content changes belong in [`curricula`](https://github.com/openworkplacecommons/curricula), not here.
