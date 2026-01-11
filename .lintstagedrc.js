module.exports = {
  "*.{ts,tsx}": [
    "eslint --fix",
    "vitest related --run"
  ],
  "*.{js,json,md}": [
    "prettier --write"
  ]
};
