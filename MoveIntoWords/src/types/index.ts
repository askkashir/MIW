/**
 * Navigation param lists for all navigators in the app.
 *
 * Each interface maps a screen name to its route params.
 * `undefined` means the screen takes no params.
 *
 * When Firebase is integrated, pass user/session data as
 * navigate() params where needed.
 */

// ── Auth flow (linear stack before the user reaches the main app) ─────────────
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignUp: undefined;
  SignIn: undefined;
  SignUpEmail: undefined;
  Verification: undefined;
  Disclaimer: undefined;
  Personalize: undefined;
  Ritual: undefined;
  /** Sentinel screen that renders MainTabs — never navigated to by name from screens */
  Main: undefined;
};

// ── Main bottom-tab navigator ─────────────────────────────────────────────────
export type MainTabParamList = {
  Dashboard: undefined;
  ModulesStack: undefined;
  JourneyStack: undefined;
  MoreStack: undefined;
  /** Journal flow as a modal tab, launched via the floating Write button */
  JournalStack: undefined;
};

// ── Modules nested stack ──────────────────────────────────────────────────────
export type ModulesStackParamList = {
  ModulesHome: undefined;
  ModuleDetail: undefined;
  ModuleWrite: undefined;
  ModuleDeepen: undefined;
  ModuleSave: undefined;
};

// ── Journal nested stack (modal) ──────────────────────────────────────────────
export type JournalStackParamList = {
  JournalWrite: undefined;
  JournalDeepen: undefined;
  JournalReflect: undefined;
  JournalSave: undefined;
};

// ── Journey nested stack ──────────────────────────────────────────────────────
export type JourneyStackParamList = {
  JourneyHome: undefined;
  EntryArchive: undefined;
};

// ── More nested stack ─────────────────────────────────────────────────────────
export type MoreStackParamList = {
  MoreHome: undefined;
  MemberPerks: undefined;
};

// ── Domain models ─────────────────────────────────────────────────────────────

/** A single saved journal entry */
export interface JournalEntry {
  id: string;
  /** Main body text shown in the card preview */
  content: string;
  /** Unix timestamp (ms) of creation */
  createdAt: number;
}

/** Progress record for a guided module */
export interface ModuleProgress {
  moduleId: string;
  currentStep: number;
  totalSteps: number;
}

/** User preferences collected during onboarding */
export interface UserPreferences {
  ageRange: string | null;
  gender: string | null;
  topics: string[];
}

/** Journaling ritual set during onboarding */
export interface UserRitual {
  timeOfDay: string;
  remindersEnabled: boolean;
}
