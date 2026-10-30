import { describe, expect, it } from 'vitest';
import { ContentError, parseCourse, parseFrontMatter, slugify } from '../src/content/parse';

const manifest = `
schema_version: '0.1.0'
id: OWC-AI-101
version: '0.1.0'
status: draft
locale: en
title: Responsible AI at Work
summary: Outline.
audience: [general-employees]
license: TBD
competencies_ref: competencies.yaml
modules:
  - id: M01
    title: Intro
    resource_refs:
      - lessons/introduction.md
practice_ref: practice/questions.yaml
evaluation_guide_ref: evaluation/guide.yaml
review: { level: draft, last_reviewed: null }
`;

const files: Record<string, string> = {
  'competencies.yaml': 'competencies:\n  - id: C1\n    statement: Do a thing.\n',
  'lessons/introduction.md': '---\ntitle: Intro lesson\n---\n# Body',
  'practice/questions.yaml': 'items:\n  - id: Q1\n  - id: Q2\n',
  'evaluation/guide.yaml': 'course_id: OWC-AI-101\n',
};

const ctx = {
  coursePath: 'examples/x',
  illustrative: true,
  source: { repo: 'r', ref: 'abc', path: 'examples/x', url: 'u' },
  blobUrl: (p: string) => `https://example.test/${p}`,
};
const read = (p: string) => files[p];

describe('parseCourse', () => {
  it('projects a manifest and its referenced files', () => {
    const c = parseCourse({ manifest, read }, ctx);
    expect(c).toMatchObject({
      slug: 'owc-ai-101',
      id: 'OWC-AI-101',
      status: 'draft',
      version: '0.1.0',
      practiceItemCount: 2,
      hasEvaluationGuide: true,
      illustrative: true,
      lastReviewed: null,
    });
    expect(c.competencies).toEqual([{ id: 'C1', statement: 'Do a thing.' }]);
    expect(c.modules[0].resources[0]).toEqual({
      path: 'lessons/introduction.md',
      title: 'Intro lesson',
      url: 'https://example.test/lessons/introduction.md',
    });
  });

  it('rejects references to missing files instead of publishing dead links', () => {
    const without = (missing: string) => (p: string) => (p === missing ? undefined : read(p));
    for (const f of [
      'competencies.yaml',
      'lessons/introduction.md',
      'practice/questions.yaml',
      'evaluation/guide.yaml',
    ]) {
      expect(() => parseCourse({ manifest, read: without(f) }, ctx)).toThrow(/not found/);
    }
  });

  it('allows optional references to be omitted from the manifest', () => {
    const lean = manifest
      .replace(/^competencies_ref.*\n/m, '')
      .replace(/^practice_ref.*\n/m, '')
      .replace(/^evaluation_guide_ref.*\n/m, '');
    const c = parseCourse({ manifest: lean, read }, ctx);
    expect(c.competencies).toEqual([]);
    expect(c.practiceItemCount).toBe(0);
    expect(c.hasEvaluationGuide).toBe(false);
  });

  it('rejects unsupported schema versions', () => {
    expect(() =>
      parseCourse({ manifest: manifest.replace("'0.1.0'\nid", "'1.0.0'\nid"), read }, ctx),
    ).toThrow(/unsupported schema_version/);
  });

  it('rejects unknown status and missing required fields', () => {
    expect(() =>
      parseCourse({ manifest: manifest.replace('status: draft', 'status: approved'), read }, ctx),
    ).toThrow(ContentError);
    expect(() =>
      parseCourse({ manifest: manifest.replace('id: OWC-AI-101\n', ''), read }, ctx),
    ).toThrow(/missing required string "id"/);
  });
});

describe('helpers', () => {
  it('parses front matter and ignores documents without it', () => {
    expect(parseFrontMatter('---\ntitle: T\n---\nx')).toEqual({ title: 'T' });
    expect(parseFrontMatter('# no front matter')).toEqual({});
  });
  it('slugifies IDs', () => {
    expect(slugify('OWC-AI-101')).toBe('owc-ai-101');
  });
});
