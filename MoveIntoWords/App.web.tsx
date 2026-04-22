/**
 * App.web.tsx — Web entry point.
 *
 * Metro automatically selects this file over App.tsx when bundling for web.
 * GoogleSignin is native-only and cannot be imported on web, so this file
 * omits the import and configure call entirely.
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStack } from './src/navigation/AuthStack';
import { listenToAuthState, getUserProfile } from './src/services/firebase';
import { useUserStore } from './src/store/useUserStore';
import { Colors } from './src/constants/Theme';
import type { AuthStackParamList } from './src/types';

const HAS_OPENED_KEY = 'hasOpenedBefore';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] =
    useState<keyof AuthStackParamList>('Splash');

  useEffect(() => {
    const unsubscribe = listenToAuthState(async (user) => {
      try {
        if (!user) {
          const hasOpened = await AsyncStorage.getItem(HAS_OPENED_KEY);
          if (!hasOpened) {
            await AsyncStorage.setItem(HAS_OPENED_KEY, 'true');
            setInitialRoute('Splash');
          } else {
            setInitialRoute('SignIn');
          }
        } else {
          const { setUser, setOnboardingComplete } = useUserStore.getState();
          setUser({
            uid: user.uid,
            displayName: user.displayName ?? '',
            email: user.email ?? '',
          });

          const profile = await getUserProfile(user.uid);
          if (profile && profile.onboardingComplete) {
            setOnboardingComplete(true);
            setInitialRoute('Main');
          } else {
            setInitialRoute('Disclaimer');
          }
        }
      } catch {
        setInitialRoute('SignIn');
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primaryDark} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
