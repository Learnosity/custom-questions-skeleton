const path = require("path");

module.exports = {
    testEnvironment: "jsdom",
    setupFiles: ["<rootDir>/tests/units/jest.setup.js"],
    modulePaths: [path.resolve(__dirname, "src")],
    testMatch: ["<rootDir>/tests/units/**/*.+(spec|test).+(ts|tsx|js)"],
    moduleNameMapper: {
        'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    },
};
