import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { AttributePanel } from './AttributePanel';
import { RelationshipPanel } from './RelationshipPanel';
import { DialogueBox } from './DialogueBox';
import { PortraitView } from './PortraitView';
import { MenuButton } from './MenuButton';
import { Petals } from './Petals';
import { getCachedImage } from '@/utils/imageCache';
import { scenes } from '@/data/scenes';
import { chapters } from '@/data/chapters';
import { startBGM, stopBGM, playChapterBell } from '@/utils/audio';

export function GameScreen() {
  const navigate = useNavigate();
  const isStarted = useGameStore(s => s.isStarted);
  const isEnded = useGameStore(s => s.isEnded);
  const currentEndingId = useGameStore(s => s.currentEndingId);
  const currentChapter = useGameStore(s => s.currentChapter);
  const isTransitioning = useGameStore(s => s.isTransitioning);
  const popups = useGameStore(s => s.popups);

  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [speakerId, setSpeakerId] = useState<string>('narrator');
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [showChapterIntro, setShowChapterIntro] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const bgmStarted = useRef(false);
  const bgImgRef = useRef<HTMLImageElement>(null);

  // 启动BGM（用户首次点击后）
  useEffect(() => {
    if (!bgmStarted.current) {
      const handler = () => {
        startBGM();
        bgmStarted.current = true;
        document.removeEventListener('click', handler);
      };
      document.addEventListener('click', handler);
      return () => {
        document.removeEventListener('click', handler);
        stopBGM();
      };
    }
  }, []);

  useEffect(() => {
    return () => stopBGM();
  }, []);

  // 初始化背景
  useEffect(() => {
    const bgKey = 'rongguo_main';
    if (scenes[bgKey]) {
      setBgUrl(getCachedImage(`bg_${bgKey}`, scenes[bgKey].prompt, 'landscape_16_9'));
      setBgLoaded(false);
    }
  }, []);

  // 检测缓存背景图是否已加载
  useEffect(() => {
    if (bgUrl && bgImgRef.current) {
      if (bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0) {
        setBgLoaded(true);
      }
    }
  }, [bgUrl]);

  // 章节切换引言
  useEffect(() => {
    if (!isStarted) {
      navigate('/');
      return;
    }
    if (isEnded && currentEndingId) {
      navigate(`/ending/${currentEndingId}`);
      return;
    }
    const chapter = chapters.find(c => c.id === currentChapter);
    if (chapter) {
      setShowChapterIntro(true);
      playChapterBell();
      const timer = setTimeout(() => setShowChapterIntro(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentChapter, isStarted, isEnded, currentEndingId, navigate]);

  const chapter = chapters.find(c => c.id === currentChapter);

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink">
      {/* 背景 */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
      />
      {bgUrl && (
        <img
          ref={bgImgRef}
          src={bgUrl}
          alt=""
          className="hidden"
          onLoad={() => setBgLoaded(true)}
        />
      )}

      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

      {/* 花瓣 */}
      <Petals count={10} />

      {/* 章节引言 */}
      {showChapterIntro && chapter && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 animate-fade-in">
          <div className="text-center animate-fade-in-up">
            <p className="font-brush text-gold text-5xl mb-4 tracking-widest">{chapter.title}</p>
            <p className="font-kai text-rice text-2xl mb-6 tracking-[0.3em]">{chapter.subtitle}</p>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-song text-rice/70 text-base max-w-lg px-4 leading-relaxed italic">
              {chapter.intro}
            </p>
          </div>
        </div>
      )}

      {/* 水墨过渡 */}
      {isTransitioning && <div className="ink-transition" />}

      {/* 属性浮动提示 */}
      <div className="fixed top-20 left-72 z-30 flex flex-col gap-2 pointer-events-none">
        {popups.map(p => (
          <div key={p.id} className="attr-popup font-kai text-sm px-3 py-1 rounded"
            style={{ color: p.color, background: 'rgba(245,240,232,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {p.text}
          </div>
        ))}
      </div>

      {/* 顶部章节栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-3 pointer-events-none">
        <div className="panel-side px-6 py-2 flex items-center gap-3" style={{ pointerEvents: 'auto' }}>
          <span className="font-kai text-gold text-sm">{chapter?.title}</span>
          <span className="text-rice/30">|</span>
          <span className="font-song text-rice/80 text-sm">{chapter?.subtitle}</span>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 w-full h-full flex items-stretch pt-16 pb-6 px-4">
        {/* 左侧属性面板 */}
        <div className="flex flex-col justify-start pr-2 pt-4 flex-shrink-0">
          <AttributePanel />
        </div>

        {/* 中间立绘 + 对话 */}
        <div className="flex-1 flex flex-col items-center justify-end pb-4 min-w-0 relative">
          {/* 立绘 - 固定在对话框上方居中 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[200px] pointer-events-none" style={{ zIndex: 5 }}>
            {portraitUrl && <PortraitView imageUrl={portraitUrl} speakerId={speakerId} />}
          </div>
          {/* 对话框 */}
          <div className="w-full relative z-20">
            <DialogueBox
              onPortraitChange={setPortraitUrl}
              onBackgroundChange={(url) => { if (url) { setBgUrl(url); setBgLoaded(false); } }}
              onSpeakerChange={setSpeakerId}
            />
          </div>
        </div>

        {/* 右侧关系面板 */}
        <div className="flex flex-col justify-start pt-4 flex-shrink-0">
          <RelationshipPanel />
        </div>
      </div>

      {/* 菜单按钮 */}
      <MenuButton />
    </div>
  );
}
