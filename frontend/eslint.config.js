// eslint.config.js
// ESLint configuration for the AI-Algorithm-Mentor React frontend application.
// Configures linting for JavaScript, React hooks, and React Fast Refresh.

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // Ignore the build output directory
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // Base JS rules
      ...reactHooks.configs.recommended.rules, // React hooks best practices
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Ignore unused vars that are all caps (e.g., constants)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // Warn if components are not exported for Fast Refresh
    },
  },
]
