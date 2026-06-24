const path = require("path");

module.exports = {
  testEnvironment: "jsdom",
  modulePaths: [path.resolve(__dirname, "src")],
  testMatch: ["<rootDir>/tests/units/**/*.+(spec|test).+(ts|tsx|js)"],
  transformIgnorePatterns: ["node_modules/(?!(sinon|lodash-es)/)"],
};
