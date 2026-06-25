import { useState, useEffect, useRef } from 'react';

interface PortraitViewProps {
  imageUrl: string | null;
  speakerId: string;
}

export function PortraitView({ imageUrl, speakerId }: PortraitViewProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const prevSpeakerRef = useRef(speakerId);

  useEffect(() => {
    if (speakerId !== prevSpeakerRef.current) {
      setLoaded(false);
      setError(false);
      prevSpeakerRef.current = speakerId;
    }
    setCurrentUrl(imageUrl);

    // 检查图片是否已缓存（complete状态）
    if (imageUrl && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      }
    }
  }, [imageUrl, speakerId]);

  if (!currentUrl) {
    return null;
  }

  return (
    <div className="relative flex-shrink-0 self-end" style={{ width: '320px', height: '450px', marginBottom: '8px' }}>
      {/* 金色光晕 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(197,165,90,0.25) 0%, transparent 65%)',
        }}
      />

      {/* 花边框 - 使用真实DOM边框而非clip-path，更稳定 */}
      <div className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '50% 50% 48% 48% / 55% 55% 45% 45%',
          border: '3px solid #C5A55A',
          padding: '4px',
          background: 'linear-gradient(135deg, rgba(139,26,26,0.3) 0%, rgba(107,16,16,0.3) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(197,165,90,0.2)',
        }}
      >
        <div className="w-full h-full overflow-hidden"
          style={{ borderRadius: '50% 50% 48% 48% / 55% 55% 45% 45%' }}
        >
          {!error && (
            <img
              ref={imgRef}
              src={currentUrl}
              alt="人物立绘"
              className={`w-full h-full object-cover object-top transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              onError={() => { setError(true); setLoaded(true); }}
              style={{
                animation: loaded ? 'breathe 4s ease-in-out infinite' : 'none',
                transformOrigin: 'center bottom',
              }}
            />
          )}
          {/* 加载占位 */}
          {!loaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
              <div className="text-gold/60 font-kai text-sm animate-pulse">画像生成中...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-rice/10 to-ink/60">
              <div className="text-gold/80 font-brush text-2xl">人物像</div>
            </div>
          )}
        </div>

        {/* 内边缘柔化 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px 12px rgba(26,26,26,0.5)',
            borderRadius: '50% 50% 48% 48% / 55% 55% 45% 45%',
          }}
        />
      </div>

      {/* 装饰 - 金色外光环 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(197,165,90,0.1) 70%, transparent 75%)',
          transform: 'scale(1.15)',
        }}
      />
    </div>
  );
}
