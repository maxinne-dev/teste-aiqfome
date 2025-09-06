// ESLint flat config for React + TS + Vitest
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react: reactPlugin, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y, security },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Security plugin — warn-level to avoid CI blocking on noise
      'security/detect-unsafe-regex': 'warn',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'off',
      'security/detect-object-injection': 'off',
      'import/no-absolute-path': 'off'
    }
  },
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    },
    rules: {}
  }
];
