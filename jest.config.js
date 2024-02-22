const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/dist/"],
};

module.exports = config;
