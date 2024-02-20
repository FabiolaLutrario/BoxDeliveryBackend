/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  roots: ["<rootDir>/api"],
  verbose: true,
  collectCoverage: false,
};
