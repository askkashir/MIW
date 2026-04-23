import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import AuthProgress from '../components/AuthProgress';
import { checkEmailVerified, sendVerificationEmailToUser } from '../services/firebase/auth';
import { getCurrentUser } from '../services/firebase/auth';
import { signOut } from '../services/firebase/auth';
import { useUserStore } from '../store/useUserStore';

const POLL_INTERVAL_MS = 3000;
const COOLDOWN_SECONDS = 60;

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ navigation }) => {
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Poll every 3 seconds for email verification
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const verified = await checkEmailVerified();
      if (verified) {
        if (pollRef.current) clearInterval(pollRef.current);
        navigation.navigate('Disclaimer');
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [navigation]);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await sendVerificationEmailToUser();
      setResendMessage('Verification email sent!');
    } catch {
      setResendMessage('Could not resend — try again shortly.');
    }
    startCooldown();
    setTimeout(() => setResendMessage(null), 3000);
  };

  const storeEmail = useUserStore((s) => s.email);
  const userEmail = storeEmail ?? getCurrentUser()?.email ?? 'your email';

  const handleUseDifferentEmail = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    navigation.navigate('SignUpEmail');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress currentStep={2} totalSteps={3} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a verification link to <Text style={styles.underline}>{userEmail}</Text>. Tap the link in your email to verify your account, then come back here.
          </Text>
          <Text style={styles.secondaryNote}>Don't see it? Check your spam or junk folder.</Text>
        </View>

        <View style={styles.waiting}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.waitingText}>Waiting for verification…</Text>
        </View>

        <Pressable
          style={styles.refreshBtn}
          onPress={async () => {
            const verified = await checkEmailVerified();
            if (verified) navigation.navigate('Disclaimer');
            else setResendMessage('Still not verified. Please check your email.');
          }}
        >
          <Text style={styles.refreshText}>I've verified my email</Text>
        </Pressable>

        {resendMessage ? (
          <Text style={styles.resendFeedback}>{resendMessage}</Text>
        ) : cooldown > 0 ? (
          <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
        ) : (
          <Pressable onPress={handleResend} accessibilityRole="button">
            <Text style={styles.resendText}>Resend verification email</Text>
          </Pressable>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={handleUseDifferentEmail}
            accessibilityRole="button"
          >
            <Text style={styles.footerLink}>Use a different email</Text>
          </Pressable>

          {/* Dev-only bypass to handle potential Firebase 400 errors during web testing */}
          <Pressable
            onPress={() => navigation.navigate('Disclaimer')}
            accessibilityRole="button"
          >
            <Text style={styles.footerLink}>Skip Verification (Debug)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl + Spacing.md },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textPrimary, textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
  secondaryNote: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  waiting: { alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xl },
  waitingText: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  refreshBtn: { backgroundColor: Colors.primaryDark, paddingVertical: Spacing.md, borderRadius: Radii.md, marginBottom: Spacing.xl },
  refreshText: { ...Typography.body, color: Colors.white, fontWeight: '700', textAlign: 'center' },
  resendText: { ...Typography.body, color: Colors.primaryDark, textAlign: 'center', textDecorationLine: 'underline' },
  resendFeedback: { ...Typography.body, color: Colors.success, textAlign: 'center' },
  cooldownText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  footer: { marginTop: 'auto', gap: Spacing.md, paddingVertical: Spacing.lg },
  footerLink: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', textDecorationLine: 'underline' },
});
