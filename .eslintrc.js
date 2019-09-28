module.exports = {
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  env: {
    browser: true
  },
  rules: {
    'max-len': [2, { code: 140 }],
    'arrow-parens': [2, 'as-needed'],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
    'import/no-named-as-default': [0],
    'import/no-named-as-default-member': [0],
    '@typescript-eslint/indent': [2, 2],
    '@typescript-eslint/interface-name-prefix': [2, { prefixWithI: "always" }],
    '@typescript-eslint/explicit-function-return-type': [2, { allowExpressions: true }],
  },
};