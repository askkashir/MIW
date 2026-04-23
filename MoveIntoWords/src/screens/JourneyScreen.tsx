import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { JourneyStackParamList, JournalEntry } from '../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<JourneyStackParamList, 'JourneyHome'>;

/** Returns a local YYYY-MM-DD string — never uses UTC. */
const toDateStr = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const computeStreak = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;
  const dateSet = new Set(entries.map((e) => toDateStr(e.createdAt)));
  const today = toDateStr(Date.now());
  const yesterday = toDateStr(Date.now() - 86400000);
  const startDate = dateSet.has(today) ? today : yesterday;
  if (!dateSet.has(startDate)) return 0;
  let streak = 0;
  const [y, m, day] = startDate.split('-').map(Number);
  const d = new Date(y, m - 1, day); // local midnight, no UTC ambiguity
  while (dateSet.has(toDateStr(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

const computeLongestStreak = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;
  const sorted = [...new Set(entries.map((e) => toDateStr(e.createdAt)))].sort();
  let longest = 1, current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const [y1, m1, d1] = sorted[i].split('-').map(Number);
    const [y2, m2, d2] = sorted[i - 1].split('-').map(Number);
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    const diff = Math.round((date1.getTime() - date2.getTime()) / 86400000);
    current = diff === 1 ? current + 1 : 1;
    if (current > longest) longest = current;
  }
  return longest;
};

const buildMonthGrid = (year: number, month: number): (number | '')[][] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | '')[] = [...Array(startOffset).fill(''), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push('');
  const weeks: (number | '')[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

export const JourneyScreen: React.FC<Props> = ({ navigation }) => {
  const entries = useJournalStore((s) => s.entries);
  const moduleProgress = useJournalStore((s) => s.moduleProgress);
  const streak = computeStreak(entries);
  const longest = computeLongestStreak(entries);
  const modulesStarted = moduleProgress.filter((p) => p.currentStep > 0).length;
  const modulesCompleted = moduleProgress.filter((p) => p.isComplete).length;
  const words = entries.reduce((acc, e) => acc + e.content.split(/\s+/).filter(Boolean).length, 0);
  const uniqueDays = new Set(entries.map((e) => toDateStr(e.createdAt))).size;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weeks = buildMonthGrid(year, month);
  const entryDateSet = new Set(entries.map((e) => toDateStr(e.createdAt)));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeftPlaceholder} />
        <Text style={styles.headerTitle}>My Journey</Text>
        <View style={styles.profilePic}><Ionicons name="person" size={20} color={Colors.white} /></View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <Text style={styles.sectionSubtitle}>A quick look at how far you've come.</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><Ionicons name="calendar" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Total Days Written</Text></View>
              <Text style={styles.progressValue}>{uniqueDays}</Text>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><MaterialCommunityIcons name="fire" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Current Streak</Text></View>
              <Text style={styles.progressValue}>{streak} {streak === 1 ? 'Day' : 'Days'}</Text>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><Ionicons name="document-text" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Words Written</Text></View>
              <Text style={styles.progressValue}>{words.toLocaleString()}</Text>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><Ionicons name="bookmark" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Entries Saved</Text></View>
              <Text style={styles.progressValue}>{entries.length}</Text>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><Ionicons name="layers-outline" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Modules Started</Text></View>
              <Text style={styles.progressValue}>{modulesStarted}</Text>
            </View>
            <View style={styles.progressCard}>
              <View style={styles.progressIconRow}><Ionicons name="checkmark-circle-outline" size={16} color={Colors.primaryDark} /><Text style={styles.progressLabel}>Modules Completed</Text></View>
              <Text style={styles.progressValue}>{modulesCompleted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <Pressable style={styles.calendarCard} onPress={() => navigation.navigate('EntryArchive')}>
            <View style={styles.calendarHeaderRow}>
              <Text style={styles.calendarTitle}>{monthLabel}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
            </View>
            <View style={styles.calendarGrid}>
              <View style={styles.calendarRow}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <Text key={day} style={styles.dayLabel}>{day}</Text>
                ))}
              </View>
              {weeks.map((week, wIndex) => (
                <View key={wIndex} style={styles.calendarRow}>
                  {week.map((day, dIndex) => {
                    const dateStr = day !== '' ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                    const isFlame = dateStr !== '' && entryDateSet.has(dateStr);
                    return (
                      <View key={dIndex} style={styles.dayCell}>
                        {isFlame ? (
                          <View style={styles.flameCircle}><Ionicons name="flame" size={14} color={Colors.white} /></View>
                        ) : (
                          <Text style={[styles.dayText, day === '' && styles.dayTextMuted]}>{day !== '' ? String(day) : ''}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          <Text style={styles.sectionSubtitle}>Your next step is waiting.</Text>
          {modulesStarted === 0 ? (
            <View style={styles.noModulesCard}>
              <Ionicons name="layers-outline" size={24} color={Colors.border} />
              <Text style={styles.noModulesText}>No modules started yet.</Text>
            </View>
          ) : (
            <View style={styles.modStatsCard}>
              <View style={styles.modStatRow}>
                <Ionicons name="layers-outline" size={20} color={Colors.primary} />
                <Text style={styles.modStatLabel}>Modules started</Text>
                <Text style={styles.modStatValue}>{modulesStarted}</Text>
              </View>
              <View style={styles.modStatDivider} />
              <View style={styles.modStatRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} />
                <Text style={styles.modStatLabel}>Modules completed</Text>
                <Text style={styles.modStatValue}>{modulesCompleted}</Text>
              </View>
              {longest > 0 && (
                <>
                  <View style={styles.modStatDivider} />
                  <View style={styles.modStatRow}>
                    <MaterialCommunityIcons name="fire" size={20} color={Colors.primary} />
                    <Text style={styles.modStatLabel}>Best streak</Text>
                    <Text style={styles.modStatValue}>{longest} days</Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JourneyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  headerLeftPlaceholder: { width: 40 },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  section: { marginBottom: Spacing.xxl },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  sectionSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  progressCard: { backgroundColor: Colors.white, width: '47%', padding: Spacing.md, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  progressIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  progressLabel: { ...Typography.caption, fontSize: 10, fontWeight: '600', color: Colors.textSecondary, flex: 1 },
  progressValue: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  calendarCard: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  calendarHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  calendarTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary },
  calendarGrid: { gap: Spacing.sm },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayLabel: { ...Typography.caption, fontSize: 10, fontWeight: '600', color: Colors.textPrimary, width: 24, textAlign: 'center' },
  dayCell: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  dayText: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600' },
  dayTextMuted: { color: '#D0D0D0' },
  flameCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#731C32', alignItems: 'center', justifyContent: 'center' },
  inProgressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  inProgressContent: { flex: 1, paddingRight: Spacing.sm },
  inProgressTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  inProgressDesc: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 16 },
  inProgressFooter: { ...Typography.caption, fontSize: 11, color: Colors.textSecondary },
  modStatsCard: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  modStatRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  modStatLabel: { ...Typography.body, color: Colors.textSecondary, flex: 1 },
  modStatValue: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  modStatDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  noModulesCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0' },
  noModulesText: { ...Typography.body, color: Colors.textSecondary },
});
