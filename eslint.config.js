import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    'dist/',
    '.astro/',
    '.snapshot/',
    'docs/',
    'test-results/',
    'playwright-report/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    files: ['public/sw.js'],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    files: ['scripts/**', 'e2e/**', 'test/**', '*.config.*'],
    languageOptions: { globals: globals.node },
  },
  prettier,
])
