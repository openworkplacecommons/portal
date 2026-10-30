import { describe, expect, it } from 'vitest';
import { matchesQuery } from '../src/lib/search';

const entry = {
  title: 'Data Privacy Essentials',
  summary: 'Personal data handling',
  status: 'coming-soon',
  audience: ['all-staff'],
} as const;

describe('matchesQuery', () => {
  it('matches everything on an empty query', () => expect(matchesQuery(entry, '  ')).toBe(true));
  it('requires all terms, case-insensitively', () => {
    expect(matchesQuery(entry, 'privacy DATA')).toBe(true);
    expect(matchesQuery(entry, 'privacy phishing')).toBe(false);
  });
  it('searches audience and filters by status', () => {
    expect(matchesQuery(entry, 'all-staff')).toBe(true);
    expect(matchesQuery(entry, '', 'draft')).toBe(false);
    expect(matchesQuery(entry, '', 'coming-soon')).toBe(true);
  });
});
