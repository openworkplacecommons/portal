import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCatalogue } from '../src/content/catalogue';
import { FsContentSource } from '../src/content/fs-source';
import { PLANNED_TOPICS } from '../src/content/planned';

function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'owc-'));
  writeFileSync(
    join(root, '.owc-source.json'),
    JSON.stringify({ repo: 'https://example.test/c', ref: 'deadbeef' }),
  );
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}
const course = (id: string, extra = '') =>
  `schema_version: '0.1.0'\nid: ${id}\nversion: '0.1.0'\nstatus: draft\ntitle: T ${id}\n${extra}`;

describe('buildCatalogue', () => {
  it('shows only planned topics as coming soon when no source exists', async () => {
    const r = await buildCatalogue(null);
    expect(r.source).toBeNull();
    expect(r.courses).toHaveLength(PLANNED_TOPICS.length);
    expect(r.courses.every((c) => c.status === 'coming-soon' && !c.source)).toBe(true);
  });

  it('loads courses and examples, flags examples, and pins the source ref', async () => {
    const root = fixture({
      'courses/a/course.yaml': course('OWC-A-1'),
      'examples/responsible-ai/course.yaml': course('OWC-AI-101'),
    });
    const r = await buildCatalogue(new FsContentSource(root));
    const a = r.courses.find((c) => c.id === 'OWC-A-1');
    const ex = r.courses.find((c) => c.id === 'OWC-AI-101');
    expect(a?.illustrative).toBe(false);
    expect(ex?.illustrative).toBe(true);
    expect(a?.source?.url).toBe('https://example.test/c/blob/deadbeef/courses/a/course.yaml');
    expect(r.source).toEqual({ repo: 'https://example.test/c', ref: 'deadbeef' });
  });

  it('replaces a planned placeholder once the real course loads', async () => {
    const root = fixture({ 'examples/r/course.yaml': course('OWC-AI-101') });
    const r = await buildCatalogue(new FsContentSource(root));
    expect(r.courses.filter((c) => c.title.startsWith('Responsible AI'))).toHaveLength(0);
    expect(r.courses.filter((c) => c.status === 'coming-soon')).toHaveLength(
      PLANNED_TOPICS.length - 1,
    );
  });

  it('records invalid courses as issues instead of failing the build', async () => {
    const root = fixture({
      'courses/bad/course.yaml': course('X').replace("'0.1.0'\nid", "'9.0.0'\nid"),
      'courses/ok/course.yaml': course('OWC-OK-1'),
    });
    const r = await buildCatalogue(new FsContentSource(root));
    expect(r.issues).toHaveLength(1);
    expect(r.issues[0].path).toBe('courses/bad');
    expect(r.courses.some((c) => c.id === 'OWC-OK-1')).toBe(true);
  });

  it('does not read files outside the course directory', async () => {
    const root = fixture({
      'secret.yaml': 'competencies:\n  - id: LEAK\n    statement: leaked\n',
      'courses/a/course.yaml': course('OWC-A-1', 'competencies_ref: ../../secret.yaml\n'),
    });
    const r = await buildCatalogue(new FsContentSource(root));
    expect(r.courses.find((c) => c.id === 'OWC-A-1')?.competencies).toEqual([]);
  });
});
