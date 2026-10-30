import { parse as parseYaml } from 'yaml';
import type { Competency, Course, CourseStatus, LessonRef, Module, SourceRef } from './types';

/** Major schema line this adapter understands (curricula spec is draft v0.1). */
export const SUPPORTED_SCHEMA = /^0\./;

const STATUSES: readonly CourseStatus[] = [
  'draft',
  'community-reviewed',
  'expert-reviewed',
  'superseded',
];

export class ContentError extends Error {}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

function need(o: Obj, key: string, where: string): string {
  const v = str(o[key]);
  if (!v) throw new ContentError(`${where}: missing required string "${key}"`);
  return v;
}

export function parseFrontMatter(markdown: string): Obj {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  if (!m) return {};
  const data = parseYaml(m[1]);
  return isObj(data) ? data : {};
}

export function slugify(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface CourseFiles {
  manifest: string;
  /** Reads a file referenced by the manifest, relative to the course directory. */
  read: (relativePath: string) => string | undefined;
}

export interface ParseContext {
  coursePath: string;
  illustrative: boolean;
  source: SourceRef;
  blobUrl: (relativePath: string) => string;
}

/** Turn raw curricula files into a Course. Throws ContentError on invalid or unsupported input. */
export function parseCourse(files: CourseFiles, ctx: ParseContext): Course {
  const where = ctx.coursePath;
  const doc = parseYaml(files.manifest);
  if (!isObj(doc)) throw new ContentError(`${where}: course.yaml is not a mapping`);

  const schemaVersion = need(doc, 'schema_version', where);
  if (!SUPPORTED_SCHEMA.test(schemaVersion)) {
    throw new ContentError(`${where}: unsupported schema_version ${schemaVersion}`);
  }
  const id = need(doc, 'id', where);
  const rawStatus = str(doc.status) ?? 'draft';
  if (!STATUSES.includes(rawStatus as CourseStatus)) {
    throw new ContentError(`${where}: unknown status "${rawStatus}"`);
  }

  const ref = (o: Obj, key: string) => {
    const rel = str(o[key]);
    if (!rel) return undefined;
    const text = files.read(rel);
    if (text === undefined) throw new ContentError(`${where}: ${key} "${rel}" not found`);
    return text;
  };

  const modules: Module[] = (Array.isArray(doc.modules) ? doc.modules : []).map((m, i) => {
    if (!isObj(m)) throw new ContentError(`${where}: modules[${i}] is not a mapping`);
    const resources: LessonRef[] = strList(m.resource_refs).map((path) => {
      const lesson = files.read(path);
      if (lesson === undefined) throw new ContentError(`${where}: lesson "${path}" not found`);
      const title = lesson ? str(parseFrontMatter(lesson).title) : undefined;
      return { path, title, url: ctx.blobUrl(path) };
    });
    return {
      id: need(m, 'id', `${where} modules[${i}]`),
      title: need(m, 'title', `${where} modules[${i}]`),
      resources,
    };
  });

  let competencies: Competency[] = [];
  const competenciesText = ref(doc, 'competencies_ref');
  if (competenciesText) {
    const c = parseYaml(competenciesText);
    const list = isObj(c) && Array.isArray(c.competencies) ? c.competencies : [];
    competencies = list.filter(isObj).map((x) => ({
      id: need(x, 'id', `${where} competencies`),
      statement: need(x, 'statement', `${where} competencies`),
    }));
  }

  let practiceItemCount = 0;
  const practiceText = ref(doc, 'practice_ref');
  if (practiceText) {
    const p = parseYaml(practiceText);
    if (isObj(p) && Array.isArray(p.items)) practiceItemCount = p.items.length;
  }

  const review = isObj(doc.review) ? doc.review : {};
  return {
    slug: slugify(id),
    id,
    title: need(doc, 'title', where),
    summary: str(doc.summary) ?? '',
    status: rawStatus as CourseStatus,
    locale: str(doc.locale),
    version: str(doc.version),
    schemaVersion,
    audience: strList(doc.audience),
    license: str(doc.license),
    lastReviewed: str(review.last_reviewed) ?? null,
    competencies,
    modules,
    practiceItemCount,
    hasEvaluationGuide: ref(doc, 'evaluation_guide_ref') !== undefined,
    illustrative: ctx.illustrative,
    source: ctx.source,
  };
}
