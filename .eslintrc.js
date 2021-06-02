module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  plugins: [
    'mocha'
  ],
  extends: [
    'standard',
    'plugin:mocha/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'space-before-function-paren': 0,
    'mocha/no-skipped-tests': 'error',
    'mocha/no-exclusive-tests': 'error'
  },
  settings: {
    'mocha/additionalCustomNames': [
      { name: 'describeModule', type: 'suite', interfaces: ['BDD'] },
      { name: 'testModule', type: 'testCase', interfaces: ['TDD'] }
    ]
  }
}
