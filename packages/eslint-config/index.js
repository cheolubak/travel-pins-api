module.exports = {
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural-legacy',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'perfectionist/sort-imports': 'error',
    'perfectionist/sort-classes': 'off',
  },
};
