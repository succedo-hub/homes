import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['dist/**', '.wrangler/**', 'node_modules/**'] },
  ...eslintPluginAstro.configs.recommended,
  { files: ['**/*.ts'], languageOptions: { parser: tsParser } },
  {
    files: ['**/*.{js,mjs,ts,astro}'],
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'astro/no-set-html-directive': 'off'
    }
  }
];
