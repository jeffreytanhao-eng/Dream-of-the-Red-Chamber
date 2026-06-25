import { useGameStore } from '@/store/gameStore';
import { characters } from '@/data/characters';
import { getCachedImage } from '@/utils/imageCache';
import { BookOpen, Heart, Sparkles, Shield, Brain, Activity } from 'lucide-react';

const attributeInfo = [
  { key: 'talent' as const, name: '才情', icon: BookOpen, color: '#C5A55A' },
  { key: 'beauty' as const, name: '容貌', icon: Sparkles, color: '#E8899E' },
  { key: 'virtue' as const, name: '德行', icon: Shield, color: '#5C8A7A' },
  { key: 'cunning' as const, name: '心计', icon: Brain, color: '#8B5CF6' },
  { key: 'health' as const, name: '健康', icon: Activity, color: '#C84040' },
];

export function AttributePanel() {
  const attributes = useGameStore(s => s.attributes);
  const currentChapter = useGameStore(s => s.currentChapter);
  const chapters = [
    { id: 1, title: '初入荣国府' },
    { id: 2, title: '西厢共读' },
    { id: 3, title: '海棠诗社' },
    { id: 4, title: '葬花泣红' },
    { id: 5, title: '风雨潇湘' },
    { id: 6, title: '金玉良缘' },
  ];
  const chapInfo = chapters.find(c => c.id === currentChapter);

  const daiyu = characters.daiyu;
  const avatarUrl = getCachedImage('daiyu_avatar', daiyu.portraitPrompt, 'square_hd');

  return (
    <div className="panel-side w-56 p-4 flex flex-col gap-3 self-start">
      {/* 黛玉头像 */}
      <div className="flex flex-col items-center">
        <div className="floral-frame w-20 h-20 mb-2">
          <img
            src={avatarUrl}
            alt="林黛玉"
            className="w-full h-full rounded-full object-cover"
            style={{ border: '2px solid #C5A55A' }}
          />
        </div>
        <h3 className="font-brush text-xl text-gold tracking-wider">{daiyu.name}</h3>
        <p className="font-kai text-xs text-rice/60 mt-0.5">{daiyu.title}</p>
      </div>

      {/* 分割线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* 章节信息 */}
      <div className="text-center">
        <p className="font-kai text-gold/80 text-sm">第{currentChapter}回</p>
        <p className="font-song text-rice/70 text-xs mt-0.5">{chapInfo?.title}</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* 属性列表 */}
      <div className="flex flex-col gap-2.5">
        {attributeInfo.map(attr => {
          const Icon = attr.icon;
          const value = attributes[attr.key];
          return (
            <div key={attr.key} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon size={14} color={attr.color} />
                <span className="font-song text-xs text-rice/80 flex-1">{attr.name}</span>
                <span className="font-kai text-xs" style={{ color: attr.color }}>{value}</span>
              </div>
              <div className="ink-bar">
                <div
                  className="ink-bar-fill"
                  style={{
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${attr.color}88, ${attr.color})`,
                    boxShadow: `0 0 6px ${attr.color}66`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
