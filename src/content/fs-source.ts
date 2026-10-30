import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ContentError, parseCourse, type CourseFiles } from './parse';
import type { ContentIssue, ContentSource, Course } from './types';

const REPO = 'https://github.com/openworkplacecommons/curricula';

const read = (p: string): string | undefined =>
  existsSync(p) ? readFileSync(p, 'utf8') : undefined;

function resolveRef(root: string): { repo: string; ref: string } {
  const meta = read(join(root, '.owc-source.json'));
  if (meta) return JSON.parse(meta) as { repo: string; ref: string };
  try {
    const ref = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    return { repo: REPO, ref };
  } catch {
    return { repo: REPO, ref: 'main' };
  }
}

/**
 * Reads a local checkout of `curricula` (the build-time cache or CURRICULA_PATH).
 * Scans `courses/*` as catalogue courses and `examples/*` as illustrative ones.
 */
export class FsContentSource implements ContentSource {
  constructor(private readonly root: string) {}

  async load() {
    const root = resolve(this.root);
    const source = resolveRef(root);
    const courses: Course[] = [];
    const issues: ContentIssue[] = [];

    for (const [dir, illustrative] of [
      ['courses', false],
      ['examples', true],
    ] as const) {
      const base = join(root, dir);
      if (!existsSync(base)) continue;
      for (const name of readdirSync(base).sort()) {
        const courseDir = join(base, name);
        if (!statSync(courseDir).isDirectory() || !existsSync(join(courseDir, 'course.yaml')))
          continue;
        const coursePath = `${dir}/${name}`;
        const blobUrl = (rel: string) => `${source.repo}/blob/${source.ref}/${coursePath}/${rel}`;
        try {
          courses.push(
            parseCourse(this.collect(courseDir), {
              coursePath,
              illustrative,
              source: { ...source, path: coursePath, url: blobUrl('course.yaml') },
              blobUrl,
            }),
          );
        } catch (e) {
          if (!(e instanceof ContentError) && !(e instanceof Error && e.name === 'YAMLParseError'))
            throw e;
          issues.push({ path: coursePath, message: e.message });
        }
      }
    }
    return { courses, issues, source };
  }

  /** Manifest plus a reader confined to the course directory (refs cannot escape it). */
  private collect(courseDir: string): CourseFiles {
    const base = resolve(courseDir);
    return {
      manifest: readFileSync(join(base, 'course.yaml'), 'utf8'),
      read: (rel) => {
        const full = resolve(base, rel);
        return full.startsWith(base + '/') ? read(full) : undefined;
      },
    };
  }
}
