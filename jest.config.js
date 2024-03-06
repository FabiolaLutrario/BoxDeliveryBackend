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
  testEnvironmentOptions: {
    url: `http://localhost:${process.env.PORT_TESTS}`,
  },
};

module.exports = config;
