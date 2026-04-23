import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { getModuleById } from '../constants/modules';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleDetail'>;

export const ModuleDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { moduleId } = route.params;
  const module = getModuleById(moduleId);
  const [showReview, setShowReview] = useState(false);

  const progress = useJournalStore((s) => s.moduleProgress).find(
    (p) => p.moduleId === moduleId,
  );
  const isComplete = progress?.isComplete ?? false;
  const currentStep = progress?.currentStep ?? 0;

  if (!module) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Module not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBeginOrContinue = () => {
    if (isComplete) {
      setShowReview(true);
      return;
    }

    if (currentStep === 0) {
      // Never started — go to step 1
      navigation.navigate('ModuleWrite', { moduleId });
    } else if (currentStep === 1) {
      // Step 1 done — resume at step 2
      const step1Response = progress?.responses?.['1'] ?? '';
      navigation.navigate('ModuleDeepen', { moduleId, step1Response });
    } else if (currentStep === 2) {
      // Steps 1+2 done — resume at step 3
      const step1Response = progress?.responses?.['1'] ?? '';
      const step2Response = progress?.responses?.['2'] ?? '';
      navigation.navigate('ModuleSave', { moduleId, step1Response, step2Response });
    } else {
      // currentStep === 3, not yet marked complete — resume at step 3
      const step1Response = progress?.responses?.['1'] ?? '';
      const step2Response = progress?.responses?.['2'] ?? '';
      navigation.navigate('ModuleSave', { moduleId, step1Response, step2Response });
    }
  };

  const buttonLabel = isComplete
    ? 'Review Responses'
    : currentStep > 0
    ? 'Continue Where I Left Off'
    : 'Begin Module';

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{module.category}</Text>
          </View>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.description}</Text>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.timeText}>~{module.estimatedMinutes} min</Text>
          </View>
        </View>

        {/* Steps list */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inside This Module</Text>
          {module.steps.map((step) => {
            const stepDone = isComplete || currentStep > step.stepNumber;
            const isCurrent = !isComplete && currentStep === step.stepNumber;
            return (
              <View key={step.stepNumber} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepCircle,
                    stepDone && styles.stepCircleDone,
                    isCurrent && styles.stepCircleCurrent,
                  ]}
                >
                  {stepDone ? (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  ) : (
                    <Text
                      style={[
                        styles.stepNum,
                        isCurrent && styles.stepNumCurrent,
                      ]}
                    >
                      {step.stepNumber}
                    </Text>
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent && styles.stepTitleCurrent,
                    ]}
                  >
                    {step.title}
                    {isCurrent ? ' ←' : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomAction}>
        <Pressable style={styles.continueBtn} onPress={handleBeginOrContinue}>
          <Text style={styles.continueBtnText}>{buttonLabel}</Text>
        </Pressable>
      </View>

      {/* Review Modal */}
      <Modal
        visible={showReview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Responses</Text>
              <TouchableOpacity
                onPress={() => setShowReview(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {module.steps.map((step, idx) => (
                <View key={step.stepNumber}>
                  <Text style={styles.reviewStepTitle}>{step.title}</Text>
                  <Text style={styles.reviewResponse}>
                    {progress?.responses?.[String(step.stepNumber)] || '—'}
                  </Text>
                  {idx < module.steps.length - 1 && (
                    <View style={styles.reviewDivider} />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ModuleDetailScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...Typography.body, color: Colors.textSecondary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8FAABC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  heroSection: { alignItems: 'center', marginBottom: Spacing.xl },
  categoryPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
    marginBottom: Spacing.md,
  },
  categoryText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  moduleTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  moduleSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  cardTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleCurrent: {
    borderColor: Colors.primaryDark,
  },
  stepNum: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stepNumCurrent: {
    color: Colors.primaryDark,
  },
  stepInfo: { flex: 1 },
  stepTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepTitleCurrent: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  bottomAction: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  continueBtn: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  continueBtnText: { ...Typography.button, color: Colors.white },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: { padding: Spacing.xs },
  reviewStepTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  reviewResponse: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
});
