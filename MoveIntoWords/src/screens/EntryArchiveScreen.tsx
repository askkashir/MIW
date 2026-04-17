import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { JourneyStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<JourneyStackParamList, 'EntryArchive'>;

export const EntryArchiveScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.headerTitle}>Entry Archive</Text>
      <View style={styles.profilePic}>
        <Ionicons name="person" size={20} color={Colors.white} />
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
        <Pressable style={[styles.filterPill, styles.filterPillActive]}><Text style={[styles.filterText, styles.filterTextActive]}>All (22)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>Gratitude (9)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>Growth (12)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>Expenditu...</Text></Pressable>
      </ScrollView>

      <View style={styles.groupSection}>
        <Text style={styles.groupTitle}>Growth & Resilience</Text>
        <Text style={styles.groupSubtitle}>Reflect, recover, and grow.</Text>
        <View style={styles.entryList}>
          {[0, 1].map((i) => (
            <Pressable key={i} style={styles.entryCard}>
              <View style={styles.entryIconBox}><Ionicons name="flash" size={16} color="#F2C94C" /></View>
              <View style={styles.entryContent}>
                <Text style={styles.entryTitle}>Reflect on a recent setback or failure.</Text>
                <Text style={styles.entryPreview} numberOfLines={3}>I faced a really difficult situation at work. Initially, I felt overwhelmed and unsure how to handle it. It took sometime, but...</Text>
                <Text style={styles.entryMeta}>• 137 words • 16 min</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default EntryArchiveScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  headerBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 40 },
  filtersContainer: { marginBottom: Spacing.xxl },
  filtersContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingVertical: Spacing.xs },
  filterPill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  filterPillActive: { backgroundColor: '#731C32', borderColor: '#731C32' },
  filterText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  groupSection: { paddingHorizontal: Spacing.xl },
  groupTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  groupSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  entryList: { gap: Spacing.md },
  entryCard: { flexDirection: 'row', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1, alignItems: 'center' },
  entryIconBox: { alignSelf: 'flex-start', marginTop: 4, marginRight: Spacing.md },
  entryContent: { flex: 1, paddingRight: Spacing.sm },
  entryTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  entryPreview: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18, marginBottom: Spacing.sm },
  entryMeta: { ...Typography.caption, fontSize: 11, color: Colors.textSecondary },
});
