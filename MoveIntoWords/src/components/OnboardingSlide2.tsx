import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';

const PROMPTS = [
  "What's been taking up the most mental space lately?",
  'What would it feel like to finally let that go?',
  'What one small step feels honest and doable today?',
];

const OnboardingSlide2: React.FC = () => {
  return (
    <View style={styles.container}>
      {PROMPTS.map((prompt, index) => {
        const isActive = index === 1;
        return (
          <View key={prompt} style={[styles.card, isActive ? styles.cardActive : styles.cardInactive]}>
            <Text style={[styles.promptText, isActive && styles.promptTextActive]}>
              "{prompt}"
            </Text>
          </View>
        );
      })}

      <View style={[styles.card, styles.cardInactive]}>
        <Text style={styles.inputPlaceholder}>Start writing...</Text>
      </View>
    </View>
  );
};

export default OnboardingSlide2;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radii.md,
    padding: Spacing.lg,
    justifyContent: 'center',
    minHeight: Spacing.xxl + Spacing.lg,
  },
  cardActive: {
    backgroundColor: Colors.primaryDark,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryLight,
  },
  cardInactive: {
    backgroundColor: Colors.surfaceDark,
  },
  promptText: {
    fontFamily: FontFamily.serif,
    fontStyle: 'italic',
    fontSize: Typography.body.fontSize,
    color: Colors.textPlaceholder,
  },
  promptTextActive: {
    color: Colors.white,
  },
  inputPlaceholder: {
    ...Typography.body,
    color: Colors.textPlaceholder,
  },
});
