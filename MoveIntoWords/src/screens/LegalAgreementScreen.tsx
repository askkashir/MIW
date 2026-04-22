/**
 * LegalAgreementScreen — Terms & privacy consent gate.
 *
 * The user must accept the legal agreement to proceed.
 * Declining exits the application via BackHandler.exitApp().
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import AuthProgress from '../components/AuthProgress';
import BottomAction from '../components/BottomAction';

type Props = NativeStackScreenProps<AuthStackParamList, 'LegalAgreement'>;

const LegalAgreementScreen: React.FC<Props> = ({ navigation }) => {
  const handleDecline = () => {
    BackHandler.exitApp();
  };

  const handleAccept = () => {
    navigation.navigate('Personalize');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress currentStep={3} totalSteps={3} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{'Terms & Privacy'}</Text>
          <Text style={styles.subtitle}>
            Please review and accept our terms to continue using Move Into Words.
          </Text>
        </View>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.cardTitle}>LEGAL AGREEMENT</Text>

            <Text style={styles.sectionHeader}>Terms of Service</Text>
            <Text style={styles.cardText}>
              By creating an account and using Move Into Words, you agree to our Terms of
              Service. You retain full ownership of all journal entries and personal content you
              create within the app. We do not sell, share, or use your personal writings for
              advertising or third-party purposes.
            </Text>

            <Text style={styles.sectionHeader}>Privacy Policy</Text>
            <Text style={styles.cardText}>
              Your data is encrypted in transit and at rest. We collect only the minimum
              information needed to provide the service — your email address, display name, and
              journaling preferences. You can export or delete your data at any time from the
              Settings screen.
            </Text>

            <Text style={styles.sectionHeader}>Data Usage</Text>
            <Text style={styles.cardText}>
              Anonymous, aggregated usage analytics may be collected to improve the app
              experience. No personally identifiable information is included in these analytics.
              You may opt out of analytics collection in your account settings.
            </Text>

            <Text style={styles.sectionHeader}>Your Rights</Text>
            <Text style={styles.cardText}>
              You have the right to access, correct, export, or delete your personal data at
              any time. To exercise these rights, visit Settings → My Data or contact our
              support team.
            </Text>
          </ScrollView>
        </View>
      </View>
      <BottomAction
        onBack={handleDecline}
        onNext={handleAccept}
      />
    </SafeAreaView>
  );
};

export default LegalAgreementScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: Spacing.xxs },
    shadowOpacity: 0.05,
    shadowRadius: Spacing.sm - 2,
    elevation: 3,
  },
  scrollContent: { paddingBottom: Spacing.xl },
  cardTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xxs,
  },
  cardText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
});
