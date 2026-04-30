import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { useThemeColors } from '../hooks/useThemeColors';

interface Category {
  title: string;
  active: boolean;
}

const CATEGORIES: Category[] = [
  { title: 'Love & Relationships', active: true },
  { title: 'Career Development', active: false },
  { title: 'Inner-Child', active: false },
  { title: 'Self-Esteem & Confidence', active: false },
  { title: 'Healing', active: false },
  { title: 'Core Values', active: false },
];

const OnboardingSlide4: React.FC = () => {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {CATEGORIES.map((cat) => (
        <View key={cat.title} style={[styles.pill, cat.active ? styles.pillActive : styles.pillInactive]}>
          <View style={[styles.dot, cat.active ? styles.dotActive : styles.dotInactive]} />
          <Text style={[styles.text, cat.active ? styles.textActive : styles.textInactive]}>
            {cat.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default OnboardingSlide4;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
  },
  pillActive: {
    backgroundColor: Colors.primaryDark,
  },
  pillInactive: {
    backgroundColor: Colors.surfaceDark,
  },
  dot: {
    width: Spacing.xxs + 2,
    height: Spacing.xxs + 2,
    borderRadius: (Spacing.xxs + 2) / 2,
    marginRight: Spacing.md,
  },
  dotActive: {
    backgroundColor: Colors.primaryLight,
  },
  dotInactive: {
    backgroundColor: Colors.surfaceDarker,
  },
  text: {
    fontFamily: FontFamily.serif,
    fontSize: Typography.body.fontSize,
  },
  textActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  textInactive: {
    color: Colors.textPlaceholder,
  },
});
