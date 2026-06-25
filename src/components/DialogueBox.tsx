import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getDialogue } from '@/data/chapters';
import { characters } from '@/data/characters';
import { scenes } from '@/data/scenes';
import { getCachedImage } from '@/utils/imageCache';
import { useTypewriter } from '@/hooks/useTypewriter';
import { playClick } from '@/utils/audio';

interface DialogueBoxProps {
  onPortraitChange?: (url: string | null) => void;
  onBackgroundChange?: (url: string | null) => void;
  onSpeakerChange?: (speakerId: string) => void;
}

export function DialogueBox({ onPortraitChange, onBackgroundChange, onSpeakerChange }: DialogueBoxProps) {
  // 必须通过selector订阅store状态，否则组件不会响应式重渲染
  const currentChapterId = useGameStore(s => s.currentChapter);
  const currentDialogueId = useGameStore(s => s.currentDialogueId);
  const textSpeed = useGameStore(s => s.textSpeed);
  const showChoices = useGameStore(s => s.showChoices);
  const setShowChoices = useGameStore(s => s.setShowChoices);
  const advanceDialogue = useGameStore(s => s.advanceDialogue);
  const makeChoice = useGameStore(s => s.makeChoice);
  const attributes = useGameStore(s => s.attributes);
  const relationships = useGameStore(s => s.relationships);
  const flags = useGameStore(s => s.flags);
  const isTransitioning = useGameStore(s => s.isTransitioning);

  // 使用useMemo根据订阅的ID获取当前对话，确保响应式更新
  const dialogue = useMemo(
    () => getDialogue(currentChapterId, currentDialogueId),
    [currentChapterId, currentDialogueId]
  );

  const { displayed, isComplete, skip } = useTypewriter(dialogue?.text || '', textSpeed);
  const clickBlocked = useRef(false);

  // 判定选项条件是否满足
  const checkCondition = useCallback((cond?: { type: string; target?: string; operator: string; value: number | string }) => {
    if (!cond) return true;
    const target = cond.target || '';
    let val: number | string | boolean;
    if (cond.type === 'attribute') {
      val = attributes[target as keyof typeof attributes];
    } else if (cond.type === 'relationship') {
      val = relationships[target] ?? 30;
    } else if (cond.type === 'flag') {
      val = flags.includes(String(cond.value));
      if (cond.operator === 'has') return val === true;
      if (cond.operator === '!has') return val === false;
      return true;
    } else {
      return true;
    }
    switch (cond.operator) {
      case '>=': return Number(val) >= Number(cond.value);
      case '<=': return Number(val) <= Number(cond.value);
      case '>': return Number(val) > Number(cond.value);
      case '<': return Number(val) < Number(cond.value);
      case '==': return val === cond.value;
      case '!=': return val !== cond.value;
      default: return true;
    }
  }, [attributes, relationships, flags]);

  useEffect(() => {
    if (!dialogue) return;
    onSpeakerChange?.(dialogue.speaker);

    // 触发立绘变化
    const charId = dialogue.portrait || (dialogue.speaker !== 'narrator' ? dialogue.speaker : null);
    if (charId) {
      const char = characters[charId];
      if (char && char.portraitPrompt) {
        onPortraitChange?.(getCachedImage(`portrait_${charId}`, char.portraitPrompt, 'portrait_4_3'));
      } else {
        onPortraitChange?.(null);
      }
    } else {
      onPortraitChange?.(null);
    }

    // 背景变化
    if (dialogue.background && scenes[dialogue.background]) {
      onBackgroundChange?.(getCachedImage(`bg_${dialogue.background}`, scenes[dialogue.background].prompt, 'landscape_16_9'));
    }
  }, [dialogue?.id, onPortraitChange, onBackgroundChange, onSpeakerChange]);

  // 计算可用选项
  const availableChoices = dialogue?.choices
    ? dialogue.choices.filter(c => checkCondition(c.condition))
    : [];
  const hasChoices = availableChoices.length > 0;

  useEffect(() => {
    if (isComplete && hasChoices && !showChoices) {
      const t = setTimeout(() => setShowChoices(true), 300);
      return () => clearTimeout(t);
    }
    // 如果有choices字段但所有选项都被过滤掉了，自动前进
    if (isComplete && dialogue?.choices && dialogue.choices.length > 0 && availableChoices.length === 0 && !showChoices) {
      const t = setTimeout(() => advanceDialogue(), 500);
      return () => clearTimeout(t);
    }
  }, [isComplete, hasChoices, showChoices, setShowChoices, dialogue?.id, availableChoices.length, advanceDialogue]);

  // 重置showChoices当对话切换
  useEffect(() => {
    setShowChoices(false);
    clickBlocked.current = false;
  }, [dialogue?.id, setShowChoices]);

  if (!dialogue) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="scroll-box p-6 pt-8 flex items-center justify-center min-h-[120px]">
          <span className="font-kai text-ink/50">加载中...</span>
        </div>
      </div>
    );
  }

  const isNarrator = dialogue.speaker === 'narrator';
  const char = isNarrator ? null : characters[dialogue.speaker];

  const handleClick = () => {
    if (isTransitioning || clickBlocked.current) return;
    playClick();
    if (!isComplete) {
      skip();
      return;
    }
    // 如果有选项显示中，不前进
    if (showChoices && hasChoices) {
      return;
    }
    clickBlocked.current = true;
    setTimeout(() => { clickBlocked.current = false; }, 300);
    advanceDialogue();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* 选项区 */}
      {showChoices && hasChoices && (
        <div className="flex flex-col gap-2 mb-4">
          {availableChoices.map((choice, idx) => (
            <button
              key={choice.id}
              className="choice-btn animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                clickBlocked.current = true;
                setTimeout(() => { clickBlocked.current = false; }, 300);
                makeChoice(choice);
              }}
            >
              <span className="text-cinnabar mr-2 font-brush text-lg">{'甲乙丙丁'[idx] || '·'}</span>
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {/* 对话框 */}
      <div className="scroll-box p-6 pt-8 cursor-pointer select-none relative z-10" onClick={handleClick}>
        {!isNarrator && char && (
          <div className="absolute -top-4 left-6 seal-tag text-lg" style={{ background: char.color }}>
            {dialogue.speakerName || char.name}
          </div>
        )}
        {isNarrator && (
          <div className="absolute -top-4 left-6 seal-tag text-lg" style={{ background: '#5C4033' }}>
            旁白
          </div>
        )}

        <div className={`font-song text-ink leading-relaxed text-lg min-h-[90px] ${isNarrator ? 'text-center italic text-ink/80' : ''}`}
          style={{ textIndent: isNarrator ? '0' : '2em', whiteSpace: 'pre-wrap' }}>
          {displayed}
          {!isComplete && <span className="typewriter-cursor" />}
        </div>

        {isComplete && !showChoices && (
          <div className="text-right mt-2 text-ink/40 text-xs font-kai animate-pulse">
            点击继续 ▼
          </div>
        )}
      </div>
    </div>
  );
}
