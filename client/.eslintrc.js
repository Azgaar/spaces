module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['react-app', 'react-app/jest', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    curly: ['error', 'all']
  }
};
