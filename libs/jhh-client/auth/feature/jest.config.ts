/* eslint-disable */
const esModules = ['@angular'].join('|');

export default {
  displayName: 'jhh-client-auth-feature',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}|.*.mjs$))`],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/jhh-client/auth/feature',
};
