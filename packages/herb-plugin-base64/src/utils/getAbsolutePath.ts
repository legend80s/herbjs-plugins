import path from 'path';
import { LABEL } from './constants';

interface IOptions {
  /**
   * 文件所在目录
   */
  cwd: string;

  /**
   * src 目录
   */
  srcDir: string;

  debug: boolean;
}

export function getAbsolutePath(filepath: string, { cwd, srcDir, debug }: IOptions): string {
  let absolute = filepath;

  // http data 或 { 开头则无需处理
  if (/^(?:http|\{|data:)/.test(filepath)) return absolute;

  // '/common/assets/xxx' => /Users/xxx/src/common/assets/xxx
  if (filepath.startsWith('/')) {
    absolute = `${srcDir.replace(/\/$/, '')}${filepath}`;

    // eslint-disable-next-line no-console
    debug && console.info(`[${LABEL}]`, 'from', filepath, 'to', absolute, { cwd, srcDir });

    return absolute;
  }

  // '../../assets/xxx' => /Users/xxx/src/common/assets/xxx
  absolute = path.join(cwd, filepath);

  // eslint-disable-next-line no-console
  debug && console.info(`[${LABEL}]`, 'from', filepath, 'to', absolute, { cwd, srcDir });

  return absolute;
}
