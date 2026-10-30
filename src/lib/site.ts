export const SITE = {
  name: 'Open Workplace Commons',
  short: 'OWC',
  tagline: 'Open knowledge. Better workplaces.',
  description:
    'Open, community-driven workplace curricula, learning resources, practice questions and evaluation guidelines.',
} as const;

const ORG = 'https://github.com/openworkplacecommons';
export const LINKS = {
  org: ORG,
  curricula: `${ORG}/curricula`,
  curriculaDocs: `${ORG}/curricula/tree/main/docs`,
  curriculaWiki: `${ORG}/curricula/wiki`,
  curriculaIssues: `${ORG}/curricula/issues`,
  curriculaPulls: `${ORG}/curricula/pulls`,
  portal: `${ORG}/portal`,
  portalIssues: `${ORG}/portal/issues`,
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/curricula/', label: 'Curricula' },
  { href: '/contribute/', label: 'Contribute' },
  { href: '/about/', label: 'About' },
  { href: '/docs/', label: 'Documentation' },
] as const;

/** Prefix a site-relative path with the configured base (BASE_PATH). */
export function url(path: string, base: string = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
