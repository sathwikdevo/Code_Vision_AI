import type { Lesson } from '@/types/lesson';

const STORAGE_KEY = 'codevision_lessons';

export function getSavedLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveLesson(lesson: Lesson): void {
  try {
    const existing = getSavedLessons();
    const filtered = existing.filter((l) => l.id !== lesson.id);
    filtered.unshift(lesson);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Storage might be full or unavailable
  }
}

export function deleteLesson(id: string): void {
  try {
    const existing = getSavedLessons();
    const filtered = existing.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export function getLessonById(id: string): Lesson | null {
  const lessons = getSavedLessons();
  return lessons.find((l) => l.id === id) ?? null;
}
