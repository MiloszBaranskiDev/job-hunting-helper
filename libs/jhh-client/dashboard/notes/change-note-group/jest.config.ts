/* eslint-disable */
export default {
  displayName: 'jhh-client-dashboard-notes-change-note-group',
  preset: '../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../coverage/libs/jhh-client/dashboard/notes/change-note-group',
};