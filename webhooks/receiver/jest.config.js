module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@realtime-labs/shared$': '<rootDir>/../../shared/src',
    '^@shared/(.*)$': '<rootDir>/../../shared/src/$1'
  },
  setupFiles: ['dotenv/config']
};
