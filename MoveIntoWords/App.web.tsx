/**
 * App.web.tsx — Web entry point.
 *
 * Metro automatically selects this file over App.tsx when bundling for web.
 * GoogleSignin is native-only and cannot be imported on web, so this file
 * omits the import and configure call entirely.
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStack } from './src/navigation/AuthStack';
import { listenToAuthState, getUserProfile } from './src/services/firebase';
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
    const unsubscribe = listenToAuthState(async (user) => {
      try {
        if (!user) {
          // Clear local stores on sign out
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
            if (isLoading) {
              setInitialRoute('Disclaimer');
            } else {
              navigationRef.current?.reset({ index: 0, routes: [{ name: 'Disclaimer' }] });
            }
          }
        }
      } catch {
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
