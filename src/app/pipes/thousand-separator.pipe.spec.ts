import { ThousandSeparatorPipe } from './thousand-separator.pipe';

fdescribe('ThousandSeparatorPipe', () => {
  const pipe = new ThousandSeparatorPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform empty string as an empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should transform null as null', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should transform undefined as undefined', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('should transform 12345.67 as 12,345.67', () => {
    expect(pipe.transform(12345.67)).toBe('12,345.67');
  });
});
