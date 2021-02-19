module.exports = {
  extends: ['stylelint-config-good-scss', './node_modules/prettier-stylelint/config.js'],
  rules: {
    // 'no-descending-specificity': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ]
  },
}

