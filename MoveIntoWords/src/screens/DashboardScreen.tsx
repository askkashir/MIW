import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, Image } from 'react-native';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  onWrite: () => void;
}

export const DashboardScreen: React.FC<Props> = ({ onWrite }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.streakBadge}>
            <Ionicons name="gift" size={16} color={Colors.white} />
            <Text style={styles.streakText}>150</Text>
          </View>
          <View style={styles.profilePic}>
            {/* Placeholder for Profile Picture */}
            <Ionicons name="person" size={20} color={Colors.white} />
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Good Morning, Alex.</Text>
          <Text style={styles.subtitle}>Start your day with a few mindful moments.</Text>
        </View>

        {/* Week Calendar */}
        <View style={styles.calendarCard}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => {
            const isFlame = [0, 3, 4, 5].includes(index); // Hardcoded visual for MON, THU, FRI, SAT
            const dayNum = index + 1; // dummy day numbers 1-7
            return (
              <View key={day} style={styles.dayCol}>
                <Text style={styles.dayLabel}>{day}</Text>
                {isFlame ? (
                  <View style={styles.flameCircle}>
                    <Ionicons name="flame" size={14} color={Colors.white} />
                  </View>
                ) : (
                  <Text style={styles.dayNum}>{dayNum === 2 ? '2' : dayNum === 3 ? '3' : '7'}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Actions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How would you like to think today?</Text>
          <Text style={styles.sectionSubtitle}>Select upto 3 to shape up your experience.</Text>

          <View style={styles.actionCardsGroup}>
            <Pressable style={styles.actionCard}>
              <View style={styles.actionIconPlaceholder}>
                 <Ionicons name="scan-circle-outline" size={24} color={Colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionCardTitle}>Continue a Module</Text>
                <Text style={styles.actionCardSubtitle}>Continue - Last Entry: 2 days ago</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.actionCard}>
              <View style={styles.actionIconPlaceholder}>
                 <Ionicons name="grid-outline" size={24} color="#D2743E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionCardTitle}>Start a New Module</Text>
                <Text style={styles.actionCardSubtitle}>Begin - Last Entry: 1 week ago</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.actionCard} onPress={onWrite}>
              <View style={styles.actionIconPlaceholder}>
                 <Ionicons name="pencil" size={24} color="#27AE60" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionCardTitle}>Free Write</Text>
                <Text style={styles.actionCardSubtitle}>Continue - Last Entry: Yesterday</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </Pressable>

            <Pressable style={styles.exploreBtn}>
              <Text style={styles.exploreText}>Explore Modules</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Your Space */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Space</Text>
          <Text style={styles.sectionSubtitle}>Select 1 area to shape your experience.</Text>
          <View style={[styles.actionCardsGroup, { minHeight: 150 }]}>
            {/* Blank for now, as obscured in UI */}
          </View>
        </View>
      </ScrollView>

      {/* Custom Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem}>
            <Ionicons name="home" size={24} color={Colors.primaryDark} />
            <Text style={[styles.navLabel, { color: Colors.primaryDark }]}>Home</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <Ionicons name="grid-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.navLabel}>Modules</Text>
          </Pressable>
          
          {/* Write Floating Button area */}
          <View style={styles.navItemCentral}>
             {/* The actual floating button is positioned absolutely above */}
          </View>

          <Pressable style={styles.navItem}>
            <Ionicons name="book-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.navLabel}>Journey</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.navLabel}>More</Text>
          </Pressable>
        </View>
        
        {/* Floating Write Button */}
        <Pressable style={styles.floatingWriteBtn} onPress={onWrite}>
           <Ionicons name="pencil" size={24} color={Colors.white} />
           <Text style={styles.floatingWriteLabel}>Write</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
    gap: Spacing.xs,
  },
  streakText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8FAABC', // Placeholder color
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  calendarCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.xxl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayCol: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dayLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayNum: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    height: 24,
    lineHeight: 24,
  },
  flameCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xxs,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  actionCardsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionCardTitle: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  actionCardSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  exploreText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'space-between',
  },
  navItem: {
    alignItems: 'center',
    width: 60,
    gap: 4,
  },
  navItemCentral: {
    width: 60,
  },
  navLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  floatingWriteBtn: {
    position: 'absolute',
    top: -24,
    backgroundColor: Colors.primaryDark,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingWriteLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.white,
    marginTop: 2,
  }
});
