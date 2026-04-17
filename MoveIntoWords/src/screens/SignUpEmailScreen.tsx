import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, FontFamily } from '../constants/Theme';
import TextInput from '../components/TextInput';
import AuthProgress from '../components/AuthProgress';
import BottomAction from '../components/BottomAction';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
}

const PASSWORD_RULES = [
  'Minimum 8 Characters',
  'One capital letter (A-Z)',
  'One small letter (a-z)',
  'One symbol (like ! @ # ?)',
];

const SignUpEmailScreen: React.FC<Props> = ({ onBack, onNext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
          {PASSWORD_RULES.map((rule) => (
            <View key={rule} style={styles.checkRow}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.checkText}>{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomAction onBack={() => onBack?.()} onNext={() => onNext?.()} />
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
