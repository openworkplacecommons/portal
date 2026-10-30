import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'test-results/',
      'playwright-report/',
      'dist/',
      '.astro/',
      '.cache/',
      'node_modules/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
];
