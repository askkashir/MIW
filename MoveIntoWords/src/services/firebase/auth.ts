/**
 * Firebase Authentication — STUBS
 *
 * Each function below is a placeholder for the corresponding Firebase Auth call.
 * The app's UI already calls these functions — when you integrate Firebase,
 * simply replace the stub body with the real implementation.
 *
 * TODO (Firebase): Install firebase — `npx expo install firebase`
 * Then import { getAuth, signInWithEmailAndPassword, ... } from 'firebase/auth';
 */

// ── Sign Up ───────────────────────────────────────────────────────────────────

/**
 * Create a new user account with email and password.
 * TODO: implement with Firebase Auth — createUserWithEmailAndPassword()
 */
export async function signUpWithEmail(
  _email: string,
  _password: string,
): Promise<void> {
  // TODO: implement with Firebase Auth
  console.log('[Firebase] signUpWithEmail called — stub');
}

// ── Sign In ───────────────────────────────────────────────────────────────────

/**
 * Sign in an existing user with email and password.
 * TODO: implement with Firebase Auth — signInWithEmailAndPassword()
 */
export async function signInWithEmail(
  _email: string,
  _password: string,
): Promise<void> {
  // TODO: implement with Firebase Auth
  console.log('[Firebase] signInWithEmail called — stub');
}

/**
 * Sign in with a Google account (OAuth).
 * TODO: implement with Firebase Auth + expo-auth-session or @react-native-google-signin/google-signin
 */
export async function signInWithGoogle(): Promise<void> {
  // TODO: implement with Firebase Auth + Google Sign-In SDK
  console.log('[Firebase] signInWithGoogle called — stub');
}

/**
 * Sign in with an Apple account (OAuth — iOS only).
 * TODO: implement with Firebase Auth + expo-apple-authentication
 */
export async function signInWithApple(): Promise<void> {
  // TODO: implement with Firebase Auth + Apple Authentication
  console.log('[Firebase] signInWithApple called — stub');
}

// ── Verification ──────────────────────────────────────────────────────────────

/**
 * Send an email verification link to the currently signed-in user.
 * TODO: implement with Firebase Auth — sendEmailVerification(currentUser)
 */
export async function sendVerificationEmail(): Promise<void> {
  // TODO: implement with Firebase Auth
  console.log('[Firebase] sendVerificationEmail called — stub');
}

// ── Session ───────────────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user, or null if not signed in.
 * TODO: implement with Firebase Auth — getAuth().currentUser
 */
export function getCurrentUser(): null {
  // TODO: implement with Firebase Auth
  console.log('[Firebase] getCurrentUser called — stub');
  return null;
}

/**
 * Sign out the current user and clear local state.
 * TODO: implement with Firebase Auth — signOut(auth)
 * Also call useUserStore.getState().clearUser() and useJournalStore.getState().clearAll()
 */
export async function signOut(): Promise<void> {
  // TODO: implement with Firebase Auth
  console.log('[Firebase] signOut called — stub');
}
