import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { FsContentSource } from './fs-source';
import { plannedCourses } from './planned';
import type { CatalogueResult, ContentSource } from './types';

/** Locate canonical content: explicit CURRICULA_PATH wins, then the synced build cache. */
export function defaultSource(): ContentSource | null {
  const candidates = [process.env.CURRICULA_PATH, resolve('.cache/curricula')].filter(
    (p): p is string => Boolean(p),
  );
  const found = candidates.find((p) => existsSync(p));
  return found ? new FsContentSource(found) : null;
}

export async function buildCatalogue(
  source: ContentSource | null = defaultSource(),
): Promise<CatalogueResult> {
  const loaded = source ? await source.load() : { courses: [], issues: [], source: null };
  const issues = [...loaded.issues];
  const seen = new Set<string>();
  const unique = loaded.courses.filter((c) => {
    const dup = seen.has(c.slug);
    if (dup) {
      issues.push({ path: c.source?.path ?? c.slug, message: `duplicate course ID "${c.id}"` });
    }
    seen.add(c.slug);
    return !dup;
  });
  return { courses: [...unique, ...plannedCourses(unique)], issues, source: loaded.source };
}

let cached: Promise<CatalogueResult> | undefined;
/** Memoised for a single build. */
export function getCatalogue(): Promise<CatalogueResult> {
  cached ??= buildCatalogue().then((r) => {
    for (const i of r.issues) console.warn(`[content] skipped ${i.path}: ${i.message}`);
    // CI sets CONTENT_STRICT so invalid canonical content fails the build instead of vanishing.
    if (process.env.CONTENT_STRICT && r.issues.length) {
      throw new Error(
        `Invalid curricula content (${r.issues.length} issue(s)); see warnings above.`,
      );
    }
    return r;
  });
  return cached;
}
