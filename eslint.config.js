import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'playwright-report', 'test-results', 'public/mockServiceWorker.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.{ts,tsx}', 'tests/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['*.cjs'],
    languageOptions: { globals: globals.node },
  },
)
