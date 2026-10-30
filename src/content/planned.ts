import type { Course } from './types';

/**
 * TEMPORARY presentation stubs for planned curricula.
 *
 * Until `curricula` publishes releases under `courses/`, the catalogue would be empty.
 * These entries carry only a title, a one-line scope (taken from curricula
 * docs/08-roadmap-and-decisions.md) and a status. They contain no lessons, outcomes or
 * questions, and are never shown as available. An entry disappears as soon as a loaded
 * catalogue course (not an `examples/` illustration) matches by ID or title. See docs/adr/0002-planned-curricula-placeholders.md.
 */
export interface PlannedTopic {
  slug: string;
  title: string;
  summary: string;
  /** Canonical IDs that, once loaded from curricula, replace this placeholder. */
  replacedByIds: string[];
  // A catalogue course whose title matches also replaces it, so topics without an agreed ID
  // (none is defined for them yet) are retired when real content arrives.
}

export const PLANNED_TOPICS: readonly PlannedTopic[] = [
  {
    slug: 'responsible-ai-at-work',
    title: 'Responsible AI at Work',
    summary: 'Planned: examples, confidential information, verification and human oversight.',
    replacedByIds: ['OWC-AI-101'],
  },
  {
    slug: 'cybersecurity-awareness',
    title: 'Cybersecurity Awareness',
    summary: 'Planned: phishing, authentication, safe sharing and incident reporting.',
    replacedByIds: [],
  },
  {
    slug: 'data-privacy-essentials',
    title: 'Data Privacy Essentials',
    summary: 'Planned: handling personal data, minimization, sharing and incident response.',
    replacedByIds: [],
  },
];

const normalizeTitle = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export function plannedCourses(loaded: readonly Course[]): Course[] {
  // Illustrative examples demonstrate structure only; they never stand in for a published course.
  const real = loaded.filter((c) => !c.illustrative);
  const ids = new Set(real.map((c) => c.id));
  const titles = new Set(real.map((c) => normalizeTitle(c.title)));
  const replaced = (t: PlannedTopic) =>
    t.replacedByIds.some((id) => ids.has(id)) || titles.has(normalizeTitle(t.title));
  return PLANNED_TOPICS.filter((t) => !replaced(t)).map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    status: 'coming-soon' as const,
    audience: [],
    lastReviewed: null,
    competencies: [],
    modules: [],
    practiceItemCount: 0,
    hasEvaluationGuide: false,
    illustrative: false,
  }));
}
