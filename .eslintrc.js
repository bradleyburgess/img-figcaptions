module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    es6: true,
  },
  plugins: ["prettier", "@typescript-eslint/eslint-plugin"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": ["warn"],
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "off",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "2018",
  },
};
