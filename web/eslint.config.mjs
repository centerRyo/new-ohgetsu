import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 関数の戻り値はtsの推論に任せる
      '@typescript-eslint/explicit-function-return-type': 'off',
      // anyを禁止 (必要なケースは行コメントでeslint-disableする)
      '@typescript-eslint/no-explicit-any': 'error',
      // ts-ignoreを許可する
      '@typescript-eslint/ban-ts-comment': 'off',
      // 厳密等価演算子を強制
      eqeqeq: 'error',
      // e.g. prop={'foo'} -> prop='foo'
      'react/jsx-curly-brace-presence': 'warn',
      // e.g. opened={true} -> opened
      'react/jsx-boolean-value': 'warn',
      // e.g. <Foo></Foo> -> <Foo />
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react/react-in-jsx-scope': 'off',
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
