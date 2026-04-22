import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import AuthProgress from '../components/AuthProgress';
import BottomAction from '../components/BottomAction';
import { checkEmailVerified, sendVerificationEmailToUser } from '../services/firebase/auth';
import { getCurrentUser } from '../services/firebase/auth';

const OTP_BOXES = [0, 1, 2, 3, 4, 5];
const POLL_INTERVAL_MS = 3000;
const COOLDOWN_SECONDS = 60;

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const boxSize = (width - Spacing.xl * 2 - Spacing.xs * 5) / 6;
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

  const userEmail = getCurrentUser()?.email ?? 'your email';

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress currentStep={2} totalSteps={3} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a verification link to{' '}
            <Text style={styles.underline}>{userEmail}</Text>.{'\n'}
            Click the link in your email to continue.
          </Text>
        </View>
        <View style={styles.codeContainer}>
          {OTP_BOXES.map((_, idx) => (
            <RNTextInput
              key={idx}
              style={[styles.codeBox, { width: boxSize, height: boxSize * 1.15 }]}
              maxLength={1}
              keyboardType="number-pad"
              editable={false}
            />
          ))}
        </View>

        {resendMessage ? (
          <Text style={styles.resendFeedback}>{resendMessage}</Text>
        ) : cooldown > 0 ? (
          <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
        ) : (
          <Pressable onPress={handleResend}>
            <Text style={styles.resendText}>Resend verification email</Text>
          </Pressable>
        )}
      </View>
      <BottomAction onBack={() => navigation.goBack()} onNext={handleResend} />
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
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  codeBox: { borderRadius: Radii.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, textAlign: 'center', fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  resendText: { ...Typography.body, color: Colors.primaryDark, textAlign: 'center', textDecorationLine: 'underline' },
  resendFeedback: { ...Typography.body, color: Colors.success, textAlign: 'center' },
  cooldownText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
