// 图片URL缓存，避免重复调用API
const imageCache = new Map<string, string>();

export function getCachedImage(key: string, prompt: string, size: 'portrait_4_3' | 'landscape_16_9' | 'square_hd' = 'portrait_4_3'): string {
  if (imageCache.has(key)) {
    return imageCache.get(key)!;
  }
  const encoded = encodeURIComponent(prompt);
  const url = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=${size}`;
  imageCache.set(key, url);
  return url;
}
