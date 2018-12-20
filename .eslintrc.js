module.exports = {
    "extends": ["airbnb-base", "react-app"],
    "rules": {
      "arrow-body-style": "off",
      "arrow-parens": ["error", "always"],
      "max-len": "off",
      "no-shadow": ["error", {
        "builtinGlobals": true
      }],
      "no-underscore-dangle": "off",
      "no-plusplus": ["warn", {
        "allowForLoopAfterthoughts": true
      }],
      "prefer-destructuring": "warn",
      "space-before-function-paren": ["error", "never"],
      "class-methods-use-this": "off"
    },
    "globals": {
      "client": true
    }
  }