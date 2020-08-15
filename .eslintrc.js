module.exports = {
  "env": {
    "browser": true,
    "es2020": true,
    "commonjs": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 11
  },
  "rules": {
    "require-jsdoc" : 0,
    "valid-jsdoc" : 0,
    "max-len" : ["error", { "code": 120 ,"ignoreTemplateLiterals": true},],
    "no-unused-vars" : 0,
    "no-var" : 0,
    "new-cap" : 0,
    "prefer-const":0,
    "indent": ["error", 2]
  },
  "globals": {
    "gsap": true,
    "anime": true
  }
};
