import type { CourseStatus } from '../content/types';

export const STATUS_LABEL: Record<CourseStatus, string> = {
  'coming-soon': 'Coming soon',
  draft: 'Draft',
  'community-reviewed': 'Community-reviewed',
  'expert-reviewed': 'Expert-reviewed',
  superseded: 'Superseded',
};

export const STATUS_HELP: Record<CourseStatus, string> = {
  'coming-soon': 'Planned. No content has been published yet.',
  draft: 'Incomplete or unreviewed. Not approved training material.',
  'community-reviewed': 'Editorial or peer review recorded, with limitations.',
  'expert-reviewed': 'Reviewed by a qualified subject expert within a stated scope.',
  superseded: 'Replaced by a newer release.',
};
