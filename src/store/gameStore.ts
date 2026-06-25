import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, INITIAL_STATE, Choice, Effect, Dialogue, Attributes } from '@/types';
import { chapters, getDialogue } from '@/data/chapters';
import { determineEnding } from '@/data/endings';

interface AttributePopup {
  id: number;
  text: string;
  color: string;
}

interface GameStore extends GameState {
  // Actions
  startNewGame: () => void;
  loadGame: () => boolean;
  advanceDialogue: (nextId?: string) => void;
  makeChoice: (choice: Choice) => void;
  applyEffects: (effects: Effect[]) => void;
  goToChapter: (chapterId: number) => void;
  setEnding: (endingId: string) => void;
  resetGame: () => void;
  saveGame: () => void;
  // UI state
  isTransitioning: boolean;
  setTransitioning: (v: boolean) => void;
  showChoices: boolean;
  setShowChoices: (v: boolean) => void;
  popups: AttributePopup[];
  addPopup: (popup: Omit<AttributePopup, 'id'>) => void;
  removePopup: (id: number) => void;
  textSpeed: number;
  setTextSpeed: (s: number) => void;
}

let popupId = 0;

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      isTransitioning: false,
      showChoices: false,
      popups: [],
      textSpeed: 40,

      setTransitioning: (v) => set({ isTransitioning: v }),
      setShowChoices: (v) => set({ showChoices: v }),

      addPopup: (popup) => {
        const id = ++popupId;
        set((state) => ({ popups: [...state.popups, { ...popup, id }] }));
        setTimeout(() => get().removePopup(id), 1500);
      },
      removePopup: (id) => set((state) => ({ popups: state.popups.filter(p => p.id !== id) })),

      setTextSpeed: (s) => set({ textSpeed: s }),

      startNewGame: () => {
        set({
          ...INITIAL_STATE,
          isStarted: true,
          isEnded: false,
          currentChapter: 1,
          currentDialogueId: chapters[0].startDialogue,
          popups: [],
          isTransitioning: false,
          showChoices: false,
        });
      },

      loadGame: () => {
        try {
          const saved = localStorage.getItem('hongloumeng-save');
          if (saved) {
            const data = JSON.parse(saved) as GameState;
            if (data.isStarted) {
              set({
                ...data,
                popups: [],
                isTransitioning: false,
              });
              return true;
            }
          }
        } catch { /* ignore */ }
        return false;
      },

      saveGame: () => {
        const state = get();
        const saveData: GameState = {
          currentChapter: state.currentChapter,
          currentDialogueId: state.currentDialogueId,
          attributes: state.attributes,
          relationships: state.relationships,
          flags: state.flags,
          playerName: state.playerName,
          isStarted: state.isStarted,
          isEnded: state.isEnded,
          currentEndingId: state.currentEndingId,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('hongloumeng-save', JSON.stringify(saveData));
      },

      resetGame: () => {
        set({
          ...INITIAL_STATE,
          isStarted: false,
          isEnded: false,
          popups: [],
        });
      },

      applyEffects: (effects) => {
        const state = get();
        const newAttrs = { ...state.attributes };
        const newRels = { ...state.relationships };
        const newFlags = [...state.flags];

        const attrNames: Record<string, string> = {
          talent: '才情', beauty: '容貌', virtue: '德行', cunning: '心计', health: '健康',
        };

        effects.forEach(eff => {
          if (eff.type === 'attribute' && typeof eff.value === 'number') {
            const key = eff.target as keyof Attributes;
            const oldVal = newAttrs[key];
            const change = eff.operation === 'set' ? eff.value : (eff.value as number);
            if (eff.operation === 'add') {
              newAttrs[key] = clamp(oldVal + change);
            } else {
              newAttrs[key] = clamp(change);
            }
            const actual = newAttrs[key] - oldVal;
            if (actual !== 0) {
              const isPositive = actual > 0;
              get().addPopup({
                text: `${attrNames[key]} ${isPositive ? '+' : ''}${actual}`,
                color: isPositive ? '#2D5A27' : '#8B1A1A',
              });
            }
          } else if (eff.type === 'relationship' && typeof eff.value === 'number') {
            const oldVal = newRels[eff.target] ?? 50;
            const change = eff.operation === 'set' ? eff.value : (eff.value as number);
            if (eff.operation === 'add') {
              newRels[eff.target] = clamp(oldVal + change);
            } else {
              newRels[eff.target] = clamp(change);
            }
            const actual = newRels[eff.target] - oldVal;
            if (actual !== 0) {
              const charNames: Record<string, string> = {
                baoyu: '宝玉', baochai: '宝钗', xifeng: '凤姐', jiamu: '贾母',
                xiren: '袭人', zijuan: '紫鹃', tanchun: '探春',
              };
              const isPositive = actual > 0;
              get().addPopup({
                text: `${charNames[eff.target] || eff.target} 好感 ${isPositive ? '+' : ''}${actual}`,
                color: isPositive ? '#C5A55A' : '#8B1A1A',
              });
            }
          } else if (eff.type === 'flag' && typeof eff.value === 'string') {
            if (!newFlags.includes(eff.value)) {
              newFlags.push(eff.value);
            }
          }
        });

        set({ attributes: newAttrs, relationships: newRels, flags: newFlags });
      },

      advanceDialogue: (nextId) => {
        const state = get();
        const current = getDialogue(state.currentChapter, state.currentDialogueId);
        if (!current) return;

        // Apply auto effects
        if (current.effects) {
          get().applyEffects(current.effects);
        }

        // Health check for early death
        if (state.attributes.health <= 0 && !state.isEnded) {
          const ending = determineEnding({ ...state, flags: [...state.flags, 'tragic_death'] });
          set({ isEnded: true, currentEndingId: ending.id });
          return;
        }

        // Determine next dialogue
        const targetId = nextId || current.next;
        if (!targetId) return;

        if (current.chapterEnd) {
          // Save game at chapter end
          get().saveGame();

          // Check if it's the final chapter (chapters are 1-indexed id, array is 0-indexed)
          const nextChapterIdx = state.currentChapter; // currentChapter is 1-based, so next is at index currentChapter
          if (nextChapterIdx >= chapters.length) {
            const ending = determineEnding(get());
            set({ isEnded: true, currentEndingId: ending.id, showChoices: false });
            return;
          }
          // Transition to next chapter
          set({ isTransitioning: true, showChoices: false });
          setTimeout(() => {
            const nextChapter = chapters[nextChapterIdx];
            set({
              currentChapter: state.currentChapter + 1,
              currentDialogueId: nextChapter ? nextChapter.startDialogue : targetId,
              isTransitioning: false,
            });
            get().saveGame();
          }, 1200);
          return;
        }

        set({ currentDialogueId: targetId, showChoices: false });
      },

      makeChoice: (choice) => {
        if (choice.effects) {
          get().applyEffects(choice.effects);
        }
        set({ showChoices: false });
        setTimeout(() => {
          get().advanceDialogue(choice.next);
        }, 250);
      },

      goToChapter: (chapterId) => {
        const chapter = chapters.find(c => c.id === chapterId);
        if (chapter) {
          set({ currentChapter: chapterId, currentDialogueId: chapter.startDialogue, isTransitioning: true, showChoices: false });
          setTimeout(() => set({ isTransitioning: false }), 1200);
        }
      },

      setEnding: (endingId) => {
        set({ isEnded: true, currentEndingId: endingId });
      },
    }),
    {
      name: 'hongloumeng-game',
      partialize: (state) => ({
        currentChapter: state.currentChapter,
        currentDialogueId: state.currentDialogueId,
        attributes: state.attributes,
        relationships: state.relationships,
        flags: state.flags,
        playerName: state.playerName,
        isStarted: state.isStarted,
        isEnded: state.isEnded,
        currentEndingId: state.currentEndingId,
        savedAt: state.savedAt,
      }),
    }
  )
);

export function getCurrentDialogue(): Dialogue | null {
  const state = useGameStore.getState();
  return getDialogue(state.currentChapter, state.currentDialogueId);
}

export function hasSaveData(): boolean {
  try {
    const saved = localStorage.getItem('hongloumeng-save');
    if (saved) {
      const data = JSON.parse(saved) as GameState;
      return data.isStarted === true;
    }
  } catch { /* ignore */ }
  return false;
}
