import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import js from '@eslint/js';

export default tseslint.config(
  {
    // Global ignores from .eslintignore
    ignores: ['dist', 'out', 'node_modules', 'src/view/dist', 'src/view/node_modules'],
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Custom rules for the whole project
  {
    rules: {
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
      ],
      curly: 'warn',
      eqeqeq: 'warn',
      'no-throw-literal': 'warn',
    },
  },

  // Config for extension files (Node.js)
  {
    files: ['src/**/*.ts', 'esbuild.js', '.vscode-test.mjs', 'eslint.config.mjs'],
    ignores: ['src/view/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Config for view files (React/Browser)
  {
    files: ['src/view/**/*.{ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },

  // Prettier config. This needs to be last.
  configPrettier,

  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
);
