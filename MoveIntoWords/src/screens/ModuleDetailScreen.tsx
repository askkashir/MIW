import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { MODULES } from '../constants/modules';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleDetail'>;

export const ModuleDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const moduleId = (route.params as any)?.moduleId as string | undefined;
  const module = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];
  const moduleProgress = useJournalStore((s) => s.moduleProgress);
  const savedProgress = moduleProgress.find((p) => p.moduleId === module.id);
  const hasStarted = savedProgress && savedProgress.currentStep > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.profilePic}>
          <Ionicons name="person" size={20} color={Colors.white} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.moduleIconLg}>
            <Ionicons name="flash" size={32} color="#FFD700" />
          </View>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Module</Text>
          <Text style={styles.cardText}>{module.description}</Text>
          <Text style={styles.cardMeta}>{module.estimatedMinutes} min · {module.steps.length} steps</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inside This Module</Text>
          {module.steps.map((step) => (
            <View key={step.stepNumber} style={styles.checkRow}>
              <View style={[styles.checkCircle, savedProgress && savedProgress.currentStep >= step.stepNumber && styles.checkCircleDone]}>
                <Ionicons name="checkmark" size={12} color={Colors.white} />
              </View>
              <Text style={styles.checkText}>{step.prompt.slice(0, 60)}…</Text>
            </View>
          ))}
        </View>

        {hasStarted && (
          <View style={styles.progressCard}>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>In Progress</Text>
            </View>
            <Text style={styles.progressTitle}>Step {savedProgress!.currentStep} of {savedProgress!.totalSteps} completed</Text>
            <Text style={styles.progressFooter}>{module.title}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Pressable
          style={styles.continueBtn}
          onPress={() => navigation.navigate('ModuleWrite', { moduleId: module.id })}
        >
          <Text style={styles.continueBtnText}>{hasStarted ? 'Continue' : 'Begin'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ModuleDetailScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  headerBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  heroSection: { alignItems: 'center', marginBottom: Spacing.xl },
  moduleIconLg: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFE0', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  moduleTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs, textAlign: 'center' },
  moduleSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  card: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: Spacing.lg, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  cardTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  cardText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.sm },
  cardMeta: { ...Typography.caption, color: Colors.textSecondary },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  checkCircleDone: { backgroundColor: Colors.primaryDark },
  checkText: { ...Typography.caption, color: Colors.textPrimary, flex: 1 },
  progressCard: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: Spacing.lg },
  progressPill: { backgroundColor: Colors.primaryDark, alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radii.sm, marginBottom: Spacing.sm },
  progressPillText: { ...Typography.caption, fontSize: 10, color: Colors.white, fontWeight: '700' },
  progressTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  progressFooter: { ...Typography.caption, color: Colors.textSecondary },
  bottomAction: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.background },
  continueBtn: { backgroundColor: Colors.primaryDark, paddingVertical: Spacing.md, borderRadius: Radii.full, alignItems: 'center' },
  continueBtnText: { ...Typography.button, color: Colors.white },
});
