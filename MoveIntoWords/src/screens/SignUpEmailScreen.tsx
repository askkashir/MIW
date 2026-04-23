import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import TextInput from '../components/TextInput';
import AuthProgress from '../components/AuthProgress';
import BottomAction from '../components/BottomAction';
import { signUpWithEmail, getAuthErrorMessage } from '../services/firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const PASSWORD_RULES = [
  'Minimum 8 Characters',
  'One capital letter (A-Z)',
  'One small letter (a-z)',
  'One symbol (like ! @ # ?)',
];

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpEmail'>;

const SignUpEmailScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasSymbol &&
    password === confirmPassword;

  const handleNext = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!isPasswordValid) return;

    setIsLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
      navigation.navigate('Verification');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress currentStep={1} totalSteps={3} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up With Email</Text>
          <Text style={styles.subtitle}>
            Use an email you check often. We'll use it for account recovery and important safety
            updates.
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.checklist}>
          {PASSWORD_RULES.map((rule, i) => {
            const isMet =
              i === 0 ? hasMinLength :
              i === 1 ? hasUppercase :
              i === 2 ? hasLowercase :
              hasSymbol;
            const iconColor = isMet ? Colors.primary : Colors.textSecondary;
            return (
            <View key={rule} style={styles.checkRow}>
              <View style={styles.checkCircle}>
                <Ionicons
                  name={isMet ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={iconColor}
                />
              </View>
              <Text style={styles.checkText}>{rule}</Text>
            </View>
          );})}
        </View>
      </ScrollView>

      <BottomAction
        onBack={() => navigation.goBack()}
        onNext={handleNext}
        nextDisabled={!email.trim() || !isPasswordValid || isLoading}
      />
    </SafeAreaView>
  );
};

export default SignUpEmailScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: Spacing.xxs,
    marginTop: Spacing.md,
  },
  checklist: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: Spacing.md,
    height: Spacing.md,
    borderRadius: Spacing.xs,
    backgroundColor: Colors.textPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkIcon: {
    color: Colors.white,
    fontSize: Typography.caption.fontSize,
    fontWeight: 'bold',
  },
  checkText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
