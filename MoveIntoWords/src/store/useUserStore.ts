/**
 * useUserStore — Global user profile state.
 *
 * All fields start as null/empty. Firebase Auth will populate `uid`,
 * `displayName`, and `email` on sign-in via src/services/firebase/auth.ts.
 * Preferences and ritual are saved locally during onboarding and will
 * eventually be persisted to Firestore via src/services/firebase/firestore.ts.
 *
 * TODO (Firebase): Call setUser() inside the onAuthStateChanged listener
 * once Firebase Auth is wired up.
 */

import { create } from 'zustand';
import { UserPreferences, UserRitual } from '../types';

interface UserState {
  /** Firebase UID — null until the user is authenticated */
  uid: string | null;
  /** Display name shown in the app (e.g. "Alex") */
  displayName: string | null;
  /** User's email address */
  email: string | null;
  /** Topics selected during Personalize screen */
  preferences: UserPreferences;
  /** Journaling ritual chosen during Ritual screen */
  ritual: UserRitual;

  // ── Actions ──────────────────────────────────────────
  setUser: (data: { uid: string; displayName: string; email: string }) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  setRitual: (ritual: Partial<UserRitual>) => void;
  clearUser: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  ageRange: null,
  gender: null,
  topics: [],
};

const DEFAULT_RITUAL: UserRitual = {
  timeOfDay: 'morning',
  remindersEnabled: true,
};

export const useUserStore = create<UserState>((set) => ({
  uid: null,
  displayName: null,
  email: null,
  preferences: DEFAULT_PREFERENCES,
  ritual: DEFAULT_RITUAL,

  setUser: ({ uid, displayName, email }) =>
    set({ uid, displayName, email }),

  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),

  setRitual: (ritual) =>
    set((state) => ({
      ritual: { ...state.ritual, ...ritual },
    })),

  clearUser: () =>
    set({
      uid: null,
      displayName: null,
      email: null,
      preferences: DEFAULT_PREFERENCES,
      ritual: DEFAULT_RITUAL,
    }),
}));
