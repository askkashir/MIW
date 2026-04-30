/**
 * Firebase Authentication — Move Into Words
 *
 * Real implementations for all auth operations.
 * Each function wraps Firebase Auth SDK calls with typed error handling.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { Platform } from 'react-native';

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

/**
 * Map a Firebase Auth error code to a user-friendly message.
 * Falls back to a generic message for unmapped codes.
 */
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

/**
 * Create a new user account with email and password.
 * Immediately sends a verification email after creation.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

// ── Sign In ───────────────────────────────────────────────────────────────────

/**
 * Sign in an existing user with email and password.
 * Returns the Firebase User on success.
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign in with a Google account (OAuth).
 * Uses @react-native-google-signin/google-signin for native flow.
 */
export async function signInWithGoogle(): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleSignin } = require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken;
  if (!idToken) {
    throw new Error('Google Sign-In failed: no ID token returned');
  }
  const googleCredential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, googleCredential);
  return result.user;
}

/**
 * Sign in with an Apple account (OAuth — iOS only).
 * Uses @invertase/react-native-apple-authentication for native flow.
 */
export async function signInWithApple(): Promise<User> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign-In is only available on iOS');
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { appleAuth } = require('@invertase/react-native-apple-authentication') as typeof import('@invertase/react-native-apple-authentication');
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });

  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed: no identity token returned');
  }

  const { identityToken, nonce } = appleAuthRequestResponse;
  const appleCredential = new OAuthProvider('apple.com').credential({
    idToken: identityToken,
    rawNonce: nonce,
  });
  const result = await signInWithCredential(auth, appleCredential);
  return result.user;
}

// ── Verification ──────────────────────────────────────────────────────────────

/**
 * Send / resend an email verification link to the currently signed-in user.
 */
export async function sendVerificationEmailToUser(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is signed in');
  await sendEmailVerification(user);
}

/**
 * Reload the current user and return whether their email is verified.
 */
export async function checkEmailVerified(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  await user.reload();
  return user.emailVerified;
}

// ── Session ───────────────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user, or null if not signed in.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Sign out the current user and clear all local Zustand stores.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  useUserStore.getState().clearUser();
  useJournalStore.getState().clearAll();
}

/**
 * Listen to authentication state changes.
 * Returns an unsubscribe function.
 */
export function listenToAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
