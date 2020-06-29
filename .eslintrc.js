module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
