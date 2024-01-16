/* eslint-disable */
export default {
  displayName: 'jhh-client-dashboard-practice-shell',
  preset: '../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../coverage/libs/jhh-client/dashboard/practice/shell',
};
