import { Chapter } from '@/types';

// 第三章：海棠诗社
export const chapter3: Chapter = {
  id: 3,
  title: '第三回',
  subtitle: '海棠诗社',
  intro: '探春起了诗社，众姊妹齐聚秋爽斋，号"海棠诗社"。黛玉才压群芳，诗名渐起。',
  startDialogue: 'ch3_001',
  dialogues: [
    {
      id: 'ch3_001',
      speaker: 'narrator',
      speakerName: '',
      text: '这年秋，探春偶结海棠诗社，众人聚在藕香榭中，摆了笔墨纸砚。李纨自号稻香老农，探春号蕉下客，黛玉为潇湘妃子，宝钗是蘅芜君，宝玉作怡红公子。',
      background: 'poetry_pavilion',
      next: 'ch3_002',
    },
    {
      id: 'ch3_002',
      speaker: 'tanchun',
      speakerName: '贾探春',
      text: '今日以白海棠为题，每人作七律一首，一炷香为限。',
      portrait: 'tanchun',
      next: 'ch3_003',
    },
    {
      id: 'ch3_003',
      speaker: 'narrator',
      speakerName: '',
      text: '众人都悄然构思，或抚纸沉吟，或提笔凝视。唯独黛玉或抚梧桐，或看秋色，又和丫鬟们嘲笑。一时探春、宝钗都已写毕。',
      next: 'ch3_004',
    },
    {
      id: 'ch3_004',
      speaker: 'baoyu',
      speakerName: '贾宝玉',
      text: '（急得搓手）林妹妹，你怎么还不作？香都快烬了！',
      portrait: 'baoyu',
      mood: 'thoughtful',
      next: 'ch3_005',
    },
    {
      id: 'ch3_005',
      speaker: 'daiyu',
      speakerName: '黛玉',
      text: '你们都有了？',
      portrait: 'daiyu',
      choices: [
        {
          id: 'ch3_005_c1',
          text: '（提笔一挥而就，掷与众人）你们看罢。',
          effects: [
            { type: 'attribute', target: 'talent', value: 15, operation: 'add' },
            { type: 'relationship', target: 'baoyu', value: 8, operation: 'add' },
            { type: 'flag', value: 'poem_genius' },
          ],
          next: 'ch3_006a',
        },
        {
          id: 'ch3_005_c2',
          text: '（缓缓提笔，沉吟片刻，方才写就）我这拙作，不过应景罢了。',
          effects: [
            { type: 'attribute', target: 'talent', value: 8, operation: 'add' },
            { type: 'attribute', target: 'virtue', value: 5, operation: 'add' },
          ],
          next: 'ch3_006a',
        },
        {
          id: 'ch3_005_c3',
          text: '（笑道）不急，好文章是要等的。（等香将尽才提笔，一挥而成）',
          effects: [
            { type: 'attribute', target: 'talent', value: 10, operation: 'add' },
            { type: 'attribute', target: 'cunning', value: 5, operation: 'add' },
          ],
          next: 'ch3_006a',
        },
      ],
    },
    {
      id: 'ch3_006a',
      speaker: 'narrator',
      speakerName: '',
      text: '众人看了黛玉的诗——"半卷湘帘半掩门，碾冰为土玉为盆。偷来梨蕊三分白，借得梅花一缕魂。"——都不禁叫绝。',
      next: 'ch3_007',
    },
    {
      id: 'ch3_007',
      speaker: 'baochai',
      speakerName: '薛宝钗',
      text: '（微微一笑）潇湘妃子的诗果然别致。只是终究伤于纤巧了些。',
      portrait: 'baochai',
      mood: 'thoughtful',
      choices: [
        {
          id: 'ch3_007_c1',
          text: '（淡淡道）我这诗不过是信口胡诌，哪里及得蘅芜君的浑厚含蓄？',
          effects: [
            { type: 'relationship', target: 'baochai', value: 5, operation: 'add' },
            { type: 'attribute', target: 'virtue', value: 5, operation: 'add' },
          ],
          next: 'ch3_008',
        },
        {
          id: 'ch3_007_c2',
          text: '（冷笑道）各人心性不同，诗风自然各异。纤巧也好，浑厚也罢，不过真情真性罢了。',
          effects: [
            { type: 'relationship', target: 'baochai', value: -5, operation: 'add' },
            { type: 'attribute', target: 'cunning', value: 3, operation: 'add' },
            { type: 'flag', value: 'defied_baochai' },
          ],
          next: 'ch3_008',
        },
      ],
    },
    {
      id: 'ch3_008',
      speaker: 'baoyu',
      speakerName: '贾宝玉',
      text: '我看林妹妹这首当为第一！"借得梅花一缕魂"，何等清灵，真真只有林妹妹作得出！',
      portrait: 'baoyu',
      mood: 'happy',
      effects: [
        { type: 'relationship', target: 'baoyu', value: 8, operation: 'add' },
      ],
      next: 'ch3_009',
    },
    {
      id: 'ch3_009',
      speaker: 'narrator',
      speakerName: '',
      text: '李纨评道："若论风流别致，自是这首；若论含蓄浑厚，终让蘅芜。"于是定宝钗第一，黛玉第二。黛玉心中虽略有些不平，也不十分在意，只是笑了笑。',
      next: 'ch3_010',
    },
    {
      id: 'ch3_010',
      speaker: 'baoyu',
      speakerName: '贾宝玉',
      text: '（趁人不备，悄悄走到黛玉身边）妹妹，我心里只认你是第一。',
      portrait: 'baoyu',
      mood: 'shy',
      choices: [
        {
          id: 'ch3_010_c1',
          text: '（斜睨他一眼，抿嘴笑道）谁要你认？评都评过了，偏你多事。',
          effects: [
            { type: 'relationship', target: 'baoyu', value: 10, operation: 'add' },
            { type: 'attribute', target: 'beauty', value: 3, operation: 'add' },
          ],
          next: 'ch3_011',
        },
        {
          id: 'ch3_010_c2',
          text: '（轻轻叹息）你心里认有什么用？终究不是你说了算的。',
          effects: [
            { type: 'attribute', target: 'cunning', value: 5, operation: 'add' },
            { type: 'flag', value: 'fate_doubt' },
          ],
          next: 'ch3_011',
        },
      ],
    },
    {
      id: 'ch3_011',
      speaker: 'narrator',
      speakerName: '',
      text: '诗社散后，众人各自归去。黛玉扶着紫鹃的手回潇湘馆，但见满院竹影婆娑，风声萧萧，不觉打了个寒噤。紫鹃忙道："姑娘，天凉了，仔细身子。"',
      background: 'xiaoxiang',
      portrait: 'zijuan',
      next: 'ch3_012',
    },
    {
      id: 'ch3_012',
      speaker: 'narrator',
      speakerName: '',
      text: '夜深了，黛玉独坐窗前，翻出日间的诗作看了半晌，又提笔写下半首词——"孤标傲世偕谁隐，一样花开为底迟？"笔未落处，泪珠儿已打湿了宣纸。',
      effects: [
        { type: 'flag', value: 'chapter3_complete' },
        { type: 'attribute', target: 'health', value: -3, operation: 'add' },
      ],
      chapterEnd: true,
      next: 'ch3_end',
    },
    {
      id: 'ch3_end',
      speaker: 'narrator',
      speakerName: '',
      text: '【第三回·海棠诗社 完】\n\n诗酒酬唱，看似繁华无限。然而黛玉心中那一层薄薄的欢喜，总被金玉之说、身世之悲搅扰得不得安宁。秋灯秋雨里，病势也悄悄添了几分。',
    },
  ],
};
