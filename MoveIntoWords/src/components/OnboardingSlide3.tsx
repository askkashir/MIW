import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';

const ACTIVE_INDICES = new Set([2, 7, 12, 16, 21, 25, 27]);
const CELL_COUNT = 28;

interface StatBoxProps {
  value: string;
  label: string;
}

const StatBox: React.FC<StatBoxProps> = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const OnboardingSlide3: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.graphCard}>
        <Text style={styles.caption}>MARCH 2025</Text>
        <View style={styles.grid}>
          {Array.from({ length: CELL_COUNT }).map((_, i) => (
            <View
              key={i}
              style={[styles.cell, ACTIVE_INDICES.has(i) ? styles.cellActive : styles.cellInactive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatBox value="22" label="DAYS" />
        <StatBox value="14" label="ENTRIES" />
        <StatBox value="3" label="MODULES" />
      </View>
    </View>
  );
};

export default OnboardingSlide3;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  graphCard: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
  },
  caption: {
    ...Typography.caption,
    color: Colors.textPlaceholder,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs + 2,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  cell: {
    width: '11%',
    aspectRatio: 1,
    borderRadius: Spacing.xxs,
  },
  cellActive: {
    backgroundColor: Colors.primaryDark,
  },
  cellInactive: {
    backgroundColor: Colors.surfaceDarker,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.serif,
    fontSize: Typography.h1.fontSize,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xxs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textPlaceholder,
    letterSpacing: 0.5,
  },
});
