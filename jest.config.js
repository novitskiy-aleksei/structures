module.exports = {
  coverageDirectory: "./coverage",
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  snapshotSerializers: [
  ]
};
