module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: false },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript'
  ],
  rules: {
  }
}