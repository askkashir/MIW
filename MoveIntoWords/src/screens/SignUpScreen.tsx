import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import SocialButton from '../components/SocialButton';
import { signInWithGoogle, signInWithApple } from '../services/firebase/auth';

const MIW_LOGO = require('../../assets/miw-logo.png');

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const logoWidth = width * 0.5;
  const logoHeight = logoWidth * 0.45;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={MIW_LOGO}
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Create Your Space</Text>
          <Text style={styles.subtitle}>
            Sign up to keep your writing private and accessible.
          </Text>
        </View>

        <SocialButton
          type="email"
          title="Continue With Email"
          icon="✉"
          onPress={() => navigation.navigate('SignUpEmail')}
          style={styles.actionBtn}
        />
        <SocialButton
          type="apple"
          title="Continue With Apple"
          icon=""
          onPress={signInWithApple}
          style={styles.socialBtn}
        />
        <SocialButton
          type="google"
          title="Continue With Google"
          icon="G"
          onPress={signInWithGoogle}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Have an account? </Text>
          <Pressable onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
  logoWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
    textAlign: 'center',
  },
  actionBtn: {
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
