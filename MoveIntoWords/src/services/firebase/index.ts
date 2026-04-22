/**
 * Firebase services barrel export.
 * Import all Firebase services from this single entry point.
 */
export { firebaseApp, auth, db } from './config';
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut,
  sendVerificationEmailToUser,
  checkEmailVerified,
  getCurrentUser,
  listenToAuthState,
  getAuthErrorMessage,
} from './auth';
export {
  createUserProfile,
  updateOnboardingComplete,
  getUserProfile,
  saveJournalEntry,
  getJournalEntries,
  saveModuleProgress,
  getModuleProgress,
} from './firestore';
