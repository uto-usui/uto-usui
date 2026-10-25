export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    // 旧サイトの BEM の class 名を、見た目比較のキーとしてそのまま使う
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { resolveNestedSelectors: true },
    ],
    // Astro のスコープの外を指す :global()
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
  overrides: [{ files: ['**/*.astro'], customSyntax: 'postcss-html' }],
}
