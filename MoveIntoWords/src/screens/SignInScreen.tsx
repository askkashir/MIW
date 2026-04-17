import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Colors, Typography, Spacing, FontFamily } from '../constants/Theme';
import TextInput from '../components/TextInput';
import SocialButton from '../components/SocialButton';

interface Props {
  onCreateAccount?: () => void;
}

const SignInScreen: React.FC<Props> = ({ onCreateAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Your writing stays personal.</Text>
        </View>

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

          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>

        <SocialButton
          type="email"
          title="Continue With Email"
          icon="✉"
          onPress={() => {}}
          style={styles.actionBtn}
        />

        <Text style={styles.orText}>OR</Text>

        <SocialButton
          type="apple"
          title="Continue With Apple"
          icon=""
          onPress={() => {}}
          style={styles.socialBtn}
        />
        <SocialButton
          type="google"
          title="Continue With Google"
          icon="G"
          onPress={() => {}}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Pressable onPress={onCreateAccount}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
  },
  form: {
    marginBottom: Spacing.lg,
  },
  eyeBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    padding: Spacing.xs,
  },
  eyeIcon: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
  forgotText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actionBtn: {
    marginBottom: Spacing.lg,
  },
  orText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  socialBtn: {
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
