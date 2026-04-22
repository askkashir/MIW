import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { MODULES } from '../constants/modules';
import { saveModuleProgress } from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleWrite'>;

export const ModuleWriteScreen: React.FC<Props> = ({ navigation, route }) => {
  const [text, setText] = useState('');
  const moduleId = route.params?.moduleId ?? MODULES[0].id;
  const uid = useUserStore((s) => s.uid);
  const { updateModuleProgress } = useJournalStore();

  const module = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];
  const step = module.steps[0];

  const handleSaveExit = async () => {
    const progress = { moduleId, currentStep: 1, totalSteps: module.steps.length };
    updateModuleProgress(progress);
    if (uid) {
      await saveModuleProgress(uid, progress).catch(() => {});
    }
    navigation.navigate('ModulesHome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{module.title}</Text>
              <Text style={styles.headerSubtitle}>Step 1 of {module.steps.length}</Text>
            </View>
            <TouchableOpacity style={styles.headerIcon} onPress={() => (navigation as any).navigate('CrisisResources')}>
              <Ionicons name="heart-outline" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.promptTitle}>{step.prompt}</Text>
            <TextInput
              style={styles.input}
              placeholder="Start writing..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
              autoFocus
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Save & Continue"
              onPress={() => navigation.navigate('ModuleDeepen', { moduleId, content: text })}
              variant="filled"
              style={styles.continueBtn}
              disabled={text.trim().length === 0}
            />
            <TouchableOpacity style={styles.exitBtn} onPress={handleSaveExit}>
              <Text style={styles.exitText}>Save & Exit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ModuleWriteScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  headerIcon: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  headerSubtitle: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  content: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
  promptTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.xxl, lineHeight: 32 },
  input: { flex: 1, ...Typography.body, color: Colors.textPrimary, fontSize: 16 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, paddingTop: Spacing.md, gap: Spacing.sm },
  continueBtn: { backgroundColor: Colors.primaryDark },
  exitBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  exitText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
});
