/**
 * AuthStack — Root stack navigator.
 *
 * Covers the full linear auth + setup flow before the user enters the main app:
 * Splash → Onboarding → SignUp → SignIn → SignUpEmail → Verification
 * → Disclaimer → LegalAgreement → Personalize → Ritual → FirstPrompt → Main (MainTabs)
 *
 * Accepts an initialRouteName prop so App.tsx can conditionally start
 * at different screens based on auth state.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpEmailScreen from '../screens/SignUpEmailScreen';
import VerificationScreen from '../screens/VerificationScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import LegalAgreementScreen from '../screens/LegalAgreementScreen';
import PersonalizeScreen from '../screens/PersonalizeScreen';
import RitualScreen from '../screens/RitualScreen';
import FirstPromptScreen from '../screens/FirstPromptScreen';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  initialRouteName?: keyof AuthStackParamList;
}

export const AuthStack: React.FC<AuthStackProps> = ({
  initialRouteName = 'Splash',
}) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash"         component={SplashScreen} />
    <Stack.Screen name="Onboarding"     component={OnboardingScreen} />
    <Stack.Screen name="SignUp"         component={SignUpScreen} />
    <Stack.Screen name="SignIn"         component={SignInScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="SignUpEmail"    component={SignUpEmailScreen} />
    <Stack.Screen name="Verification"  component={VerificationScreen} />
    <Stack.Screen name="Disclaimer"    component={DisclaimerScreen} />
    <Stack.Screen name="LegalAgreement" component={LegalAgreementScreen} />
    <Stack.Screen name="Personalize"   component={PersonalizeScreen} />
    <Stack.Screen name="Ritual"        component={RitualScreen} />
    <Stack.Screen name="FirstPrompt"   component={FirstPromptScreen} />
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ gestureEnabled: false }} // prevent swiping back to auth
    />
  </Stack.Navigator>
);
