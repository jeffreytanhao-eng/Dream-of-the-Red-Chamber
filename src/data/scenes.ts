import { Scene } from '@/types';

export const scenes: Record<string, Scene> = {
  rongguo_main: {
    id: 'rongguo_main',
    name: '荣国府正厅',
    prompt: 'photorealistic interior of a grand Qing dynasty Chinese noble mansion main hall, carved red sandalwood furniture, silk screens with landscape paintings, porcelain vases, ornate lanterns hanging from high ceiling, marble floor with red carpet, warm golden light from windows with lattice patterns, luxurious classical Chinese architecture, Dream of the Red Chamber Rongguo Mansion style, cinematic lighting, ultra detailed, 8k',
  },
  xiaoxiang: {
    id: 'xiaoxiang',
    name: '潇湘馆',
    prompt: 'photorealistic interior of Xiaoxiang Pavilion bamboo retreat from Dream of the Red Chamber, elegant bamboo groves outside window, simple refined scholar study room with bookshelves, guqin on table, ink stone and brushes, bamboo curtains swaying gently, misty green light filtering through bamboo, verdant and serene atmosphere, Qing dynasty Chinese architecture, soft natural lighting, ultra detailed, 8k',
  },
  yihong: {
    id: 'yihong',
    name: '怡红院',
    prompt: 'photorealistic interior of Yihong Courtyard from Dream of the Red Chamber, luxurious bedroom study with red and gold decor, carved bed frame with silk curtains, bronze mirror, antiques and flowers, warm lantern light, peonies in porcelain vases, rich opulent Qing dynasty noble bedroom, romantic atmosphere, cinematic lighting, ultra detailed, 8k',
  },
  hengwu: {
    id: 'hengwu',
    name: '蘅芜苑',
    prompt: 'photorealistic interior of Hengwu Courtyard from Dream of the Red Chamber, simple and austere room with minimal decoration, white walls, a few books and chrysanthemums in plain vase, climbing vines outside window, clean understated elegance, cool even lighting, Qing dynasty Chinese courtyard room, ultra detailed, 8k',
  },
  daguanyuan_gate: {
    id: 'daguanyuan_gate',
    name: '大观园',
    prompt: 'photorealistic grand entrance of Daguanyuan Grand View Garden from Dream of the Red Chamber, magnificent traditional Chinese garden gate with red pillars and gold-lettered plaque, stone lions, winding paths leading to pavilions, willow trees and blooming flowers, lake with lotus in background, beautiful spring morning light, classical Chinese garden architecture, ultra detailed, 8k',
  },
  qinfang: {
    id: 'qinfang',
    name: '沁芳闸',
    prompt: 'photorealistic Qinfang Waterside Pavilion in Daguanyuan Garden from Dream of the Red Chamber, elegant Chinese pavilion over a clear flowing stream, peach blossom petals floating on water, weeping willows, stone bridge, rocks covered in moss, late spring afternoon light, romantic melancholic atmosphere, classical Chinese garden scenery, ultra detailed, 8k',
  },
  daoxiang: {
    id: 'daoxiang',
    name: '稻香村',
    prompt: 'photorealistic Daoxiang Village farmstead in Daguanyuan from Dream of the Red Chamber, rustic thatched cottage with vegetable garden, apricot trees, chickens, mulberry and hemp plants, simple countryside aesthetic within a noble garden, warm golden sunset light, idyllic pastoral scene, ultra detailed, 8k',
  },
  jiamu_hall: {
    id: 'jiamu_hall',
    name: '荣庆堂',
    prompt: 'photorealistic Jia Mu quarters Rongqing Hall in Rongguo Mansion, warm and luxurious elderly lady chambers with sandalwood screens, jade ornaments, Buddha niche with incense smoke, carved opium daybed with silk cushions, soft warm candle and lamplight, red and gold decor, intimate family atmosphere, Qing dynasty Chinese noble interior, ultra detailed, 8k',
  },
  boat_journey: {
    id: 'boat_journey',
    name: '江上行舟',
    prompt: 'photorealistic Chinese wooden canal boat traveling on a misty river at dawn, viewed from inside the boat cabin with silk curtains, weeping willows and ancient river towns on banks, mist and fog over water, melancholy autumn atmosphere, soft gray morning light, traditional Chinese river journey scene from Qing dynasty, ultra detailed, 8k',
  },
  poetry_pavilion: {
    id: 'poetry_pavilion',
    name: '藕香榭诗社',
    prompt: 'photorealistic Ouxiang Pavilion waterside in Daguanyuan Garden, open-air Chinese pavilion over a lotus pond, group of young ladies in colorful hanfu seated around a low table with wine cups and poetry paper, autumn chrysanthemums, golden afternoon light reflecting on water, elegant scholarly gathering scene, Dream of the Red Chamber poetry club, ultra detailed, 8k',
  },
  burial_mound: {
    id: 'burial_mound',
    name: '花冢',
    prompt: 'photorealistic peach blossom burial mound in Daguanyuan Garden from Dream of the Red Chamber, a small earthen mound covered in falling peach and pear petals, a lone young woman standing with a flower hoe and silk flower bag, weeping willows and peach trees in full bloom, petals swirling in spring breeze, late afternoon golden light, sorrowful romantic atmosphere, ultra detailed, 8k',
  },
  night_xiaoxiang: {
    id: 'night_xiaoxiang',
    name: '潇湘夜雨',
    prompt: 'photorealistic Xiaoxiang Pavilion at night during autumn rain, bamboo forest swaying in wind and rain, single dim oil lamp lighting the window, raindrops on bamboo leaves, desolate and lonely atmosphere, cold blue-gray night lighting, a sickly figure visible through the window curtain, melancholic scene, Dream of the Red Chamber, ultra detailed, 8k',
  },
};

// Image generation utility
export function getImageUrl(prompt: string, size: 'portrait_4_3' | 'landscape_16_9' | 'square_hd' = 'portrait_4_3'): string {
  const encoded = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=${size}`;
}
