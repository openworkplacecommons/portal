import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FsContentSource } from '../src/content/fs-source';

const root = process.env.CURRICULA_PATH ?? resolve('.cache/curricula');

// Contract check against the pinned curricula revision (run `npm run content:sync` first).
describe.skipIf(!existsSync(root))('pinned curricula revision', () => {
  it('parses every course without issues', async () => {
    const r = await new FsContentSource(root).load();
    expect(r.issues).toEqual([]);
    expect(r.courses.length).toBeGreaterThan(0);
    expect(r.courses.every((c) => c.status === 'draft')).toBe(true);
  });
});
