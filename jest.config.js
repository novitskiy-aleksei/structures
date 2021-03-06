module.exports = {
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  snapshotSerializers: [
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json'
    }
  }
};
