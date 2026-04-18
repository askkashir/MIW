import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const PREVIOUS_PROMPT = 'Reflect on a recent setback or failure. What did it teach you about your own strength?';
const PREVIOUS_RESPONSE = 'I faced a really difficult situation at work. Initially, I felt overwhelmed and unsure how to handle it. It took sometime, but I learned that i have the ability to stay clam and find solutions!';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleDeepen'>;

export const ModuleDeepenScreen: React.FC<Props> = ({ navigation }) => {
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

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.deepenHero}>
              <View style={styles.deepenIconCircle}>
                <Ionicons name="water-outline" size={24} color="#8C6C6C" />
              </View>
              <Text style={styles.deepenTitle}>Deepen</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.promptHighlight}>{PREVIOUS_PROMPT}</Text>
              <Text style={styles.previousResponse}>{PREVIOUS_RESPONSE}</Text>
              <View style={styles.divider} />
              <Text style={styles.followUpText}>
                Think of other ways this situation has brought out your strength in the past. How does it add value to your life?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Start typing..."
                placeholderTextColor={Colors.textPlaceholder}
                multiline
                autoFocus
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Save & Continue" onPress={() => navigation.navigate('ModuleSave')} variant="filled" style={styles.continueBtn} disabled={text.trim().length === 0} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ModuleDeepenScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  headerIcon: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  headerSubtitle: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  scrollContent: { paddingBottom: Spacing.xxl },
  deepenHero: { alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.lg },
  deepenIconCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: '#8C6C6C', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  deepenTitle: { fontFamily: FontFamily.serif, fontSize: 32, fontWeight: '700', color: Colors.textPrimary },
  content: { paddingHorizontal: Spacing.xl },
  promptHighlight: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.lg, lineHeight: 24 },
  previousResponse: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: Spacing.lg },
  followUpText: { ...Typography.body, color: Colors.textPrimary, lineHeight: 24, marginBottom: Spacing.lg },
  input: { minHeight: 120, ...Typography.body, color: Colors.textPrimary, fontSize: 16 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, paddingTop: Spacing.md, backgroundColor: Colors.background },
  continueBtn: { backgroundColor: Colors.primaryDark },
});
