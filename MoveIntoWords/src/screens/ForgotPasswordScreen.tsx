import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getAuthErrorMessage } from '../services/firebase/auth';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim()) { setError('Please enter your email address'); return; }
    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {sent && <Text style={styles.successText}>Check your email for a reset link.</Text>}

        <View style={styles.form}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Button
          label={isLoading ? 'Sending...' : 'Send Reset Link'}
          onPress={handleSubmit}
          disabled={sent || isLoading}
          style={styles.submitBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  backBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs, marginBottom: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  errorText: { ...Typography.caption, color: Colors.error, textAlign: 'center', marginBottom: Spacing.md },
  successText: { ...Typography.caption, color: Colors.success, textAlign: 'center', marginBottom: Spacing.md },
  form: { marginBottom: Spacing.lg },
  submitBtn: { backgroundColor: Colors.primaryDark, borderRadius: Radii.full },
});
