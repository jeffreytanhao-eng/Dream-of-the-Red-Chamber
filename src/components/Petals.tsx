import { useEffect, useState, useMemo } from 'react';

interface PetalProps {
  count?: number;
}

export function Petals({ count = 20 }: PetalProps) {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['#FFB7C5', '#E8899E', '#FFD4DB', '#F5C6D0', '#FFAEC0'];
    const arr = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPetals(arr);
  }, [count]);

  const style = useMemo(() => ({
    position: 'fixed' as const,
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none' as const,
    zIndex: 2,
  }), []);

  return (
    <div style={style}>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(ellipse at 30% 30%, ${p.color} 0%, ${p.color}99 50%, ${p.color}66 100%)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationName: 'petalFall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
}
