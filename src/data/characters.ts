import { Character } from '@/types';

export const characters: Record<string, Character> = {
  daiyu: {
    id: 'daiyu',
    name: '林黛玉',
    title: '潇湘妃子',
    description: '绛珠仙草转世，寄居荣国府的表小姐。才情绝世，多愁善感，与宝玉有木石前盟。',
    color: '#5C8A7A',
    portraitPrompt: 'photorealistic portrait of a beautiful young Chinese woman Lin Daiyu from Dream of the Red Chamber, age 16, delicate pale skin, slender graceful figure, willow-leaf eyebrows, eyes like bright autumn waters with a hint of melancholy, wearing elegant pale moon-white and light cyan silk hanfu dress with subtle bamboo patterns, hair in traditional Qing dynasty noble lady style with jade hairpin, standing in a bamboo garden, soft natural lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  baoyu: {
    id: 'baoyu',
    name: '贾宝玉',
    title: '怡红公子',
    description: '衔玉而生的荣国府嫡孙，聪明灵秀却厌弃功名，与黛玉心意相通。',
    color: '#C84040',
    portraitPrompt: 'photorealistic portrait of a handsome young Chinese nobleman Jia Baoyu from Dream of the Red Chamber, age 17, fair face like mid-autumn moon, beautiful expressive eyes, wearing luxurious crimson red silk robe with gold embroidery and jade pendant, hair in Qing dynasty male style with jade headband, warm mischievous smile, standing in a traditional Chinese garden with peonies, soft golden hour lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  baochai: {
    id: 'baochai',
    name: '薛宝钗',
    title: '蘅芜君',
    description: '薛姨妈之女，端庄贤淑，才德兼备，项上金锁与宝玉通灵玉相配。',
    color: '#C5A55A',
    portraitPrompt: 'photorealistic portrait of a beautiful elegant young Chinese woman Xue Baochai from Dream of the Red Chamber, age 18, round fair face, gentle graceful demeanor, composed wise eyes, wearing refined honey-colored and pale pink silk hanfu with subtle peony patterns, gold locket around neck, hair in elaborate Qing dynasty noble style with gold hairpins and pearls, warm serene expression, in a traditional Chinese courtyard, soft diffused lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  xifeng: {
    id: 'xifeng',
    name: '王熙凤',
    title: '琏二奶奶',
    description: '贾琏之妻，荣国府管家人。精明强干，嘴甜心苦，明是一盆火暗是一把刀。',
    color: '#B8860B',
    portraitPrompt: 'photorealistic portrait of a stunning glamorous Chinese noblewoman Wang Xifeng from Dream of the Red Chamber, age 22, sharp phoenix eyes with calculating intelligence, red lips curved in a confident smile, wearing magnificent gold-threaded red silk robe embroidered with hundred butterflies and flowers, elaborate gold and jade headdress with pearls, commanding presence, in a luxurious Chinese mansion interior, dramatic lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  jiamu: {
    id: 'jiamu',
    name: '贾母',
    title: '史太君',
    description: '荣国府老祖宗，宝玉黛玉的祖母/外祖母，慈爱威严，极疼宝玉与黛玉。',
    color: '#6B4226',
    portraitPrompt: 'photorealistic portrait of an elderly Chinese noblewoman Grandmother Jia from Dream of the Red Chamber, age 70, kind wise face with smiling eyes, white hair in elaborate Qing dynasty dowager style with jade and pearl ornaments, wearing dark brocade silk robe with gold floral patterns, holding a sandalwood ruyi scepter, seated on an ornate carved chair in a rich Chinese mansion interior, warm candlelight, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  xiren: {
    id: 'xiren',
    name: '袭人',
    title: '花大姑娘',
    description: '宝玉贴身大丫鬟，温顺周到，一心侍奉宝玉。',
    color: '#D4A574',
    portraitPrompt: 'photorealistic portrait of a gentle young Chinese maidservant Xiren from Dream of the Red Chamber, age 17, soft kind face, attentive eyes, wearing simple but neat pale apricot-colored hanfu dress, hair in modest Qing dynasty maid style with small silver hairpin, demure obedient expression, in a traditional Chinese study room, soft natural lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  zijuan: {
    id: 'zijuan',
    name: '紫鹃',
    title: '紫鹃姑娘',
    description: '黛玉贴身丫鬟，忠心耿耿，最懂黛玉心事。',
    color: '#8B5CF6',
    portraitPrompt: 'photorealistic portrait of a loyal young Chinese maidservant Zijuan from Dream of the Red Chamber, age 16, clever concerned eyes, wearing simple purple and blue hanfu dress, hair in Qing dynasty maid style with simple ornaments, earnest caring expression, standing near bamboo outside Xiaoxiang Pavilion, soft misty lighting, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  tanchun: {
    id: 'tanchun',
    name: '贾探春',
    title: '蕉下客',
    description: '宝玉庶出三妹妹，精明能干，志向高远，"才自精明志自高"。',
    color: '#2D6A4F',
    portraitPrompt: 'photorealistic portrait of a bright capable young Chinese lady Jia Tanchun from Dream of the Red Chamber, age 15, determined intelligent eyes, confident brows, wearing elegant jade-green and white hanfu, hair in Qing dynasty noble style with silver hairpins, proud spirited expression, in a Chinese garden with banana trees, bright daylight, Chinese classical aesthetic, high detail, cinematic portrait photography, 8k',
  },
  narrator: {
    id: 'narrator',
    name: '旁白',
    title: '',
    description: '',
    color: '#666666',
    portraitPrompt: '',
  },
};

export const relationshipOrder = ['baoyu', 'baochai', 'xifeng', 'jiamu', 'tanchun', 'xiren', 'zijuan'];
