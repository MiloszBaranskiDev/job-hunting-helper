import { BytesToMbPipe } from './bytes-to-mb.pipe';

describe('BytesToMbPipe', () => {
  it('create an instance', () => {
    const pipe = new BytesToMbPipe();
    expect(pipe).toBeTruthy();
  });
});
