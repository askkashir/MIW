/**
 * useJournalStore — Global journal entries and module progress state.
 *
 * All arrays start empty. Firestore will populate these via
 * src/services/firebase/firestore.ts stubs once Firebase is integrated.
 *
 * TODO (Firebase): Call loadEntries() and loadModuleProgress() after
 * the user signs in (in the onAuthStateChanged listener).
 */

import { create } from 'zustand';
import { JournalEntry, ModuleProgress } from '../types';

interface JournalState {
  /** All saved journal entries, newest first */
  entries: JournalEntry[];
  /** Progress records for each module the user has started */
  moduleProgress: ModuleProgress[];

  // ── Actions ──────────────────────────────────────────
  addEntry: (entry: JournalEntry) => void;
  setEntries: (entries: JournalEntry[]) => void;
  updateModuleProgress: (progress: ModuleProgress) => void;
  setModuleProgress: (progress: ModuleProgress[]) => void;
  clearAll: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  moduleProgress: [],

  addEntry: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries] })),

  setEntries: (entries) => set({ entries }),

  updateModuleProgress: (progress) =>
    set((state) => {
      const existing = state.moduleProgress.findIndex(
        (p) => p.moduleId === progress.moduleId,
      );
      if (existing >= 0) {
        const updated = [...state.moduleProgress];
        updated[existing] = progress;
        return { moduleProgress: updated };
      }
      return { moduleProgress: [...state.moduleProgress, progress] };
    }),

  setModuleProgress: (moduleProgress) => set({ moduleProgress }),

  clearAll: () => set({ entries: [], moduleProgress: [] }),
}));
