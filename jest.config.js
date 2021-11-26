module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/protocols/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: [
    '<rootDir>/src'
  ],
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
