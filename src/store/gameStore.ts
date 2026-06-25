import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, INITIAL_STATE, Choice, Effect, Dialogue, Attributes } from '@/types';
import { chapters, getDialogue } from '@/data/chapters';
import { determineEnding } from '@/data/endings';

const STORAGE_KEY = 'hongloumeng-save';

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
  // Chapter epilogue
  showingChapterEnd: boolean;
  setShowingChapterEnd: (v: boolean) => void;
}

let popupId = 0;
const popupTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      isTransitioning: false,
      showChoices: false,
      popups: [],
      textSpeed: 40,
      showingChapterEnd: false,

      setTransitioning: (v) => set({ isTransitioning: v }),
      setShowChoices: (v) => set({ showChoices: v }),
      setShowingChapterEnd: (v) => set({ showingChapterEnd: v }),

      addPopup: (popup) => {
        const id = ++popupId;
        set((state) => ({ popups: [...state.popups, { ...popup, id }] }));
        const timer = setTimeout(() => {
          get().removePopup(id);
          popupTimeouts.delete(id);
        }, 1500);
        popupTimeouts.set(id, timer);
      },
      removePopup: (id) => {
        set((state) => ({ popups: state.popups.filter(p => p.id !== id) }));
        const timer = popupTimeouts.get(id);
        if (timer) { clearTimeout(timer); popupTimeouts.delete(id); }
      },

      setTextSpeed: (s) => set({ textSpeed: s }),

      startNewGame: () => {
        popupTimeouts.forEach(t => clearTimeout(t));
        popupTimeouts.clear();
        set({
          ...INITIAL_STATE,
          isStarted: true,
          isEnded: false,
          currentChapter: 1,
          currentDialogueId: chapters[0].startDialogue,
          popups: [],
          isTransitioning: false,
          showChoices: false,
          showingChapterEnd: false,
          flags: [],
          attributes: { ...INITIAL_STATE.attributes },
          relationships: { ...INITIAL_STATE.relationships },
        });
      },

      loadGame: () => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const data = JSON.parse(raw);
            // zustand persist wraps in { state: ... } if using persist middleware
            const state = data.state ? data.state : data;
            if (state.isStarted) {
              popupTimeouts.forEach(t => clearTimeout(t));
              popupTimeouts.clear();
              set({
                ...state,
                popups: [],
                isTransitioning: false,
                showChoices: false,
                showingChapterEnd: false,
              });
              return true;
            }
          }
        } catch { /* ignore */ }
        return false;
      },

      saveGame: () => {
        const state = get();
        const saveData: Partial<GameState> = {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      },

      resetGame: () => {
        popupTimeouts.forEach(t => clearTimeout(t));
        popupTimeouts.clear();
        set({
          ...INITIAL_STATE,
          isStarted: false,
          isEnded: false,
          popups: [],
          isTransitioning: false,
          showChoices: false,
          showingChapterEnd: false,
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
        const charNames: Record<string, string> = {
          baoyu: '宝玉', baochai: '宝钗', xifeng: '凤姐', jiamu: '贾母',
          xiren: '袭人', zijuan: '紫鹃', tanchun: '探春',
        };

        effects.forEach(eff => {
          if (eff.type === 'attribute' && typeof eff.value === 'number') {
            const key = eff.target as keyof Attributes;
            const oldVal = newAttrs[key];
            if (eff.operation === 'add') {
              newAttrs[key] = clamp(oldVal + (eff.value as number));
            } else {
              newAttrs[key] = clamp(eff.value);
            }
            const actual = newAttrs[key] - oldVal;
            if (actual !== 0) {
              get().addPopup({
                text: `${attrNames[key]} ${actual > 0 ? '+' : ''}${actual}`,
                color: actual > 0 ? '#2D5A27' : '#8B1A1A',
              });
            }
          } else if (eff.type === 'relationship' && typeof eff.value === 'number') {
            const target = eff.target!;
            const oldVal = newRels[target] ?? 50;
            if (eff.operation === 'add') {
              newRels[target] = clamp(oldVal + (eff.value as number));
            } else {
              newRels[target] = clamp(eff.value);
            }
            const actual = newRels[target] - oldVal;
            if (actual !== 0) {
              get().addPopup({
                text: `${charNames[target] || target} 好感 ${actual > 0 ? '+' : ''}${actual}`,
                color: actual > 0 ? '#C5A55A' : '#8B1A1A',
              });
            }
          } else if (eff.type === 'flag' && typeof eff.value === 'string') {
            if (!newFlags.includes(eff.value)) {
              newFlags.push(eff.value);
            }
          }
        });

        set({ attributes: newAttrs, relationships: newRels, flags: newFlags });

        // After applying effects, check for health death (using fresh state)
        if (newAttrs.health <= 0 && !get().isEnded) {
          const ending = determineEnding({ ...get(), attributes: newAttrs, flags: newFlags });
          set({ isEnded: true, currentEndingId: ending.id, showChoices: false });
        }
      },

      advanceDialogue: (nextId) => {
        const state = get();
        const current = getDialogue(state.currentChapter, state.currentDialogueId);
        if (!current) return;

        // Apply auto effects of current dialogue
        if (current.effects) {
          get().applyEffects(current.effects);
        }

        // Re-get state after effects
        const afterState = get();
        if (afterState.isEnded) return;

        // If currently showing chapter epilogue (we are on chX_end node), transition to next chapter
        if (state.showingChapterEnd) {
          const nextChapterIdx = state.currentChapter; // 1-based to 0-indexed
          if (nextChapterIdx >= chapters.length) {
            const ending = determineEnding(get());
            set({ isEnded: true, currentEndingId: ending.id, showChoices: false, showingChapterEnd: false });
            return;
          }
          set({ isTransitioning: true, showChoices: false, showingChapterEnd: false });
          setTimeout(() => {
            const s = get();
            const nextChapter = chapters[nextChapterIdx];
            set({
              currentChapter: s.currentChapter + 1,
              currentDialogueId: nextChapter.startDialogue,
              isTransitioning: false,
            });
            get().saveGame();
          }, 1200);
          return;
        }

        // Determine next dialogue
        const targetId = nextId || current.next;

        // Hit chapterEnd trigger: advance to epilogue node (chX_end)
        if (current.chapterEnd) {
          set({ showingChapterEnd: true, showChoices: false });
          get().saveGame();
          if (targetId) {
            set({ currentDialogueId: targetId });
          }
          return;
        }

        if (!targetId) return;
        set({ currentDialogueId: targetId, showChoices: false });
      },

      makeChoice: (choice) => {
        if (choice.effects) {
          get().applyEffects(choice.effects);
        }
        // After effects, check if game ended
        if (get().isEnded) {
          set({ showChoices: false });
          return;
        }
        set({ showChoices: false });
        setTimeout(() => {
          get().advanceDialogue(choice.next);
        }, 250);
      },
    }),
    {
      name: STORAGE_KEY,
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
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      const state = data.state || data;
      return state.isStarted === true;
    }
  } catch { /* ignore */ }
  return false;
}
