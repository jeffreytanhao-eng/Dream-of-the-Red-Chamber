import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { characters, relationshipOrder } from '@/data/characters';
import { getCachedImage } from '@/utils/imageCache';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export function RelationshipPanel() {
  const [expanded, setExpanded] = useState(false);
  const relationships = useGameStore(s => s.relationships);

  return (
    <div className="flex items-start">
      {/* 折叠按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="panel-side flex items-center justify-center w-8 h-16 cursor-pointer hover:bg-gold/20 transition-colors"
        style={{ borderRadius: '8px 0 0 8px' }}
      >
        {expanded ? <ChevronRight size={18} color="#C5A55A" /> : <ChevronLeft size={18} color="#C5A55A" />}
      </button>

      {/* 面板内容 */}
      <div
        className="panel-side transition-all duration-500 overflow-hidden"
        style={{
          width: expanded ? '200px' : '0px',
          borderRadius: '0 8px 8px 0',
          borderLeft: 'none',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="p-3 w-52 flex flex-col gap-2">
          <h3 className="font-brush text-lg text-gold text-center mb-1 flex items-center justify-center gap-1">
            <Heart size={14} fill="#C84040" color="#C84040" />
            人物关系
          </h3>
          <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-1" />
          {relationshipOrder.map(charId => {
            const char = characters[charId];
            const value = relationships[charId] ?? 30;
            const avatarUrl = getCachedImage(`rel_${charId}`, char.portraitPrompt, 'square_hd');
            return (
              <div key={charId} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full border border-gold/50 overflow-hidden flex-shrink-0"
                  style={{ borderColor: char.color + '80' }}
                >
                  <img src={avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-song text-xs text-rice/80 truncate">{char.name}</span>
                    <span className="font-kai text-[10px]" style={{ color: value > 60 ? '#E8899E' : value < 30 ? '#8B8B8B' : '#C5A55A' }}>
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-rice/10 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${value}%`,
                        background: value > 70
                          ? 'linear-gradient(90deg, #E8899E, #C84040)'
                          : value > 40
                            ? 'linear-gradient(90deg, #D4BC7C, #C5A55A)'
                            : 'linear-gradient(90deg, #666, #888)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
