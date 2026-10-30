/**
 * Portal-side view of canonical curricula. These are read-only projections of
 * files in the `curricula` repository (docs/02-content-model.md); the portal
 * never edits or stores them.
 */

/** Lifecycle labels from curricula docs/07-publication-and-validation.md, plus a portal-only placeholder. */
export type CourseStatus =
  'coming-soon' | 'draft' | 'community-reviewed' | 'expert-reviewed' | 'superseded';

export interface Competency {
  id: string;
  statement: string;
}

export interface LessonRef {
  /** Path relative to the course directory, as written in `resource_refs`. */
  path: string;
  /** Title from the lesson front matter, when the file could be read. */
  title?: string;
  /** Link to the file at the pinned revision. */
  url?: string;
}

export interface Module {
  id: string;
  title: string;
  resources: LessonRef[];
}

export interface SourceRef {
  repo: string;
  /** Commit SHA or release tag the content was read from. */
  ref: string;
  /** Course directory inside the repo, e.g. `examples/responsible-ai`. */
  path: string;
  /** Link to the course manifest at that revision. */
  url: string;
}

export interface Course {
  /** URL-safe identifier used for portal routes. */
  slug: string;
  /** Canonical OWC course ID (e.g. OWC-AI-101); absent for planned topics. */
  id?: string;
  title: string;
  summary: string;
  status: CourseStatus;
  locale?: string;
  version?: string;
  schemaVersion?: string;
  audience: string[];
  license?: string;
  lastReviewed: string | null;
  competencies: Competency[];
  modules: Module[];
  practiceItemCount: number;
  hasEvaluationGuide: boolean;
  /** True when the content lives under `examples/` and is not a catalogue course. */
  illustrative: boolean;
  /** Absent for portal-owned "Coming soon" placeholders. */
  source?: SourceRef;
}

export interface ContentIssue {
  path: string;
  message: string;
}

export interface CatalogueResult {
  courses: Course[];
  issues: ContentIssue[];
  /** Where canonical content came from, or null when no checkout was available. */
  source: { repo: string; ref: string } | null;
}

/** The seam between the portal and wherever canonical content comes from. */
export interface ContentSource {
  load(): Promise<{
    courses: Course[];
    issues: ContentIssue[];
    source: { repo: string; ref: string };
  }>;
}
