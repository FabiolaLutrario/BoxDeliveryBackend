const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/dist/"],
};

module.exports = config;
