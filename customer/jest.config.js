// jest.config.js
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    // Tell Jest to only look at .ts files in __tests__, never compiled dist/
    testMatch: ["**/__tests__/**/*.test.ts"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
