/**
 * AuthStack — Root stack navigator.
 *
 * Covers the full linear auth + setup flow before the user enters the main app:
 * Splash → Onboarding → SignUp → SignIn → SignUpEmail → Verification
 * → Disclaimer → Personalize → Ritual → Main (MainTabs)
 *
 * Once the user reaches 'Main', the auth screens are removed from the stack
 * so the hardware back button can't navigate back to them.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpEmailScreen from '../screens/SignUpEmailScreen';
import VerificationScreen from '../screens/VerificationScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import PersonalizeScreen from '../screens/PersonalizeScreen';
import RitualScreen from '../screens/RitualScreen';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash"      component={SplashScreen} />
    <Stack.Screen name="Onboarding"  component={OnboardingScreen} />
    <Stack.Screen name="SignUp"      component={SignUpScreen} />
    <Stack.Screen name="SignIn"      component={SignInScreen} />
    <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
    <Stack.Screen name="Disclaimer"  component={DisclaimerScreen} />
    <Stack.Screen name="Personalize" component={PersonalizeScreen} />
    <Stack.Screen name="Ritual"      component={RitualScreen} />
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ gestureEnabled: false }} // prevent swiping back to auth
    />
  </Stack.Navigator>
);
