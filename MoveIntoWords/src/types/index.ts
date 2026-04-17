// Central param-list for the auth flow.
// When React Navigation is introduced, replace `Route` with a typed
// NativeStackNavigationProp derived from this union.
export type AuthRoute =
  | 'Splash'
  | 'Onboarding'
  | 'SignUp'
  | 'SignIn'
  | 'SignUpEmail'
  | 'Verification'
  | 'Disclaimer'
  | 'PersonalizeSpace'
  | 'BuildRitual'
  | 'Dashboard'
  | 'JournalWrite'
  | 'JournalDeepen'
  | 'JournalReflect'
  | 'JournalSave';

// ── Journal entry (used on HomeScreen and future write screens) ──────────────
export interface JournalEntry {
  id: string;
  /** Main body text shown in the card preview */
  content: string;
  /** Unix timestamp (ms) of creation */
  createdAt: number;
}
