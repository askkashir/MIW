import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import type { ModuleProgress, JournalEntry } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { getModuleById } from '../constants/modules';
import {
  saveModuleProgress,
  saveJournalEntry,
} from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleSave'>;

export const ModuleSaveScreen: React.FC<Props> = ({ navigation, route }) => {
  const { moduleId, step1Response, step2Response } = route.params;
  const existingResponse =
    useJournalStore.getState().moduleProgress.find((p) => p.moduleId === moduleId)?.responses?.['3'] ?? '';
  const [text, setText] = useState(existingResponse);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const uid = useUserStore((s) => s.uid);

  const module = getModuleById(moduleId);
  const step = module?.steps[2];

  const isCompleteEnabled = text.trim().length >= 10;

  const handleComplete = async () => {
    if (!isCompleteEnabled || isSaving) return;
    setIsSaving(true);
    try {
      const existingProgress = useJournalStore
        .getState()
        .moduleProgress.find((p) => p.moduleId === moduleId);

      const completedProgress: ModuleProgress = {
        moduleId,
        currentStep: 3,
        totalSteps: 3,
        isComplete: true,
        responses: {
          '1': step1Response,
          '2': step2Response,
          '3': text,
        },
        startedAt: existingProgress?.startedAt ?? Date.now(),
        completedAt: Date.now(),
        lastUpdatedAt: Date.now(),
      };

      if (uid) {
        await saveModuleProgress(uid, completedProgress);
      }
      useJournalStore.getState().updateModuleProgress(completedProgress);

      // Save as journal entry so it appears in the archive
      if (module && uid) {
        const step1 = module.steps[0];
        const step2 = module.steps[1];
        const step3 = module.steps[2];
        const combinedContent = `[${module.title}]\n\n${step1.title}:\n${step1Response}\n\n${step2.title}:\n${step2Response}\n\n${step3.title}:\n${text}`;
        const entry: JournalEntry = {
          id: Date.now().toString(),
          content: combinedContent,
          createdAt: Date.now(),
        };
        await saveJournalEntry(uid, entry);
        useJournalStore.getState().addEntry(entry);
      }

      setIsComplete(true);
    } catch {
      Alert.alert('Error', 'Could not save your response. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!module || !step) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Module not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Phase 2: Completion screen ────────────────────────────────────────────
  if (isComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.completionContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Check icon */}
          <View style={styles.completionIcon}>
            <Ionicons
              name="checkmark-circle"
              size={64}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.completionTitle}>Module Complete</Text>
          <Text style={styles.completionSubtitle}>{module.title}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>3 prompts answered</Text>
            <View style={styles.statsDot} />
            <Text style={styles.statsText}>saved to your journal</Text>
          </View>

          {/* Responses review */}
          <View style={styles.responsesSection}>
            <Text style={styles.responsesSectionTitle}>Your Responses</Text>
            {module.steps.map((s, idx) => {
              const resp =
                idx === 0
                  ? step1Response
                  : idx === 1
                  ? step2Response
                  : text;
              return (
                <View key={s.stepNumber} style={styles.responseCard}>
                  <Text style={styles.responseStepTitle}>{s.title}</Text>
                  <Text style={styles.responseBody}>{resp}</Text>
                </View>
              );
            })}
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'ModulesHome' }] })
            }
          >
            <Text style={styles.primaryBtnText}>Back to Modules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => (navigation as any).navigate('JournalStack')}
          >
            <Text style={styles.secondaryBtnText}>Go to Journal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { marginTop: 0 }]}
            onPress={() => (navigation as any).navigate('JourneyStack')}
          >
            <Text style={styles.secondaryBtnText}>View Progress</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleSaveExit = async () => {
    try {
      const existingProgress = useJournalStore
        .getState()
        .moduleProgress.find((p) => p.moduleId === moduleId);

      const updatedProgress: ModuleProgress = {
        moduleId,
        currentStep: 3,
        totalSteps: 3,
        isComplete: false,
        responses: {
          ...(existingProgress?.responses ?? {}),
          '1': step1Response,
          '2': step2Response,
          ...(text.trim().length > 0 ? { '3': text } : {}),
        },
        startedAt: existingProgress?.startedAt ?? Date.now(),
        lastUpdatedAt: Date.now(),
      };

      if (uid) {
        await saveModuleProgress(uid, updatedProgress).catch(() => {});
      }
      useJournalStore.getState().updateModuleProgress(updatedProgress);
    } catch {
      // fail silently on exit
    }
    navigation.navigate('ModulesHome');
  };

  // ── Phase 1: Final prompt ─────────────────────────────────────────────────
  const content = (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveExitBtn}
          onPress={handleSaveExit}
        >
          <Text style={styles.saveExitText}>Save &amp; Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar — step 3 of 3 */}
      <View style={styles.progressRow}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={[styles.progressSegment, styles.progressSegmentFilled]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>Step 3 of 3 — {step.title}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Collapsible previous responses */}
        <TouchableOpacity
          style={styles.previousToggle}
          onPress={() => setShowPrevious((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.previousToggleText}>
            Your previous responses{' '}
            <Ionicons
              name={showPrevious ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={Colors.textSecondary}
            />
          </Text>
        </TouchableOpacity>
        {showPrevious && (
          <View style={styles.previousBox}>
            <Text style={styles.previousStepLabel}>
              {module.steps[0].title}
            </Text>
            <Text style={styles.previousText}>{step1Response}</Text>
            <View style={styles.previousDivider} />
            <Text style={styles.previousStepLabel}>
              {module.steps[1].title}
            </Text>
            <Text style={styles.previousText}>{step2Response}</Text>
          </View>
        )}

        {/* Prompt */}
        <Text style={styles.promptText}>{step.prompt}</Text>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={step.placeholder}
            placeholderTextColor={Colors.textPlaceholder}
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{text.length} chars</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.completeBtn,
            !isCompleteEnabled && styles.completeBtnDisabled,
          ]}
          onPress={handleComplete}
          disabled={!isCompleteEnabled || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.completeBtnText}>Complete Module</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'web' ? content : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {content}
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default ModuleSaveScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...Typography.body, color: Colors.textSecondary },

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerIcon: { width: 40, alignItems: 'center', justifyContent: 'center' },
  saveExitBtn: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  saveExitText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
  },
  progressSegmentFilled: {
    backgroundColor: Colors.primary,
  },
  progressLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
  previousToggle: { marginBottom: Spacing.sm },
  previousToggleText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  previousBox: {
    backgroundColor: Colors.background,
    borderRadius: Radii.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  previousStepLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  previousText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  previousDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  promptText: {
    fontFamily: FontFamily.serif,
    fontSize: 20,
    lineHeight: 30,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    minHeight: 160,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 26,
    minHeight: 160,
    paddingBottom: Spacing.xl,
  },
  charCount: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  completeBtn: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  completeBtnDisabled: { opacity: 0.4 },
  completeBtnText: { ...Typography.button, color: Colors.white },

  // ── Phase 2: Completion screen ───────────────────────────────────────────
  completionContent: {
    padding: Spacing.xl,
    paddingBottom: 60,
    alignItems: 'center',
  },
  completionIcon: { marginTop: Spacing.xl, marginBottom: Spacing.lg },
  completionTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  completionSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
  },
  responsesSection: {
    width: '100%',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  responsesSectionTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  responseCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  responseStepTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  responseBody: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryBtnText: { ...Typography.button, color: Colors.white },
  secondaryBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  secondaryBtnText: { ...Typography.button, color: Colors.primaryDark },
});
