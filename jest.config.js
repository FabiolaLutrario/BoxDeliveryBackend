const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/",
    "/dist/",
    ".config",
    ".models",
  ],
};

module.exports = config;
