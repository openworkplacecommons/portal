import type { Course } from './types';

/**
 * TEMPORARY presentation stubs for planned curricula.
 *
 * Until `curricula` publishes releases under `courses/`, the catalogue would be empty.
 * These entries carry only a title, a one-line scope (taken from curricula
 * docs/08-roadmap-and-decisions.md) and a status. They contain no lessons, outcomes or
 * questions, and are never shown as available. An entry disappears as soon as a loaded
 * course with a matching ID exists. See docs/adr/0002-planned-curricula-placeholders.md.
 */
export interface PlannedTopic {
  slug: string;
  title: string;
  summary: string;
  /** Canonical IDs that, once loaded from curricula, replace this placeholder. */
  replacedByIds: string[];
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

export function plannedCourses(loaded: readonly Course[]): Course[] {
  const loadedIds = new Set(loaded.map((c) => c.id));
  return PLANNED_TOPICS.filter((t) => !t.replacedByIds.some((id) => loadedIds.has(id))).map(
    (t) => ({
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
    }),
  );
}
