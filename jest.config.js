module.exports = {
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.json",
    },
  },
  testMatch: ["<rootDir>/test/**/*.spec.{js,ts}"],
  testEnvironment: "node",
  collectCoverageFrom: ["<rootDir>/src/**/*.{js,ts}"],
};
