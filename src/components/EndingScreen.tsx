import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { endings } from '@/data/endings';
import { useGameStore } from '@/store/gameStore';
import { getCachedImage } from '@/utils/imageCache';
import { Petals } from './Petals';
import { playClick, stopBGM } from '@/utils/audio';

export function EndingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resetGame = useGameStore(s => s.resetGame);
  const [showPoem, setShowPoem] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const bgImgRef = useRef<HTMLImageElement>(null);

  const ending = endings.find(e => e.id === id) || endings[0];
  const cgUrl = getCachedImage(`ending_${ending.id}`, ending.cgPrompt, 'landscape_16_9');

  const isTragic = ending.id.includes('tragic') || ending.id.includes('death') || ending.id === 'sick_death';

  useEffect(() => {
    stopBGM();
    // Check cached image
    if (bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0) {
      setBgLoaded(true);
    }
    const t1 = setTimeout(() => setShowPoem(true), 1500);
    const t2 = setTimeout(() => setShowDesc(true), 3500);
    const t3 = setTimeout(() => setShowBtn(true), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleRestart = () => {
    playClick();
    resetGame();
    navigate('/');
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink">
      {/* 结局CG */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: bgLoaded ? `url(${cgUrl})` : undefined }}
      />
      <img ref={bgImgRef} src={cgUrl} alt="" className="hidden" onLoad={() => setBgLoaded(true)} />

      {/* 遮罩 */}
      <div className={`absolute inset-0 ${isTragic ? 'bg-gradient-to-t from-black/80 via-black/40 to-black/30' : 'bg-gradient-to-t from-black/70 via-black/30 to-black/20'}`} />

      {/* 花瓣/落叶 */}
      {!isTragic && <Petals count={15} />}
      {isTragic && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}
              className="petal"
              style={{
                left: `${Math.random() * 100}%`,
                width: '6px',
                height: '6px',
                background: 'radial-gradient(circle, #8B6914, #5C4410)',
                animationDuration: `${10 + Math.random() * 8}s`,
                animationDelay: `${Math.random() * 5}s`,
                animationName: 'petalFall',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* 结局标题 */}
      <div className="absolute top-12 left-0 right-0 text-center z-10 animate-fade-in-down" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <p className="font-kai text-gold text-2xl tracking-[0.5em] mb-2" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
          {ending.subtitle}
        </p>
        <h1 className="font-brush text-6xl gold-text tracking-widest"
          style={{ textShadow: '0 0 30px rgba(197,165,90,0.8), 2px 2px 0 #8B6914, -1px -1px 0 #8B6914, 3px 3px 8px rgba(0,0,0,0.7)' }}>
          {ending.title}
        </h1>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
      </div>

      {/* 结局诗词 */}
      {showPoem && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-8 py-6 border border-gold/30">
            <p className="font-kai text-rice text-xl leading-loose text-center whitespace-pre-line tracking-widest"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
              {ending.poem}
            </p>
          </div>
        </div>
      )}

      {/* 结局描述 */}
      {showDesc && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 max-w-2xl px-6 animate-fade-in-up">
          <p className="font-song text-rice/90 text-base leading-relaxed text-center"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9)' }}>
            {ending.description}
          </p>
        </div>
      )}

      {/* 重玩按钮 */}
      {showBtn && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 animate-fade-in-up">
          <button className="cinnabar-btn" onClick={handleRestart}>
            再入红尘
          </button>
        </div>
      )}

      {/* 终章印章 */}
      <div className="absolute bottom-6 right-8 z-10 opacity-70">
        <div className="w-14 h-14 bg-cinnabar rounded flex items-center justify-center" style={{ transform: 'rotate(-5deg)' }}>
          <span className="font-brush text-rice text-sm text-center leading-tight">终<br />幕</span>
        </div>
      </div>
    </div>
  );
}
