import { useState, useEffect, useCallback, useRef } from 'react';

export function useTypewriter(text: string, speed: number = 40) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef(text);
  const speedRef = useRef(speed);

  useEffect(() => {
    textRef.current = text;
    speedRef.current = speed;
  }, [text, speed]);

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      setIsComplete(true);
      return;
    }
    setDisplayed('');
    setIsComplete(false);
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      i++;
      const current = textRef.current;
      if (i >= current.length) {
        setDisplayed(current);
        setIsComplete(true);
        return;
      }
      setDisplayed(current.slice(0, i));
      setTimeout(tick, speedRef.current);
    };

    const timer = setTimeout(tick, speed);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text]);

  const skip = useCallback(() => {
    setDisplayed(textRef.current);
    setIsComplete(true);
  }, []);

  return { displayed, isComplete, skip };
}
