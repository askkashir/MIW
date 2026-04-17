import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

type Props = NativeStackScreenProps<MoreStackParamList, 'MemberPerks'>;

const PERKS_DATA = [
  {
    id: '1',
    title: 'CorePower Yoga',
    desc: 'First class free, then 20% off monthly membership',
    badgeText: '20% OFF',
    badgeType: 'green',
    icon: 'body',
    iconColor: '#F2C94C',
    iconBg: '#FFF9E6',
    distance: '1.2 mi',
    category: 'Yoga',
    used: false,
  },
  {
    id: '2',
    title: 'F45 Training',
    desc: '15% off all class packages',
    badgeText: '15% OFF',
    badgeType: 'green',
    icon: 'barbell',
    iconColor: '#5484FF',
    iconBg: '#EEF3FF',
    distance: '0.8 mi',
    category: 'Fitness',
    used: true,
  },
  {
    id: '3',
    title: "Barry's Bootcamp",
    desc: 'One complimentary class per month',
    badgeText: 'FREE CLASS',
    badgeType: 'yellow',
    icon: 'walk',
    iconColor: '#FF6B6B',
    iconBg: '#FFEFEF',
    distance: '2.1 mi',
    category: 'Fitness',
    used: false,
  },
  {
    id: '4',
    title: 'Restore Hyper Wellness',
    desc: '25% off cryotherapy and IV therapy',
    badgeText: '25% OFF',
    badgeType: 'green',
    icon: 'leaf',
    iconColor: '#27AE60',
    iconBg: '#E9F7EF',
    distance: '1.5 mi',
    category: 'Wellness',
    used: false,
  },
];

export const MemberPerksScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.profilePic}>
          <Ionicons name="person" size={20} color={Colors.white} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.title}>Member Perks</Text>
          <Text style={styles.subtitle}>Exclusive access to local studios and wellness partners</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>PARTNERS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>USED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNum}>9</Text>
            <Text style={styles.statLabel}>AVAILABLE</Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          <Pressable style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>All Perks</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Yoga</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Fitness</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Wellness</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Nutrition</Text>
          </Pressable>
        </ScrollView>

        {/* Perks List */}
        <View style={styles.perksList}>
          {PERKS_DATA.map((perk) => (
            <View key={perk.id} style={styles.perkCard}>
              <View style={styles.perkHeader}>
                <View style={styles.perkTitleRow}>
                  <View style={[styles.iconContainer, { backgroundColor: perk.iconBg }]}>
                    <Ionicons name={perk.icon as any} size={16} color={perk.iconColor} />
                  </View>
                  <Text style={styles.perkTitle}>{perk.title}</Text>
                </View>
                
                <View style={[
                  styles.badge, 
                  perk.badgeType === 'green' ? styles.badgeGreen : styles.badgeYellow
                ]}>
                  <Text style={[
                    styles.badgeText,
                    perk.badgeType === 'green' ? styles.badgeTextGreen : styles.badgeTextYellow
                  ]}>
                    {perk.badgeText}
                  </Text>
                </View>
              </View>

              <Text style={styles.perkDesc}>{perk.desc}</Text>

              <View style={styles.perkFooter}>
                <Ionicons name="location" size={12} color="#EB5757" />
                <Text style={styles.perkFooterText}>{perk.distance} • {perk.category}</Text>
                
                {perk.used && (
                  <>
                    <Text style={styles.perkFooterText}> • </Text>
                    <View style={styles.usedBadge}>
                      <Text style={styles.usedBadgeText}>Used</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomAction}>
        <Button label="Request a Partnership" onPress={() => {}} variant="filled" style={styles.requestBtn} />
      </View>
    </SafeAreaView>
  );
};

export default MemberPerksScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerBtn: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8FAABC', // Placeholder color
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom button
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F7',
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radii.lg,
    marginBottom: Spacing.xl,
  },
  statCol: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: FontFamily.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0DADA',
  },
  filtersContainer: {
    marginBottom: Spacing.xl,
  },
  filtersContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  filterPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterPillActive: {
    backgroundColor: '#731C32', // Specific burgundy color from screenshot
    borderColor: '#731C32',
  },
  filterText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  perksList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  perkCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  perkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  perkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  badgeGreen: {
    backgroundColor: '#E9F7EF',
  },
  badgeYellow: {
    backgroundColor: '#FFF9E6',
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextGreen: {
    color: '#27AE60',
  },
  badgeTextYellow: {
    color: '#F2C94C',
  },
  perkDesc: {
    ...Typography.caption,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  perkFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  perkFooterText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  usedBadge: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  usedBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: '#5484FF',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  requestBtn: {
    backgroundColor: '#731C32', // specific burgundy
  },
});
