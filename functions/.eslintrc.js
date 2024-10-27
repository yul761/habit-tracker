module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: ['eslint:recommended', 'google', 'prettier'],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
    indent: ['error', 2],
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    'comma-dangle': ['error', 'never']
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true
      },
      rules: {}
    }
  ],
  globals: {}
}
