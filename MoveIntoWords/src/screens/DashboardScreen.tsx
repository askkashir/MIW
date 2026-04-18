import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MainTabParamList, AuthStackParamList } from '../types';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<AuthStackParamList>
>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.streakBadge}>
          <Ionicons name="gift" size={16} color={Colors.white} />
          <Text style={styles.streakText}>150</Text>
        </View>
        <View style={styles.profilePic}>
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
          const isFlame = [0, 3, 4, 5].includes(index);
          const dayNum = index + 1;
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
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('ModulesStack')}>
            <View style={styles.actionIconPlaceholder}>
              <Ionicons name="scan-circle-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionCardTitle}>Continue a Module</Text>
              <Text style={styles.actionCardSubtitle}>Continue - Last Entry: 2 days ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('ModulesStack')}>
            <View style={styles.actionIconPlaceholder}>
              <Ionicons name="grid-outline" size={24} color="#D2743E" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionCardTitle}>Start a New Module</Text>
              <Text style={styles.actionCardSubtitle}>Begin - Last Entry: 1 week ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('JournalStack')}>
            <View style={styles.actionIconPlaceholder}>
              <Ionicons name="pencil" size={24} color="#27AE60" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionCardTitle}>Free Write</Text>
              <Text style={styles.actionCardSubtitle}>Continue - Last Entry: Yesterday</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate('ModulesStack')}>
            <Text style={styles.exploreText}>Explore Modules</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Your Space */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Space</Text>
        <Text style={styles.sectionSubtitle}>Select 1 area to shape your experience.</Text>
        <View style={[styles.actionCardsGroup, { minHeight: 150 }]} />
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default DashboardScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryDark, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radii.sm, gap: Spacing.xs },
  streakText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  welcomeSection: { marginBottom: Spacing.xl },
  title: { fontFamily: FontFamily.serif, fontSize: 32, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  calendarCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.surface, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, borderRadius: Radii.lg, marginBottom: Spacing.xxl, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  dayCol: { alignItems: 'center', gap: Spacing.sm },
  dayLabel: { ...Typography.caption, fontSize: 10, fontWeight: '600', color: Colors.textPrimary },
  dayNum: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, height: 24, lineHeight: 24 },
  flameCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: Spacing.xxl },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xxs },
  sectionSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  actionCardsGroup: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  actionIconPlaceholder: { width: 40, height: 40, borderRadius: Radii.sm, backgroundColor: '#F9F9F9', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  actionContent: { flex: 1 },
  actionCardTitle: { ...Typography.caption, fontWeight: '700', fontSize: 15, color: Colors.textPrimary, marginBottom: 2 },
  actionCardSubtitle: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary },
  exploreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.lg, paddingBottom: Spacing.xs, gap: Spacing.xs },
  exploreText: { ...Typography.caption, color: Colors.textSecondary },
});
