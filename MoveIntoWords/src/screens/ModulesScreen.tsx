import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { MODULES } from '../constants/modules';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModulesHome'>;

export const ModulesScreen: React.FC<Props> = ({ navigation }) => {
  const moduleProgress = useJournalStore((s) => s.moduleProgress);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Modules</Text>
        <View style={styles.profilePic}>
          <Ionicons name="person" size={20} color={Colors.white} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Find Your Focus</Text>
          <Text style={styles.sectionSubtitle}>
            Browse guided modules for reflection, growth, and support.
          </Text>
        </View>

        <View style={styles.modulesList}>
          {MODULES.map((mod) => {
            const progress = moduleProgress.find((p) => p.moduleId === mod.id);
            const isComplete = progress?.isComplete ?? false;
            const currentStep = progress?.currentStep ?? 0;
            const progressFraction = isComplete
              ? 1
              : currentStep / mod.steps.length;

            let stepLabel: string;
            if (isComplete) {
              stepLabel = '✓ Complete';
            } else if (currentStep > 0) {
              stepLabel = `${currentStep} / ${mod.steps.length} steps`;
            } else {
              stepLabel = `${mod.steps.length} steps`;
            }

            const buttonLabel = isComplete
              ? 'Review'
              : currentStep > 0
              ? 'Continue'
              : 'Start';

            const isOutline = isComplete;

            const handlePress = () => {
              navigation.navigate('ModuleDetail', { moduleId: mod.id });
            };

            return (
              <View key={mod.id} style={styles.moduleCard}>
                <View style={styles.cardTop}>
                  <View style={styles.cardMeta}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{mod.category}</Text>
                    </View>
                    <Text style={styles.timeText}>~{mod.estimatedMinutes} min</Text>
                  </View>
                </View>

                <Text style={styles.moduleTitle}>{mod.title}</Text>
                <Text style={styles.moduleDesc}>{mod.description}</Text>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressFraction * 100}%` as any },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isComplete && styles.stepLabelComplete,
                  ]}
                >
                  {stepLabel}
                </Text>

                {/* Action button */}
                <Pressable
                  style={[styles.button, isOutline && styles.buttonOutline]}
                  onPress={handlePress}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isOutline && styles.buttonTextOutline,
                    ]}
                  >
                    {buttonLabel}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModulesScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8FAABC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 120 },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  modulesList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  moduleCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    marginBottom: Spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  categoryText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  moduleTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  moduleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  stepLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  stepLabelComplete: {
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.white,
  },
  buttonTextOutline: {
    color: Colors.primaryDark,
  },
});
