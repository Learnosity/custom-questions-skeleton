const path = require('path');

module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: [
        '<rootDir>/tests/units/jest.setup.js',
    ],
    modulePaths: [
        path.resolve(__dirname, 'src'),
    ],
    moduleNameMapper: {
        // d3 does not have a "require" condition so we need to provide its moduleName
        'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    },
    testMatch: [
        '<rootDir>/tests/units/**/*.+(spec|test).+(ts|tsx|js)',
    ]
};
