import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import TextInput from '../components/TextInput';
import SocialButton from '../components/SocialButton';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  getAuthErrorMessage,
} from '../services/firebase/auth';
import { getUserProfile } from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const routeAfterSignIn = async (uid: string, displayName: string, userEmail: string) => {
    const { setUser, setOnboardingComplete } = useUserStore.getState();
    const profile = await getUserProfile(uid);
    setUser({
      uid,
      displayName: profile?.displayName ?? displayName,
      email: profile?.email ?? userEmail,
    });
    if (profile?.onboardingComplete) {
      setOnboardingComplete(true);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } else {
      navigation.navigate('Disclaimer');
    }
  };

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }
    setIsLoading(true);
    try {
      const user = await signInWithEmail(email.trim(), password);
      await routeAfterSignIn(user.uid, user.displayName ?? '', user.email ?? '');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      await routeAfterSignIn(user.uid, user.displayName ?? '', user.email ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApple = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await signInWithApple();
      await routeAfterSignIn(user.uid, user.displayName ?? '', user.email ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Your writing stays personal.</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>👁</Text>
            </Pressable>
          </View>

          <Pressable style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>

        <SocialButton
          type="email"
          title={isLoading ? 'Signing in...' : 'Continue With Email'}
          icon="✉"
          onPress={handleSignIn}
          style={styles.actionBtn}
        />

        <Text style={styles.orText}>OR</Text>

        <SocialButton
          type="apple"
          title="Continue With Apple"
          icon=""
          onPress={handleApple}
          style={styles.socialBtn}
        />
        <SocialButton
          type="google"
          title="Continue With Google"
          icon="G"
          onPress={handleGoogle}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl + Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  errorText: { ...Typography.caption, color: Colors.error, textAlign: 'center', marginBottom: Spacing.md },
  form: { marginBottom: Spacing.lg },
  eyeBtn: { position: 'absolute', right: Spacing.md, top: Spacing.md, padding: Spacing.xs },
  eyeIcon: { ...Typography.body, color: Colors.textSecondary },
  forgotBtn: { alignSelf: 'flex-end', marginTop: Spacing.xs },
  forgotText: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600', textDecorationLine: 'underline' },
  actionBtn: { marginBottom: Spacing.lg },
  orText: { ...Typography.caption, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.lg },
  socialBtn: { marginBottom: Spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', marginBottom: Spacing.xl },
  footerText: { ...Typography.body, color: Colors.textPrimary },
  footerLink: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600', textDecorationLine: 'underline' },
});
