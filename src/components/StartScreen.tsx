import { useState, useEffect } from 'react';
import { useGameStore, hasSaveData } from '@/store/gameStore';
import { Petals } from './Petals';
import { getCachedImage } from '@/utils/imageCache';
import { useNavigate } from 'react-router-dom';
import { playClick, startBGM, stopBGM } from '@/utils/audio';

export function StartScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const startNewGame = useGameStore(s => s.startNewGame);
  const loadGame = useGameStore(s => s.loadGame);
  const navigate = useNavigate();

  const bgUrl = getCachedImage('start_bg',
    'photorealistic panoramic view of a magnificent traditional Chinese noble garden Daguanyuan in spring morning mist, ancient pavilions, blooming peach and plum blossoms, willow trees, a calm lake reflecting elegant architecture, distant mountains in soft fog, cherry blossom petals floating, classical Chinese painting aesthetic meets photorealism, Dream of the Red Chamber, cinematic wide angle, ultra detailed, 8k',
    'landscape_16_9'
  );

  useEffect(() => {
    setHasSave(hasSaveData());
    const timer = setTimeout(() => setShowMenu(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 启动BGM
    const handler = () => {
      startBGM();
      document.removeEventListener('click', handler);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      stopBGM();
    };
  }, []);

  const handleNewGame = () => {
    playClick();
    startNewGame();
    navigate('/game');
  };

  const handleLoadGame = () => {
    playClick();
    if (loadGame()) {
      navigate('/game');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景图 */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <img src={bgUrl} alt="" className="hidden" onLoad={() => setBgLoaded(true)} />

      {/* 遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* 花瓣飘落 */}
      <Petals count={25} />

      {/* 远山云雾装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* 标题区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* 装饰印章 */}
        <div className="absolute top-8 right-12 w-16 h-16 bg-cinnabar rounded flex items-center justify-center opacity-80 animate-stamp-press"
          style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
          <span className="font-brush text-rice text-xs leading-tight text-center">紅樓<br />一夢</span>
        </div>

        {/* 标题 */}
        <div className="animate-fade-in-down" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h1 className="font-brush text-7xl md:text-8xl gold-text tracking-widest mb-2 text-center"
            style={{ textShadow: '0 0 30px rgba(197,165,90,0.6), 2px 2px 0 #8B6914, -1px -1px 0 #8B6914, 3px 3px 8px rgba(0,0,0,0.5)' }}>
            红楼梦
          </h1>
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="font-kai text-gold text-2xl tracking-[0.5em] text-shadow-ink">黛玉传</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* 副标题诗句 */}
        <p className="font-kai text-rice/80 text-lg md:text-xl mt-6 mb-12 text-center animate-fade-in"
          style={{ animationDelay: '0.9s', opacity: 0, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
          满纸荒唐言，一把辛酸泪<br />
          都云作者痴，谁解其中味
        </p>

        {/* 按钮区域 */}
        {showMenu && (
          <div className="flex flex-col gap-4 items-center animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <button className="cinnabar-btn" onClick={handleNewGame}>
              初入贾府
            </button>
            {hasSave && (
              <button className="jade-btn" onClick={handleLoadGame}>
                前尘旧梦
              </button>
            )}
            <p className="font-song text-rice/50 text-sm mt-4 tracking-widest">
              — 对话推进 · 女主养成 · 多线结局 —
            </p>
          </div>
        )}

        {/* 底部 */}
        <div className="absolute bottom-6 text-rice/40 font-song text-xs tracking-widest">
          「木石前盟，金玉良缘，皆系于一念之间」
        </div>
      </div>
    </div>
  );
}
