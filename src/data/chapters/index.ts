import { Chapter } from '@/types';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { chapter3 } from './chapter3';
import { chapter4 } from './chapter4';
import { chapter5 } from './chapter5';
import { chapter6 } from './chapter6';

export const chapters: Chapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6];

export function getChapter(id: number): Chapter | undefined {
  return chapters.find(c => c.id === id);
}

export function getDialogue(chapterId: number, dialogueId: string) {
  const chapter = getChapter(chapterId);
  if (!chapter) return null;
  return chapter.dialogues.find(d => d.id === dialogueId) || null;
}
