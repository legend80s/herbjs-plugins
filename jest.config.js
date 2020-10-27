module.exports = {
  rootDir: './',
  testEnvironment: 'node',
  // projects: ['<rootDir>/packages/*'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testMatch: [
    '<rootDir>/packages/*/__tests__/**/*.spec.[tj]s',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
};
