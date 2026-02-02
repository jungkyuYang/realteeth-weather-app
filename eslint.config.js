import storybook from "eslint-plugin-storybook";
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    // 검사 제외 대상
    ignores: ['dist', 'node_modules', '.vscode', 'public', '*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn'],
      
      // ⭐️ 1. 공백 규칙 최적화 (서로 충돌하지 않게 설정)
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "import", "next": "*" },   // 모든 import가 끝나면 한 줄 띄우기
        { "blankLine": "any", "prev": "import", "next": "import" }, // import끼리는 간격 간섭 안 함
        { "blankLine": "always", "prev": "*", "next": "return" },   // return 앞에는 무조건 띄우기
      ],

      // ⭐️ 2. Import 정렬 규칙 (이미지 205206의 범인 해결)
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
          "pathGroups": [
            { "pattern": "react", "group": "external", "position": "before" },
            { "pattern": "@/**", "group": "internal", "position": "after" }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always", // 👈 그룹 사이"만" 줄바꿈 강제
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ]
    },
  },
  ...storybook.configs["flat/recommended"]
);