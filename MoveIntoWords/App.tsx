import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStack } from './src/navigation/AuthStack';
import { listenToAuthState, getUserProfile } from './src/services/firebase';
import { getJournalEntries, getModuleProgress } from './src/services/firebase/firestore';
import { useUserStore } from './src/store/useUserStore';
import { useJournalStore } from './src/store/useJournalStore';
import { Colors } from './src/constants/Theme';
import type { AuthStackParamList } from './src/types';

const HAS_OPENED_KEY = 'hasOpenedBefore';


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof AuthStackParamList>('Splash');
  const navigationRef = useRef<NavigationContainerRef<AuthStackParamList>>(null);

  useEffect(() => {
    // Configure Google Sign-In — only works in native dev builds, not Expo Go
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleSignin } = require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');
      GoogleSignin.configure({
        webClientId: '16528285265-m38o8h0nqa1vl1m81cfcsl58q9bpvc14.apps.googleusercontent.com',
      });
    } catch {
      // Native module not available (Expo Go) — Google Sign-In will not work
    }
  }, []);

  useEffect(() => {
    const unsubscribe = listenToAuthState(async (user) => {
      try {
        if (!user) {
          // ── No signed-in user — clear stores ─────────────────
          useUserStore.getState().clearUser();
          useJournalStore.getState().clearAll();
          const hasOpened = await AsyncStorage.getItem(HAS_OPENED_KEY);
          if (!hasOpened) {
            await AsyncStorage.setItem(HAS_OPENED_KEY, 'true');
            if (isLoading) {
              setInitialRoute('Splash');
            } else {
              navigationRef.current?.reset({ index: 0, routes: [{ name: 'Splash' }] });
            }
          } else {
            if (isLoading) {
              setInitialRoute('SignIn');
            } else {
              navigationRef.current?.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            }
          }
        } else {
          // ── Signed-in user — check profile ──────────────────
          const { setUser, setOnboardingComplete } = useUserStore.getState();
          const profile = await getUserProfile(user.uid);
          setUser({
            uid: user.uid,
            displayName: profile?.displayName ?? user.displayName ?? '',
            email: profile?.email ?? user.email ?? '',
          });
          if (profile && profile.onboardingComplete) {
            setOnboardingComplete(true);
            if (isLoading) {
              setInitialRoute('Main');
            } else {
              navigationRef.current?.reset({ index: 0, routes: [{ name: 'Main' }] });
            }
          } else {
            // Profile not found or onboarding not done — resume onboarding
            if (isLoading) {
              setInitialRoute('Disclaimer');
            } else {
              navigationRef.current?.reset({ index: 0, routes: [{ name: 'Disclaimer' }] });
            }
          }

          // Pre-load journal data into store — fail silently so auth never blocks
          try {
            const [entries, progress] = await Promise.all([
              getJournalEntries(user.uid),
              getModuleProgress(user.uid),
            ]);
            useJournalStore.getState().setEntries(entries);
            useJournalStore.getState().setModuleProgress(progress);
          } catch {
            // Data will load lazily in DashboardScreen as fallback
          }
        }
      } catch {
        // On any error, fall back to sign-in
        if (isLoading) {
          setInitialRoute('SignIn');
        } else {
          navigationRef.current?.reset({ index: 0, routes: [{ name: 'SignIn' }] });
        }
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primaryDark} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <AuthStack initialRouteName={initialRoute} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
