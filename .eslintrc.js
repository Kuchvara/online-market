module.exports = {
  parser: "babel-eslint",
  rules: {
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'no-unused-vars': "warn"
},
  "env": {
    "es2021": true,
    "browser": true,
    "commonjs": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 12
  }  
}