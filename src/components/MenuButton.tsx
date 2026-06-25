import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, Home, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { playClick, toggleMute, isMuted } from '@/utils/audio';

export function MenuButton() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(isMuted());
  const saveGame = useGameStore(s => s.saveGame);
  const resetGame = useGameStore(s => s.resetGame);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSave = () => {
    playClick();
    saveGame();
    setOpen(false);
  };

  const handleHome = () => {
    playClick();
    resetGame();
    navigate('/');
    setOpen(false);
  };

  const handleToggleMute = () => {
    playClick();
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  const handleRestart = () => {
    playClick();
    if (confirm('确定要重新开始吗？当前进度将丢失。')) {
      resetGame();
      navigate('/');
    }
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 menu-container">
      <button
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          setOpen(!open);
        }}
        className="panel-side w-10 h-10 flex items-center justify-center hover:bg-gold/20 transition-colors"
        title="菜单"
      >
        <Settings size={20} color="#C5A55A" className={open ? 'rotate-90 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div className="absolute top-12 right-0 panel-side p-2 w-44 flex flex-col gap-1 animate-fade-in-down">
          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 hover:bg-gold/20 rounded transition-colors text-rice/90 font-song text-sm">
            <Save size={16} color="#C5A55A" />
            保存进度
          </button>
          <button onClick={handleToggleMute} className="flex items-center gap-2 px-3 py-2 hover:bg-gold/20 rounded transition-colors text-rice/90 font-song text-sm">
            {muted ? <VolumeX size={16} color="#C5A55A" /> : <Volume2 size={16} color="#C5A55A" />}
            {muted ? '开启声音' : '关闭声音'}
          </button>
          <div className="h-px bg-gold/20 my-1" />
          <button onClick={handleHome}
            className="flex items-center gap-2 px-3 py-2 hover:bg-cinnabar/40 rounded transition-colors text-rice/90 font-song text-sm">
            <Home size={16} color="#C84040" />
            返回标题
          </button>
          <button onClick={handleRestart}
            className="flex items-center gap-2 px-3 py-2 hover:bg-cinnabar/40 rounded transition-colors text-rice/90 font-song text-sm">
            <RotateCcw size={16} color="#C84040" />
            重新开始
          </button>
        </div>
      )}
    </div>
  );
}
