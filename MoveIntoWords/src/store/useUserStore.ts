/**
 * useUserStore — Global user profile state.
 *
 * Fields are populated via getUserProfile() when the auth state changes.
 * Cleared on signOut().
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
  /** Whether the user has completed all onboarding steps */
  onboardingComplete: boolean;

  // ── Actions ──────────────────────────────────────────
  setUser: (data: { uid: string; displayName: string; email: string }) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  setRitual: (ritual: Partial<UserRitual>) => void;
  setOnboardingComplete: (complete: boolean) => void;
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
  onboardingComplete: false,

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

  setOnboardingComplete: (complete) =>
    set({ onboardingComplete: complete }),

  clearUser: () =>
    set({
      uid: null,
      displayName: null,
      email: null,
      preferences: DEFAULT_PREFERENCES,
      ritual: DEFAULT_RITUAL,
      onboardingComplete: false,
    }),
}));
