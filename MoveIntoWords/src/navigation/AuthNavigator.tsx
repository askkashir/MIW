import React, { useState } from 'react';
import { AuthRoute } from '../types';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpEmailScreen from '../screens/SignUpEmailScreen';
import VerificationScreen from '../screens/VerificationScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import PersonalizeScreen from '../screens/PersonalizeScreen';
import RitualScreen from '../screens/RitualScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JournalWriteScreen from '../screens/JournalWriteScreen';
import JournalDeepenScreen from '../screens/JournalDeepenScreen';
import JournalReflectScreen from '../screens/JournalReflectScreen';
import JournalSaveScreen from '../screens/JournalSaveScreen';

export const AuthNavigator: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AuthRoute>('Splash');
  const go = (route: AuthRoute) => setCurrentRoute(route);

  switch (currentRoute) {
    case 'Splash':
      return <SplashScreen onFinish={() => go('Onboarding')} />;

    case 'Onboarding':
      return <OnboardingScreen onFinish={() => go('SignUp')} />;

    case 'JournalWrite':
      return <JournalWriteScreen onNext={() => go('JournalDeepen')} onSkip={() => go('SignUp')} />;

    case 'JournalDeepen':
      return <JournalDeepenScreen onNext={() => go('JournalReflect')} onBack={() => go('JournalWrite')} />;
      
    case 'JournalReflect':
      return <JournalReflectScreen onNext={() => go('JournalSave')} />;
      
    case 'JournalSave':
      return <JournalSaveScreen onNext={() => go('Splash')} onBack={() => go('JournalReflect')} />;

    case 'SignUp':
      return (
        <SignUpScreen
          onSignIn={() => go('SignIn')}
          onEmail={() => go('SignUpEmail')}
        />
      );

    case 'SignIn':
      return <SignInScreen onCreateAccount={() => go('SignUp')} />;

    case 'SignUpEmail':
      return (
        <SignUpEmailScreen
          onBack={() => go('SignUp')}
          onNext={() => go('Verification')}
        />
      );

    case 'Verification':
      return (
        <VerificationScreen
          onBack={() => go('SignUpEmail')}
          onNext={() => go('Disclaimer')}
        />
      );

    case 'Disclaimer':
      return (
        <DisclaimerScreen
          onBack={() => go('Verification')}
          onNext={() => go('PersonalizeSpace')}
        />
      );

    case 'PersonalizeSpace':
      return (
        <PersonalizeScreen
          onBack={() => go('Disclaimer')}
          onNext={() => go('BuildRitual')}
        />
      );

    case 'BuildRitual':
      return (
        <RitualScreen
          onBack={() => go('PersonalizeSpace')}
          onNext={() => go('Dashboard')}
        />
      );

    case 'Dashboard':
      return (
        <DashboardScreen
          onWrite={() => go('JournalWrite')}
        />
      );
  }
};
