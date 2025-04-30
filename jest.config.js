module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
  };
  