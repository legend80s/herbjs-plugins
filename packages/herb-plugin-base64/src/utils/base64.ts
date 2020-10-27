import { imageToBase64 } from '@legend80s/image-to-base64';

export async function base64(src: string): Promise<string> {
  return imageToBase64(src);
}
