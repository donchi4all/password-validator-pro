module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'], // This tells Jest to look for test files in the 'tests' folder
    transformIgnorePatterns: ['node_modules/'],
  };
  