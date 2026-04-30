# Move Into Words (MIW) - Project Context

## 📌 Project Overview
**Move Into Words** is a cross-platform (iOS, Android, Web) application built with React Native (Expo). The application focuses on mental health, wellness, and self-reflection. It provides users with guided cognitive behavioral modules (e.g., working through anxiety) and free-form journaling features, tracking their journey and "streaks" over time.

## 🛠 Tech Stack
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** React Navigation v7 (Native Stack & Bottom Tabs)
- **Backend / Database:** Firebase (Authentication, Firestore)
- **Local Storage:** `@react-native-async-storage/async-storage`
- **Styling:** Custom theme configuration (located in `src/constants/Theme.ts`)

---

## 🏗 Directory Structure (`/src`)

The project follows a standard React Native modular structure:

- **`/components`**: Reusable UI elements (`Button.tsx`, `TextInput.tsx`, `BottomTabBar.tsx`, `JournalCard.tsx`).
- **`/constants`**: App-wide constants including visual themes (`Theme.ts`) and static module content (`modules.ts`).
- **`/navigation`**: React Navigation setups. Contains the `AuthStack` (for logged-out users) and `MainTabs` (for logged-in users, wrapping `ModulesStack`, `JournalStack`, `JourneyStack`, and `MoreStack`).
- **`/screens`**: The core views of the application (30+ screens). Grouped by flow (e.g., Onboarding, Modules, Journaling, Settings).
- **`/services/firebase`**: Abstractions for Firebase operations. Separates `auth.ts`, `auth.web.ts` (for cross-platform auth differences), and `firestore.ts` (for database queries).
- **`/store`**: Global Zustand state managers (`useUserStore.ts` and `useJournalStore.ts`).
- **`/types`**: Global TypeScript interfaces and type definitions (`index.ts`, `journal.ts`).

---

## ✨ Core Features & Flows

### 1. Authentication & Onboarding (`AuthStack`)
- Handles user sign-up/sign-in using Firebase Authentication (Email/Password, Apple, Google).
- Includes a personalized onboarding flow (`PersonalizeScreen`, `RitualScreen`, `FirstPromptScreen`) to set up the user's initial state and preferences.
- Requires accepting disclaimers and legal agreements before entry.

### 2. Dashboard / Home (`DashboardScreen`)
- The main landing page post-login.
- Displays a personalized greeting, a calendar showing current streaks, and quick access to continue modules or view the last journal entry.

### 3. Guided Modules (`ModulesStack`)
- Step-by-step mental wellness exercises.
- Flow consists of: `ModuleDetailScreen` -> `ModuleWriteScreen` -> `ModuleDeepenScreen` -> `ModuleSaveScreen`.
- State for these modules is heavily managed by `useJournalStore.ts` to keep track of steps.

### 4. Journey & Free Journaling (`JournalStack` & `JourneyStack`)
- Allows users to write free-form reflections.
- Flow: `JournalWriteScreen` -> `JournalDeepenScreen` -> `JournalReflectScreen` -> `JournalSaveScreen`.
- `JourneyScreen` and `EntryArchiveScreen` act as the history/log for users to view past entries and track their progress over a calendar.

### 5. Profile & Settings (`MoreStack`)
- Account management (`MoreScreen`, `EditProfileScreen`).
- App customization: `ThemeSettingsScreen` (Light/Dark mode logic), `FontSizeSettingsScreen`, `ReminderSettingsScreen`.
- Important resources: `CrisisResourcesScreen`, `HelpScreen`, `MemberPerksScreen`.

---

## 🧠 State Management (Zustand)
- **`useUserStore`**: Manages the current authenticated user's profile data, display name, preferences (theme, font size), and onboarding completion status.
- **`useJournalStore`**: Tracks the transient state of journal entries and module progress during the writing flow before they are permanently saved to Firestore.

## 📡 Backend Integration (Firebase)
- **Auth:** Standard Firebase Auth. Uses `.web.ts` specific files to handle browser-specific auth logic (like persistence) versus native.
- **Firestore:** Stores user profiles, completed modules, and journal entries. Operations are abstracted inside `/services/firebase/firestore.ts`.

---

## 📝 Developer Notes & Quirks
- **Web Build Compatibility:** The project relies on `react-native-web` and `expo start --web`. Ensure that any new native libraries added (e.g., Apple Auth, Google Sign-in) are lazily loaded or properly mocked for the web target to prevent crashes.
- **Custom Tab Bar:** The application utilizes a custom bottom action button (`BottomAction.tsx` and `BottomTabBar.tsx`) which is responsible for the floating "Write" button seen across the main tabs.
