import { getAbsolutePath } from '../src/utils/getAbsolutePath';

describe('getAbsolutePath', () => {
  it('starts with /', () => {
    const input = '/common/assets/xxx';
    const actual = getAbsolutePath(input, { cwd: '', srcDir: '/Users/anonymous/src/' });
    const expected = '/Users/anonymous/src/common/assets/xxx';

    expect(actual).toEqual(expected);
  });

  it('starts with / and srcDir not endsWith /', () => {
    const input = '/common/assets/xxx';
    const actual = getAbsolutePath(input, { cwd: '', srcDir: '/Users/anonymous/src' });
    const expected = '/Users/anonymous/src/common/assets/xxx';

    expect(actual).toEqual(expected);
  });

  it('relative path', () => {
    const input = '../../images/x.png';
    const actual = getAbsolutePath(input, { cwd: '/Users/anonymous/src/pages/index', srcDir: '' });
    const expected = '/Users/anonymous/src/images/x.png';

    expect(actual).toEqual(expected);
  });

  it('cdn', () => {
    const input = 'https://www.example.com/a.png';
    const actual = getAbsolutePath(input, { cwd: '/Users/anonymous/src/pages/index', srcDir: '' });
    const expected = 'https://www.example.com/a.png';

    expect(actual).toEqual(expected);
  });

  it('dataUri', () => {
    const input = 'data:image/png;base64,iVBORw0KGgoA';
    const actual = getAbsolutePath(input, { cwd: '/Users/anonymous/src/pages/index', srcDir: '' });
    const expected = 'data:image/png;base64,iVBORw0KGgoA';

    expect(actual).toEqual(expected);
  });

  it('expression', () => {
    const input = '{{ imgSrc }}';
    const actual = getAbsolutePath(input, { cwd: '/Users/anonymous/src/pages/index', srcDir: '' });
    const expected = '{{ imgSrc }}';

    expect(actual).toEqual(expected);
  });
});
