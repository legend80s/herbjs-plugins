import { HerbXMLProcessCore } from 'herb-build-core';
import { _ } from 'herb-build-utils';
import { base64 } from '../utils/base64';
import { isBase64, isExpression } from '../utils/my-path';
import { getFileSize } from '@legend80s/image-to-base64';
import { getAbsolutePath } from '../utils/getAbsolutePath';
import { LABEL } from '../utils/constants';

type ILimit = boolean | string | number;

/**
 * in Byte
 */
const DEFAULT_LIMIT = 4096;

interface IOptions {
  cwd: string;
  srcDir: string;
  limit: number;

  /**
   * show verbose info
   */
  debug?: boolean;
}

interface IResult {
  encodedSource: string;
  encodedImgCount: number;
}

export class HerbImageBase64Process extends HerbXMLProcessCore {
  private map: Map<string, string> = new Map();

  public render({ cwd, srcDir, debug, limit = DEFAULT_LIMIT }: IOptions): Promise<IResult> {
    return this.toBase64({ cwd, srcDir, limit, debug });
  }

  private async toBase64({ cwd, srcDir, debug, limit = DEFAULT_LIMIT }: IOptions): Promise<IResult> {
    // getAbsolutePath
    this.toAst().traverse((node) => {
      if (node.tag === 'image') {
        const rawSrc = _.get(node, ['attrs', 'src'], '') as string;
        const src = getAbsolutePath(rawSrc, { cwd, srcDir, debug });

        if (isBase64(src) || isExpression(src)) {
          return;
        }

        this.map.set(src, '');
      }
    });

    // to base64
    await Promise.all(
      [...this.map.entries()].map(async ([src]) => {
        let size: number;
        // console.time('getFileSize ' + src);

        try {
          size = await getFileSize(src);
        } catch (error) {
          // eslint-disable-next-line no-console
          debug && console.error(`[${LABEL}]`, 'getFileSize failed:', error);
          return;
        }

        // console.timeEnd('getFileSize ' + src);

        const should = this.shouldTransform(limit, size);

        if (!should) {
          return;
        }
        // console.time('base64 ' + src);

        // eslint-disable-next-line no-console
        debug && console.info(`[${LABEL}]`, 'toBase64:', src, 'size:', size, 'limit:', limit);

        const base64Src = await base64(src).catch((error) => {
          // eslint-disable-next-line no-console
          debug && console.error(`[${LABEL}]`, 'base64 failed:', error);

          return '';
        });

        // console.timeEnd('base64 ' + src);

        if (base64Src) {
          this.map.set(src, base64Src);
        }
      }),
    );

    const ast = this.traverse((node) => {
      if (node.tag === 'image') {
        const { src: rawSrc } = node.attrs;
        const src = getAbsolutePath(rawSrc as string, { cwd, srcDir, debug });

        const base64 = this.map.get(src);

        if (base64) {
          Object.assign(node.attrs, { src: base64 });
        }
      }
    });

    return {
      encodedSource: ast.toString(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      encodedImgCount: Array.from(this.map.entries()).filter(([_, val]) => val !== '').length,
    };
  }

  private shouldTransform(limit: ILimit, size: number) {
    if (typeof limit === 'boolean') {
      return limit;
    }

    if (typeof limit === 'string') {
      return size <= parseInt(limit, 10);
    }

    if (typeof limit === 'number') {
      return size <= limit;
    }

    return true;
  }
}
