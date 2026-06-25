import { Ending, GameState } from '@/types';

export const endings: Ending[] = [
  // 结局一：原著悲剧 - 焚稿断痴情
  {
    id: 'tragic_canon',
    title: '焚稿断痴情',
    subtitle: '原著悲剧结局',
    poem: '香魂一缕随风散，愁绪三更入梦遥。\n质本洁来还洁去，一抔净土掩风流。',
    description: '潇湘馆中竹影萧瑟，黛玉焚尽诗稿，带着对宝玉无尽的爱与恨，含恨而终。宝玉在宝钗新婚之夜得知真相，悲痛欲绝，最终出家为僧，遁入空门。一段木石前盟，终究抵不过金玉良缘。金陵十二钗，花落人亡两不知。',
    cgPrompt: 'photorealistic tragic death scene of Lin Daiyu in Xiaoxiang Pavilion at night, beautiful Chinese noblewoman lying pale on bamboo bed, burning poetry papers in a brazier, bamboo shadows swaying in wind and rain outside window, single dim oil lamp, maidservant Zijuan weeping beside her, melancholic cold blue lighting, red wedding music glow visible from distant mansion, Dream of the Red Chamber tragic ending, ultra detailed cinematic, 8k',
    condition: (state: GameState) => state.flags.includes('tragic_death') && !state.flags.includes('elope_together'),
    priority: 100,
  },
  // 结局二：双双向天涯（私奔理想结局）
  {
    id: 'elope_ideal',
    title: '携手天涯',
    subtitle: '比翼双飞·理想结局',
    poem: '愿得一人心，白首不相离。\n抛却侯门事，共赴江南春。',
    description: '宝玉当夜携黛玉出府，紫鹃一路护送。三人乘船南下，回到姑苏黛玉故里。从此隐姓埋名，在江南水乡安居。宝玉不再提什么功名富贵，终日与黛玉吟诗作对、听雨赏竹。黛玉的病竟也渐渐好了起来。虽无荣国府的荣华富贵，却得了人间最难得的——知心人长伴左右。',
    cgPrompt: 'photorealistic romantic scene of Jia Baoyu and Lin Daiyu together on a small wooden boat on misty southern Chinese river at dawn, both wearing simple commoner clothes but happy, Daiyu leaning on Baoyu shoulder with serene smile, peach blossoms on river banks, morning mist over water, warm golden sunrise light, Zijuan at the back steering the boat, happy ending, Dream of the Red Chamber alternate ending, ultra detailed cinematic, 8k',
    condition: (state: GameState) => state.flags.includes('elope_together') && (state.relationships.baoyu ?? 0) >= 80 && state.attributes.health >= 20,
    priority: 200,
  },
  // 结局三：黛玉病逝但知己长伴
  {
    id: 'death_with_love',
    title: '知己泪尽',
    subtitle: '情深不寿·悲剧结局',
    poem: '眼空蓄泪泪空垂，暗洒闲抛却为谁？\n侬今葬花人笑痴，他年葬侬知是卿。',
    description: '黛玉虽未能与宝玉相守，但宝玉在黛玉临终前赶到，紧握她的手，亲口对她说了三遍"你放心"。黛玉含笑而逝，面上再无半分悲苦。宝玉在黛玉坟前守了三年，而后出家。那两方旧帕和诗稿，被紫鹃珍藏一生。',
    cgPrompt: 'photorealistic death scene of Lin Daiyu, beautiful Chinese woman lying peacefully on bed with a faint smile, Jia Baoyu holding her hand weeping, Zijuan standing behind with two silk handkerchiefs and poetry scroll, soft warm candlelight in Xiaoxiang Pavilion bamboo room, bamboo visible through window, peaceful yet heartbreaking atmosphere, Dream of the Red Chamber, ultra detailed cinematic, 8k',
    condition: (state: GameState) => state.flags.includes('tragic_death') && (state.relationships.baoyu ?? 0) >= 80,
    priority: 150,
  },
  // 结局四：德才兼备，受封诰命（德行路线）
  {
    id: 'virtue_lady',
    title: '潇湘诰命',
    subtitle: '德冠群芳·正统结局',
    poem: '德言容功四德全，贤名远播大观园。\n他日凤冠霞帔日，不忘潇湘竹下缘。',
    description: '黛玉以德行立身，对上孝顺贾母，对下宽待下人，与宝钗和解，待人宽厚温良。虽身子弱，但贤名远播。贾母力排众议，定下宝黛婚事。婚后黛玉相夫教子，持家有道，竟将病势渐渐稳住。后宝玉中举，黛玉受封诰命夫人。然她始终不曾忘记当年葬花之处，每年春日必往花冢一祭。',
    cgPrompt: 'photorealistic scene of Lin Daiyu as a noble lady in rich formal hanfu with phoenix crown and embroidered robe, standing gracefully in a beautiful Chinese garden with mature Jia Baoyu beside her in official robes, both content and dignified, bamboo and blossoming flowers around them, warm golden afternoon light, prosperous happy ending, Dream of the Red Chamber alternate ending, ultra detailed cinematic, 8k',
    condition: (state: GameState) =>
      state.attributes.virtue >= 70 &&
      (state.relationships.jiamu ?? 0) >= 70 &&
      (state.relationships.baoyu ?? 0) >= 70 &&
      !state.flags.includes('tragic_death') &&
      state.attributes.health >= 30,
    priority: 90,
  },
  // 结局五：才惊天下，诗名流传（才情路线）
  {
    id: 'poet_legacy',
    title: '诗魂永存',
    subtitle: '才冠古今·诗意结局',
    poem: '孤标傲世偕谁隐，一样花开为底迟。\n墨香笔韵传千古，何必金笼锁玉姿。',
    description: '黛玉的诗才惊动京城，连北静王府都慕名求诗。她在大观园中开馆授诗，门下才女辈出。贾家虽败，黛玉却凭借诗名流芳后世。她终身未嫁，与紫鹃相伴，居于翠竹环绕的小小院落中。临终前将所有诗稿付梓刊印，名曰《潇湘妃子集》，流传千古。',
    cgPrompt: 'photorealistic scene of Lin Daiyu as an elegant mature woman poet sitting at a carved wooden desk in a bamboo study room, writing calligraphy with brush, shelves of books and poetry scrolls around her, Zijuan serving tea, bamboo shadows through window, peaceful scholarly atmosphere, afternoon light through lattice window, Dream of the Red Chamber alternate ending, ultra detailed cinematic, 8k',
    condition: (state: GameState) =>
      state.attributes.talent >= 80 &&
      !state.flags.includes('tragic_death') &&
      state.attributes.health >= 25,
    priority: 80,
  },
  // 结局六：病入膏肓，含恨而终（最坏结局）
  {
    id: 'sick_death',
    title: '潇湘夜雨',
    subtitle: '病骨支离·寂然结局',
    poem: '秋花惨淡秋草黄，耿耿秋灯秋夜长。\n竹影萧疏风兼雨，一盏孤灯照断肠。',
    description: '黛玉在府中处处小心、步步为营，费心劳神，又忧思过重，终于一病不起。临终时身边唯有紫鹃一人，窗外是潇潇夜雨打竹梢，远处隐隐传来喜乐——那是宝玉娶亲的鼓乐声。她连一句完整的话都未能说出，便在秋雨声中悄然逝去。死后，宝玉亦未能见她最后一面。',
    cgPrompt: 'photorealistic scene of empty Xiaoxiang Pavilion at night in heavy autumn rain, a single flickering oil lamp on an empty bed, wind blowing bamboo violently outside, scattered poetry papers on the floor, a single maid Zijuan weeping alone by the window, cold blue rainy night lighting, desolate and lonely atmosphere, Dream of the Red Chamber tragic ending, ultra detailed cinematic, 8k',
    condition: (state: GameState) => state.attributes.health <= 15,
    priority: 180,
  },
];

export function determineEnding(state: GameState): Ending {
  const candidates = endings.filter(e => e.condition(state));
  candidates.sort((a, b) => b.priority - a.priority);
  return candidates[0] || endings[0];
}
