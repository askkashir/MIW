/**
 * Firebase Configuration — Move Into Words
 *
 * Initializes the Firebase app, Auth, and Firestore instances.
 * All other Firebase modules import from here.
 *
 * Firebase 12 note: getReactNativePersistence has been removed.
 * Auth state is persisted automatically by the Firebase SDK via IndexedDB
 * in React Native environments with the new architecture.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyARfkx8JY__8qhdJk_U9ERJRhdOE7BajeA',
  authDomain: 'moveintowords-a81c0.firebaseapp.com',
  projectId: 'moveintowords-a81c0',
  storageBucket: 'moveintowords-a81c0.firebasestorage.app',
  messagingSenderId: '16528285265',
  appId: '1:16528285265:web:ae49868571fa841069e270',
  measurementId: 'G-0Z2SDJ869Y',
};

/** Firebase app — singleton (prevents double-init during hot reload) */
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/** Firebase Auth instance */
export const auth = getAuth(firebaseApp);

/** Firestore database instance */
export const db = getFirestore(firebaseApp);
