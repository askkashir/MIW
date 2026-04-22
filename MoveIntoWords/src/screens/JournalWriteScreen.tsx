import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import { JournalStackParamList } from '../types';
import JournalProgress from '../components/JournalProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = 'journal_draft';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalWrite'>;

const JournalWriteScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore draft on mount
  useEffect(() => {
    AsyncStorage.getItem(DRAFT_KEY).then((saved) => {
      if (saved) setText(saved);
    });
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      AsyncStorage.setItem(DRAFT_KEY, text);
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      AsyncStorage.removeItem(DRAFT_KEY);
    };
  }, [text]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <JournalProgress currentStep={1} totalSteps={4} activeColor={Colors.primary} inactiveColor={Colors.dotInactive} />
            <TouchableOpacity style={styles.crisisLink} onPress={() => (navigation as any).navigate('CrisisResources')}>
              <Text style={styles.crisisText}>Crisis Resources</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <View style={styles.iconCircle}><Text style={styles.iconText}>✍️</Text></View>
              <Text style={[Typography.h1, styles.title]}>Write</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={[Typography.body, styles.prompt]}>What's taking up the most mental space for you right now?</Text>
            <TextInput style={[Typography.body, styles.input]} placeholder="Start typing..." placeholderTextColor={Colors.textPlaceholder} multiline autoFocus={false} value={text} onChangeText={setText} textAlignVertical="top" />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('JournalDeepen', { content: text })}>
              <Text style={[Typography.button, styles.ctaButtonText]}>Start Writing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
              <Text style={[Typography.button, styles.skipButtonText]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default JournalWriteScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  header: { alignItems: 'center', paddingTop: Spacing.lg },
  crisisLink: { alignSelf: 'flex-end', marginTop: Spacing.xs },
  crisisText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 11 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.xs },
  iconCircle: { width: 32, height: 32, borderRadius: Radii.full, backgroundColor: '#F5EBEB', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  title: { color: Colors.black },
  content: { flex: 1, marginTop: Spacing.xl },
  prompt: { fontWeight: '700', color: Colors.black, marginBottom: Spacing.lg },
  input: { flex: 1, color: Colors.textPrimary },
  footer: { marginTop: 'auto', gap: Spacing.md },
  ctaButton: { backgroundColor: Colors.primaryDark, paddingVertical: Spacing.md, borderRadius: Radii.full, alignItems: 'center' },
  ctaButtonText: { color: Colors.white },
  skipButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  skipButtonText: { color: Colors.textSecondary, fontSize: 14 },
});
