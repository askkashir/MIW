import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import { JournalStackParamList } from '../types';
import JournalProgress from '../components/JournalProgress';

const PREVIOUS_RESPONSE = "Right now, I'm juggling a few deadlines at once and trying not to drop any details. It's mostly.....";

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalDeepen'>;

const JournalDeepenScreen: React.FC<Props> = ({ navigation }) => {
  const [text, setText] = useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <JournalProgress currentStep={2} totalSteps={4} activeColor={Colors.primary} inactiveColor={Colors.dotInactive} />
            <View style={styles.titleContainer}>
              <View style={styles.iconCircle}><Text style={styles.iconText}>💧</Text></View>
              <Text style={[Typography.h1, styles.title]}>Deepen</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={[Typography.body, styles.contextText]}>Based on what you shared here's something to sit with.</Text>
            <Text style={[Typography.body, styles.previousResponse]}>{PREVIOUS_RESPONSE}</Text>
            <View style={styles.promptContainer}>
              <Text style={[Typography.body, styles.promptHighlight]}>You mentioned bordem.</Text>
              <Text style={[Typography.body, styles.promptHighlight]}>What part of that feels hardest to let go of?</Text>
            </View>
            <TextInput style={[Typography.body, styles.input]} placeholder="Start typing..." placeholderTextColor={Colors.textPlaceholder} multiline autoFocus={false} value={text} onChangeText={setText} textAlignVertical="top" />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('JournalReflect')}>
              <Text style={[Typography.button, styles.ctaButtonText]}>Start Writing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={[Typography.button, styles.backButtonText]}>← Back to my first entry</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default JournalDeepenScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  header: { alignItems: 'center', paddingTop: Spacing.lg },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.xs },
  iconCircle: { width: 32, height: 32, borderRadius: Radii.full, backgroundColor: '#F5EBEB', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  title: { color: Colors.black },
  content: { flex: 1, marginTop: Spacing.xl },
  contextText: { color: Colors.textSecondary, fontWeight: '600', marginBottom: Spacing.sm },
  previousResponse: { color: Colors.textPlaceholder, marginBottom: Spacing.lg },
  promptContainer: { marginBottom: Spacing.lg },
  promptHighlight: { fontWeight: '700', color: Colors.black },
  input: { flex: 1, color: Colors.textPrimary },
  footer: { marginTop: 'auto', gap: Spacing.md },
  ctaButton: { backgroundColor: '#8C6C6C', paddingVertical: Spacing.md, borderRadius: Radii.full, alignItems: 'center' },
  ctaButtonText: { color: Colors.white },
  backButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  backButtonText: { color: Colors.textPrimary, fontSize: 14 },
});
