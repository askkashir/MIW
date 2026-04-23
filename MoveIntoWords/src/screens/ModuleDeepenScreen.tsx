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
import type { ModuleProgress } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { getModuleById } from '../constants/modules';
import { saveModuleProgress } from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleDeepen'>;

export const ModuleDeepenScreen: React.FC<Props> = ({ navigation, route }) => {
  const { moduleId, step1Response } = route.params;
  const existingResponse =
    useJournalStore.getState().moduleProgress.find((p) => p.moduleId === moduleId)?.responses?.['2'] ?? '';
  const [text, setText] = useState(existingResponse);
  const [isSaving, setIsSaving] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const uid = useUserStore((s) => s.uid);

  const module = getModuleById(moduleId);
  const step = module?.steps[1];

  const isNextEnabled = text.trim().length >= 10;

  const handleNext = async () => {
    if (!isNextEnabled || isSaving) return;
    setIsSaving(true);
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
          '2': text,
        },
        startedAt: existingProgress?.startedAt ?? Date.now(),
        lastUpdatedAt: Date.now(),
      };

      if (uid) {
        await saveModuleProgress(uid, updatedProgress);
      }
      useJournalStore.getState().updateModuleProgress(updatedProgress);
      navigation.navigate('ModuleSave', {
        moduleId,
        step1Response,
        step2Response: text,
      });
    } catch {
      Alert.alert('Error', 'Could not save your response. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExit = async () => {
    try {
      const existingProgress = useJournalStore
        .getState()
        .moduleProgress.find((p) => p.moduleId === moduleId);

      const updatedProgress: ModuleProgress = {
        moduleId,
        currentStep: 2,
        totalSteps: 3,
        isComplete: false,
        responses: {
          ...(existingProgress?.responses ?? {}),
          '1': step1Response,
          ...(text.trim().length > 0 ? { '2': text } : {}),
        },
        startedAt: existingProgress?.startedAt ?? Date.now(),
        lastUpdatedAt: Date.now(),
      };

      if (uid) {
        await saveModuleProgress(uid, updatedProgress).catch(() => {});
      }
      useJournalStore.getState().updateModuleProgress(updatedProgress);
    } catch { /* fail silently on exit */ }
    navigation.navigate('ModulesHome');
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

      {/* Progress bar — step 2 of 3 */}
      <View style={styles.progressRow}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={[
              styles.progressSegment,
              n <= 2 && styles.progressSegmentFilled,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>Step 2 of 3 — {step.title}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Collapsible previous response */}
        <TouchableOpacity
          style={styles.previousToggle}
          onPress={() => setShowPrevious((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.previousToggleText}>
            Your step 1 response{' '}
            <Ionicons
              name={showPrevious ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={Colors.textSecondary}
            />
          </Text>
        </TouchableOpacity>
        {showPrevious && (
          <View style={styles.previousBox}>
            <Text style={styles.previousText}>{step1Response || '—'}</Text>
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
            styles.nextBtn,
            !isNextEnabled && styles.nextBtnDisabled,
          ]}
          onPress={handleNext}
          disabled={!isNextEnabled || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.nextBtnText}>Next</Text>
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

export default ModuleDeepenScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
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
  previousToggle: {
    marginBottom: Spacing.sm,
  },
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
  previousText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  nextBtn: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextBtnText: { ...Typography.button, color: Colors.white },
});
