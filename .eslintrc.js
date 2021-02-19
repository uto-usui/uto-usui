module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  globals: {
    dat: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'nuxt/no-cjs-in-config': 'off',
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    'vue/no-v-html': ['off'],
    'unicorn/number-literal-case': 'off',
  },
}
