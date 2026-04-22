/**
 * FirstPromptScreen — Final onboarding step.
 *
 * Presents the user with their first journaling prompt after onboarding.
 * On complete, marks onboardingComplete: true in Firestore and navigates
 * to the main Dashboard.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import Button from '../components/Button';
import { updateOnboardingComplete } from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'FirstPrompt'>;

const FirstPromptScreen: React.FC<Props> = ({ navigation }) => {
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uid = useUserStore((s) => s.uid);

  const handleComplete = async () => {
    if (!uid) return;
    setIsSubmitting(true);
    try {
      await updateOnboardingComplete(uid);
      useUserStore.getState().setOnboardingComplete(true);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch {
      // Silently proceed — the flag can be set next time
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{'Your First\nReflection'}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Take a moment to write</Text>
          <Text style={styles.cardSubtitle}>
            What brought you here today? There are no wrong answers — just honest ones.
          </Text>

          <View style={styles.inputContainer}>
            <RNTextInput
              style={styles.textArea}
              multiline
              numberOfLines={8}
              placeholder="Start writing here..."
              placeholderTextColor={Colors.textPlaceholder}
              value={entry}
              onChangeText={setEntry}
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.hint}>
            You can always come back to this. This is just the beginning.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isSubmitting ? 'Saving...' : 'Begin My Journey'}
          onPress={handleComplete}
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default FirstPromptScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.xl,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  cardSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    backgroundColor: Colors.background,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 180,
    marginBottom: Spacing.md,
  },
  textArea: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textPlaceholder,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  continueBtn: {
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryDark,
  },
});
