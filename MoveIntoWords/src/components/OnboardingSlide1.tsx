import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';

const OnboardingSlide1: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardDark]}>
        <Text style={styles.caption}>THIS WEEK IN MIW</Text>
        <View style={styles.row}>
          <View style={styles.circles}>
            <View style={[styles.circle, { zIndex: 4, left: 0 }]} />
            <View style={[styles.circle, { zIndex: 3, left: -10 }]} />
            <View style={[styles.circle, { zIndex: 2, left: -20 }]} />
            <View style={[styles.circle, { zIndex: 1, left: -30 }]} />
          </View>
          <Text style={styles.cardText}>247 members journaled{'\n'}today</Text>
        </View>
      </View>

      <View style={[styles.card, styles.cardSurface]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.partnerTitle}>CorePower Yoga</Text>
            <Text style={styles.partnerSubtitle}>1 free class · 0.4 mi away</Text>
          </View>
          <View style={styles.redeemBtn}>
            <Text style={styles.redeemBtnText}>REDEEM</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.cardSurface]}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <Text style={[styles.partnerSubtitle, styles.quoteText]}>
            "It starts with you. Every single time." — Kayla
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OnboardingSlide1;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
  },
  cardDark: {
    backgroundColor: Colors.primaryDark,
  },
  cardSurface: {
    backgroundColor: Colors.surfaceDark,
  },
  caption: {
    ...Typography.caption,
    color: Colors.textPlaceholder,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circles: {
    flexDirection: 'row',
    width: Spacing.xxl + Spacing.sm,
    height: Spacing.xl - Spacing.xs,
  },
  circle: {
    width: Spacing.xl - Spacing.xs,
    height: Spacing.xl - Spacing.xs,
    borderRadius: Spacing.md - Spacing.xxs,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    position: 'absolute',
  },
  cardText: {
    ...Typography.caption,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  partnerTitle: {
    fontFamily: FontFamily.serif,
    fontSize: Typography.h3.fontSize,
    color: Colors.white,
    fontWeight: '600',
    marginBottom: Spacing.xxs,
  },
  partnerSubtitle: {
    ...Typography.caption,
    color: Colors.textPlaceholder,
  },
  redeemBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
  },
  redeemBtnText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatar: {
    width: Spacing.xl + Spacing.xxs,
    height: Spacing.xl + Spacing.xxs,
    borderRadius: (Spacing.xl + Spacing.xxs) / 2,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontFamily: FontFamily.serif,
    fontSize: Typography.h3.fontSize,
    color: Colors.white,
    fontWeight: 'bold',
  },
  quoteText: {
    fontStyle: 'italic',
    flex: 1,
  },
});
