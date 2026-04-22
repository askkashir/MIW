/**
 * Firebase Authentication — Web build (auth.web.ts)
 *
 * Metro automatically uses this file instead of auth.ts when bundling for web.
 * Google and Apple sign-in are native-only; on web they throw a user-friendly
 * error that screens catch and display inline — no crash.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';
import { useUserStore } from '../../store/useUserStore';
import { useJournalStore } from '../../store/useJournalStore';

// ── Error Mapping ─────────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/wrong-password': 'Incorrect password, please try again',
  'auth/user-not-found': 'No account found with this email',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Check your connection',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/invalid-credential': 'Invalid email or password. Please try again',
};

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;
    return ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

// ── Sign Up ───────────────────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

// ── Sign In ───────────────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Google Sign-In is not available on web — throws a user-friendly error. */
export async function signInWithGoogle(): Promise<User> {
  throw new Error('Google Sign-In is not available on web. Please use email sign-in.');
}

/** Apple Sign-In is not available on web — throws a user-friendly error. */
export async function signInWithApple(): Promise<User> {
  throw new Error('Apple Sign-In is not available on web. Please use email sign-in.');
}

// ── Verification ──────────────────────────────────────────────────────────────

export async function sendVerificationEmailToUser(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is signed in');
  await sendEmailVerification(user);
}

export async function checkEmailVerified(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  await user.reload();
  return user.emailVerified;
}

// ── Session ───────────────────────────────────────────────────────────────────

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  useUserStore.getState().clearUser();
  useJournalStore.getState().clearAll();
}

export function listenToAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
