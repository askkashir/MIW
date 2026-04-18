/**
 * Firestore Database — STUBS
 *
 * Each function below is a placeholder for the corresponding Firestore call.
 * The app's stores and screens already call these functions — when you
 * integrate Firebase, replace the stub bodies with real Firestore operations.
 *
 * Suggested Firestore schema:
 *   /users/{uid}                    → UserProfile document
 *   /users/{uid}/entries/{entryId}  → JournalEntry documents
 *   /users/{uid}/progress/{moduleId} → ModuleProgress documents
 *
 * TODO (Firebase): Install firebase — `npx expo install firebase`
 * Then import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
 */

import { JournalEntry, ModuleProgress } from '../../types';

// ── User Profile ──────────────────────────────────────────────────────────────

/**
 * Save the user's profile to Firestore.
 * TODO: implement with Firestore — setDoc(doc(db, 'users', uid), profile)
 */
export async function saveUserProfile(
  _uid: string,
  _profile: { displayName: string; email: string },
): Promise<void> {
  // TODO: implement with Firestore
  console.log('[Firestore] saveUserProfile called — stub');
}

/**
 * Fetch the user's profile from Firestore.
 * TODO: implement with Firestore — getDoc(doc(db, 'users', uid))
 */
export async function getUserProfile(
  _uid: string,
): Promise<null> {
  // TODO: implement with Firestore
  console.log('[Firestore] getUserProfile called — stub');
  return null;
}

// ── Journal Entries ───────────────────────────────────────────────────────────

/**
 * Save a new journal entry to Firestore.
 * TODO: implement with Firestore — setDoc(doc(db, 'users', uid, 'entries', entry.id), entry)
 */
export async function saveJournalEntry(
  _uid: string,
  _entry: JournalEntry,
): Promise<void> {
  // TODO: implement with Firestore
  console.log('[Firestore] saveJournalEntry called — stub');
}

/**
 * Fetch all journal entries for the user from Firestore.
 * TODO: implement with Firestore — getDocs(collection(db, 'users', uid, 'entries'))
 */
export async function getJournalEntries(
  _uid: string,
): Promise<JournalEntry[]> {
  // TODO: implement with Firestore
  console.log('[Firestore] getJournalEntries called — stub');
  return [];
}

// ── Module Progress ───────────────────────────────────────────────────────────

/**
 * Save module progress for the user to Firestore.
 * TODO: implement with Firestore — setDoc(doc(db, 'users', uid, 'progress', progress.moduleId), progress)
 */
export async function saveModuleProgress(
  _uid: string,
  _progress: ModuleProgress,
): Promise<void> {
  // TODO: implement with Firestore
  console.log('[Firestore] saveModuleProgress called — stub');
}

/**
 * Fetch all module progress records for the user from Firestore.
 * TODO: implement with Firestore — getDocs(collection(db, 'users', uid, 'progress'))
 */
export async function getModuleProgress(
  _uid: string,
): Promise<ModuleProgress[]> {
  // TODO: implement with Firestore
  console.log('[Firestore] getModuleProgress called — stub');
  return [];
}
