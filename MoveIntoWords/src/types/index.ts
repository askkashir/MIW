/**
 * Navigation param lists for all navigators in the app.
 *
 * Each interface maps a screen name to its route params.
 * `undefined` means the screen takes no params.
 */

// ── Auth flow (linear stack before the user reaches the main app) ─────────────
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignUp: undefined;
  SignIn: undefined;
  SignUpEmail: undefined;
  Verification: undefined;
  ForgotPassword: undefined;
  Disclaimer: undefined;
  LegalAgreement: undefined;
  Personalize: undefined;
  Ritual: undefined;
  FirstPrompt: undefined;
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
  ModuleDetail: { moduleId: string };
  ModuleWrite: { moduleId: string };
  ModuleDeepen: { moduleId: string; step1Response: string };
  ModuleSave: { moduleId: string; step1Response: string; step2Response: string };
};

// ── Journal nested stack (modal) ──────────────────────────────────────────────
export type JournalStackParamList = {
  JournalWrite: undefined;
  JournalDeepen: { content?: string };
  JournalReflect: { content?: string; deepenContent?: string };
  JournalSave: { content?: string; deepenContent?: string; reflectContent?: string };
};

// ── Journey nested stack ──────────────────────────────────────────────────────
export type JourneyStackParamList = {
  JourneyHome: undefined;
  EntryArchive: undefined;
  EntryDetail: { entryId: string };
};

// ── More nested stack ─────────────────────────────────────────────────────────
export type MoreStackParamList = {
  MoreHome: undefined;
  MemberPerks: undefined;
  CrisisResources: undefined;
  EditProfile: undefined;
  ReminderSettings: undefined;
  ThemeSettings: undefined;
  FontSizeSettings: undefined;
  Help: undefined;
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
  /** 0 = not started, 1 = on step 1, 2 = on step 2, 3 = complete */
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  /** Responses keyed by step number as string: "1", "2", "3" */
  responses: {
    [step: string]: string;
  };
  /** Unix ms timestamp when the module was first started */
  startedAt: number;
  /** Unix ms timestamp when the module was completed — only set when isComplete = true */
  completedAt?: number;
  /** Unix ms timestamp of last update */
  lastUpdatedAt: number;
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

/** Full user profile stored in Firestore at /users/{uid} */
export interface UserProfile {
  displayName: string;
  email: string;
  demographics: {
    ageRange: string | null;
    gender: string | null;
  };
  preferences: string[];
  ritual: UserRitual;
  onboardingComplete: boolean;
  createdAt: unknown; // Firestore Timestamp (server-generated)
}
