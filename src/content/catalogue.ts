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
  const courses = [...loaded.courses, ...plannedCourses(loaded.courses)];
  return { courses, issues: loaded.issues, source: loaded.source };
}

let cached: Promise<CatalogueResult> | undefined;
/** Memoised for a single build. */
export function getCatalogue(): Promise<CatalogueResult> {
  cached ??= buildCatalogue().then((r) => {
    for (const i of r.issues) console.warn(`[content] skipped ${i.path}: ${i.message}`);
    return r;
  });
  return cached;
}
