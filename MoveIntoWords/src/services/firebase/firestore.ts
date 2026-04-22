/**
 * Firestore Database — Move Into Words
 *
 * Real implementations for all Firestore operations.
 *
 * Schema:
 *   /users/{uid}                           → UserProfile document
 *   /journalEntries/{uid}/entries/{id}     → JournalEntry documents
 *   /moduleProgress/{uid}/modules/{moduleId} → ModuleProgress documents
 */

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { JournalEntry, ModuleProgress, UserProfile } from '../../types';

// ── User Profile ──────────────────────────────────────────────────────────────

/**
 * Create a new user profile document in Firestore.
 * Called once at the end of onboarding (RitualScreen).
 */
export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, 'createdAt'>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Set onboardingComplete to true for the given user.
 * Called after the FirstPrompt screen.
 */
export async function updateOnboardingComplete(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    onboardingComplete: true,
  });
}

/**
 * Fetch the user's profile from Firestore.
 * Returns null if the document does not exist.
 */
export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

// ── Journal Entries ───────────────────────────────────────────────────────────

/**
 * Save a new journal entry to Firestore.
 * Stored under journalEntries/{uid}/entries/{entryId}.
 */
export async function saveJournalEntry(
  uid: string,
  entry: JournalEntry,
): Promise<void> {
  await setDoc(doc(db, 'journalEntries', uid, 'entries', entry.id), entry);
}

/**
 * Fetch all journal entries for the user, ordered by createdAt descending.
 */
export async function getJournalEntries(
  uid: string,
): Promise<JournalEntry[]> {
  const q = query(
    collection(db, 'journalEntries', uid, 'entries'),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as JournalEntry);
}

// ── Module Progress ───────────────────────────────────────────────────────────

/**
 * Save / upsert module progress for the user.
 * Uses setDoc with merge to allow partial updates.
 */
export async function saveModuleProgress(
  uid: string,
  progress: ModuleProgress,
): Promise<void> {
  await setDoc(
    doc(db, 'moduleProgress', uid, 'modules', progress.moduleId),
    progress,
    { merge: true },
  );
}

/**
 * Fetch all module progress records for the user.
 */
export async function getModuleProgress(
  uid: string,
): Promise<ModuleProgress[]> {
  const snap = await getDocs(
    collection(db, 'moduleProgress', uid, 'modules'),
  );
  return snap.docs.map((d) => d.data() as ModuleProgress);
}
