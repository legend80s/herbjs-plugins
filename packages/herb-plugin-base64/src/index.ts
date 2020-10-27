import { HerbBuildPluginCore } from 'herb-build-core';
import { loader } from 'webpack';
import { HerbImageBase64Process } from './process/xml';
import { LABEL } from './utils/constants';

interface IHerbPluginConfig {
  /**
   * @description 是否开启
   * @default true
   */
  enable: boolean;

  /**
   * 单位 B，默认 4096，超过上限，则转换成 base64
   */
  limit: number;

  /**
   * Show verbose information for debugging
   */
  debug: boolean;
}

export default class HerbPluginBase64 extends HerbBuildPluginCore<IHerbPluginConfig> {
  public processAppStyle(context: loader.LoaderContext, source: string) {
    return this.processStyle(context, source);
  }

  public processPageStyle(context: loader.LoaderContext, source: string) {
    return this.processStyle(context, source);
  }

  public processComponentStyle(context: loader.LoaderContext, source: string) {
    return this.processStyle(context, source);
  }

  public processStyle(context: loader.LoaderContext, source: string) {
    return source;
    // return source.replace(/:\s*url\(\s*["']?([^"'\)]+)["']?\s*\)/g, (all, src) => {
    //   return ': url(' + HerbPluginBase64.getAbsolutePath(context, src) + ')';
    // });
  }

  public processPageTemplate(context: loader.LoaderContext, source: string) {
    return this.processHtml(context, source);
  }

  public processComponentTemplate(context: loader.LoaderContext, source: string) {
    return this.processHtml(context, source);
  }

  public async processHtml(context: loader.LoaderContext, source: string) {
    const start = Date.now();

    const { encodedSource, encodedImgCount } = await new HerbImageBase64Process({ source }).render({
      cwd: context.context,
      srcDir: this.props.absOutputDir,
      limit: this.config.limit,
      debug: this.config.debug,
    });

    encodedImgCount &&
      // eslint-disable-next-line no-console
      console.info(`[${LABEL}]`, context.context, 'encoded', encodedImgCount, 'images:', Date.now() - start, 'ms');

    // console.log('encodedSource:', encodedSource);

    return encodedSource;
  }
}
