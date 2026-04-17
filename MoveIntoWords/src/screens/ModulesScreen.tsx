import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

const MODULES_DATA = [
  { id: '1', title: 'Love & Relationships', desc: 'Explore your feelings about connections with...', category: 'Emotional', step: 1, totalSteps: 12, icon: 'heart', color: '#FFB6C1', bg: '#FFF0F5' },
  { id: '2', title: 'Gratitude Practice', desc: 'Cultivate gratitude and notice the good in...', category: 'Growth', step: 8, totalSteps: 12, icon: 'cloud', color: '#87CEFA', bg: '#F0F8FF' },
  { id: '3', title: 'Career Development', desc: 'Build inner strength and bounce back from challenges', category: 'Growth', step: 0, totalSteps: 10, icon: 'briefcase', color: '#FFA07A', bg: '#FFF5EE' },
  { id: '4', title: 'Anxiety & Stress', desc: 'Ground yourself and build coping skills', category: 'Emotional', step: 3, totalSteps: 8, icon: 'people', color: '#FF69B4', bg: '#FFF0F5' },
  { id: '5', title: 'Self Discovery', desc: 'Uncover what makes you unique and find...', category: 'Growth', step: 0, totalSteps: 15, icon: 'flash', color: '#FFD700', bg: '#FFFFE0' },
];

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModulesHome'>;

export const ModulesScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <View style={styles.streakBadge}>
        <Ionicons name="gift" size={16} color={Colors.white} />
        <Text style={styles.streakText}>150</Text>
      </View>
      <Text style={styles.headerTitle}>Modules</Text>
      <View style={styles.profilePic}>
        <Ionicons name="person" size={20} color={Colors.white} />
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
        <Pressable style={[styles.filterPill, styles.filterPillActive]}><Text style={[styles.filterText, styles.filterTextActive]}>All (22)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>Emotional (8)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>Growth (12)</Text></Pressable>
        <Pressable style={styles.filterPill}><Text style={styles.filterText}>New</Text></Pressable>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Find Your Focus</Text>
        <Text style={styles.sectionSubtitle}>Browse guided modules for reflection, growth, and support.</Text>
      </View>

      <View style={styles.modulesList}>
        {MODULES_DATA.map((mod) => (
          <Pressable key={mod.id} style={styles.moduleCard} onPress={() => navigation.navigate('ModuleDetail')}>
            <View style={[styles.moduleIconContainer, { backgroundColor: mod.bg }]}>
              <Ionicons name={mod.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={mod.color} />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
              <Text style={styles.moduleDesc}>{mod.desc}</Text>
              {mod.step > 0 && (
                <View style={styles.progressRow}>
                  <Text style={styles.progressText}>Prompt {mod.step} of {mod.totalSteps}</Text>
                  <View style={styles.dotsContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: i < mod.step / (mod.totalSteps / 5) ? mod.color : Colors.surface, borderWidth: i >= mod.step / (mod.totalSteps / 5) ? 1 : 0, borderColor: mod.bg }]} />
                    ))}
                  </View>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPlaceholder} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default ModulesScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryDark, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radii.sm, gap: Spacing.xs },
  streakText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 120 },
  filtersContainer: { marginBottom: Spacing.xl },
  filtersContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingVertical: Spacing.xs },
  filterPill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  filterPillActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  filterText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  sectionHeader: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  sectionSubtitle: { ...Typography.caption, color: Colors.textSecondary },
  modulesList: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  moduleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.md, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  moduleIconContainer: { width: 44, height: 44, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  moduleContent: { flex: 1, paddingRight: Spacing.sm },
  moduleTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  moduleDesc: { ...Typography.caption, fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: Spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  progressText: { ...Typography.caption, fontSize: 10, color: Colors.textSecondary },
  dotsContainer: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
