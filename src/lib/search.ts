import type { Course, CourseStatus } from '../content/types';

export type SearchEntry = Pick<Course, 'title' | 'summary' | 'status'> & {
  id?: string;
  audience: readonly string[];
};

/** Case-insensitive, all-terms match over title, summary, id and audience. */
export function matchesQuery(
  entry: SearchEntry,
  query: string,
  status: CourseStatus | 'all' = 'all',
): boolean {
  if (status !== 'all' && entry.status !== status) return false;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = [entry.title, entry.summary, entry.id ?? '', ...entry.audience]
    .join(' ')
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}
