import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleWrite'>;

export const ModuleWriteScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Growth & Resilience</Text>
              <Text style={styles.headerSubtitle}>Prompt 8 of 12</Text>
            </View>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.primaryDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.promptTitle}>Reflect On A Recent Setback Or Failure.</Text>
            <Text style={styles.promptSubtitle}>What did it teach you about your own strength?</Text>
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
            <Button label="Save & Continue" onPress={() => navigation.navigate('ModuleDeepen')} variant="filled" style={styles.continueBtn} disabled={text.trim().length === 0} />
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
  promptTitle: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  promptSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl, paddingHorizontal: Spacing.lg },
  input: { flex: 1, ...Typography.body, color: Colors.textPrimary, fontSize: 16 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, paddingTop: Spacing.md },
  continueBtn: { backgroundColor: Colors.primaryDark },
});
