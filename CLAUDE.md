# CLAUDE.md — OWC portal

Public portal for Open Workplace Commons (OWC). Tagline: "Open knowledge. Better workplaces."
Domain: openworkplacecommons.org. Canonical content: https://github.com/openworkplacecommons/curricula.

## Hard boundaries

- `curricula` is the ONLY source of truth for educational content. Never copy, invent or hand-edit curricula, lessons, competencies or questions in this repo. The sole exception is `src/content/planned.ts` (titles + one-line scope, "Coming soon" only; see ADR 0002).
- OWC does not run exams, issue credentials, accredit providers or store learner results. No LMS, accounts, auth, database or assessment engine until there is a concrete use case.
- Everything not reviewed is labelled Draft / Coming soon. The example course in `curricula/examples/` is illustrative; never present it as approved.
- Do not imply unimplemented integrations (SCORM, QTI, CASE, LTI, sign-in, submissions) exist. Describe them as planned.
- Treat curricula content as untrusted: do not render its Markdown/HTML as HTML without a sanitizing step (currently only titles/metadata are shown; lessons link to GitHub).

## Architecture (see docs/ARCHITECTURE.md)

- Astro 7, static output, TypeScript strict. Minimal dependencies (`astro`, `yaml`).
- `src/content/`: adapter. `types.ts` (portal view model + `ContentSource` interface), `parse.ts` (pure parsing/validation), `fs-source.ts` (reads a curricula checkout), `planned.ts`, `catalogue.ts` (merges + memoises). Pages only import from `catalogue.ts`.
- Content is pinned in `curricula.lock.json` and fetched by `npm run content:sync` into gitignored `.cache/curricula`; `CURRICULA_PATH` overrides. No checkout => planned-only catalogue; the build must still pass.
- `src/components/` reusable UI; `src/styles/tokens.css` design tokens (use variables, no raw colours); `src/lib/` pure helpers.

## Conventions

- Accessible by default: semantic landmarks, skip link, visible focus, AA contrast in light and dark, no JS required for content (search is progressive enhancement).
- Site links go through `url()` so `BASE_PATH` works. External spec/repo links live in `src/lib/site.ts`.
- Small, reviewable PRs. Update docs/ARCHITECTURE.md when structure changes and docs/ROADMAP.md when scope changes. Record decisions as ADRs in docs/adr/.
- Don't duplicate the curricula spec in docs; link to it.

## Commands

`npm run verify` runs format check, lint, type check, tests and build (CI runs the same). Run `npm run content:sync` first to exercise real content.
