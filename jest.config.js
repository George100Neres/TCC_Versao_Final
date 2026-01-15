/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Isso faz o Jest entender que @/ é a pasta src/
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Isso ajuda a compilar arquivos TS corretamente
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  // Ignora pastas que não são de teste
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};