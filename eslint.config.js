import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'backend/**/*',
    'api/**/*',
    'cypress/**/*',
    'scripts/**/*',
    'public/**/*',
    'src/test/**/*',
    'src/tests/**/*',
    'create-test-user.js',
    'cypress.config.js',
    'vite.config.js'
  ]),
  // Node.js environment for API files
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs'
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
    }
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Node.js globals ekle
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'warn',
      'arrow-spacing': 'warn',
      'no-duplicate-imports': 'warn',
      'no-unreachable': 'warn',
      'no-unreachable-loop': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unsafe-negation': 'warn',
      'use-isnan': 'warn',
      'valid-typeof': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
    },
  },
  // API dosyaları için özel konfigürasyon
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // API dosyalarında console kullanımına izin ver
    },
  },
])
