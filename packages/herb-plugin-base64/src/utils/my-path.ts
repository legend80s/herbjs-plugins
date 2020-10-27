// import { statSync } from 'fs';

// export const isCdn = (src: string): boolean => src.indexOf('http') === 0;

export const isExpression = (src: string): boolean => src.indexOf('{') === 0;

// export const isLocalFile = (src: string): boolean => statSync(src).isFile();

export const isBase64 = (src: string): boolean => src.indexOf('data:') === 0;
