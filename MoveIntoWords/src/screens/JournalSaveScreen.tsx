import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import { JournalStackParamList } from '../types';
import JournalProgress from '../components/JournalProgress';
import { saveJournalEntry } from '../services/firebase/firestore';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';
import type { JournalEntry } from '../types';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalSave'>;

const JournalSaveScreen: React.FC<Props> = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const uid = useUserStore((s) => s.uid);
  const userDisplayName = useUserStore((s) => s.displayName);
  const { addEntry } = useJournalStore();

  const isFirstEntry = !userDisplayName || userDisplayName === '';

  const handleSave = async () => {
    const { content = '', deepenContent = '', reflectContent = '' } = route.params ?? {};
    const combined = [content, deepenContent, reflectContent].filter(Boolean).join('\n\n');
    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: combined || ' ',
      createdAt: Date.now(),
    };

    setIsSaving(true);
    try {
      if (uid) {
        await saveJournalEntry(uid, entry);
        if (isFirstEntry && firstName.trim()) {
          const { doc, updateDoc } = require('firebase/firestore');
          const { db } = require('../services/firebase/config');
          await updateDoc(doc(db, 'users', uid), { 
            displayName: firstName.trim(),
            onboardingComplete: true // Mark onboarding as complete if they finish this flow
          });
          const userStore = useUserStore.getState();
          userStore.setUser({ 
            uid: userStore.uid!, 
            email: userStore.email!, 
            displayName: firstName.trim() 
          });
          userStore.setOnboardingComplete(true);
        }
      }
      addEntry(entry);
      // Clear draft upon successful save
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('journal_draft').catch(() => {});
    } catch {
      // Fail silently — entry is still in local store
    } finally {
      setIsSaving(false);
    }
    // If it was a modal from MainTabs, just go back
    navigation.getParent()?.goBack();
  };

  const content = (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <JournalProgress currentStep={4} totalSteps={4} activeColor={Colors.journalGreen} inactiveColor={Colors.journalGreenLight} />
          <View style={styles.titleContainer}>
            <View style={styles.iconCircle}><Text style={styles.iconText}>📓</Text></View>
            <Text style={[Typography.h1, styles.title]}>{isFirstEntry ? 'Save' : 'Complete'}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={[Typography.h3, styles.cardTitle]}>
              {isFirstEntry ? 'Your first entry is waiting.' : 'Another step forward.'}
            </Text>
            <Text style={[Typography.body, styles.cardSubtitle]}>
              {isFirstEntry ? "Let's give it a home." : "Your reflection has been captured."}
            </Text>
            
            {isFirstEntry && (
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarCircle}><Text style={styles.avatarIcon}>🌿</Text></View>
                  <View style={styles.cameraIconContainer}><Text style={styles.cameraIcon}>📷</Text></View>
                </View>
                <Text style={[Typography.body, styles.chooseAvatarText]}>Choose an avatar</Text>
              </View>
            )}
          </View>

          {isFirstEntry && (
            <View style={styles.formSection}>
              <Text style={[Typography.h3, styles.formTitle]}>What should we call you?</Text>
              <Text style={[Typography.body, styles.formSubtitle]}>This is how your space will greet you</Text>
              <TextInput 
                style={[Typography.body, styles.input]} 
                placeholder="First Name" 
                placeholderTextColor={Colors.textPlaceholder} 
                value={firstName} 
                onChangeText={setFirstName} 
                autoFocus={true}
              />
            </View>
          )}

          {!isFirstEntry && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>You've successfully completed today's reflection ritual. Great job checking in with yourself.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.ctaButton, isFirstEntry && !firstName.trim() && { opacity: 0.5 }]} 
          onPress={handleSave} 
          disabled={isSaving || (isFirstEntry && !firstName.trim())}
        >
          <Text style={[Typography.button, styles.ctaButtonText]}>
            {isSaving ? 'Saving...' : (isFirstEntry ? 'Begin My Journey' : 'Finish')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[Typography.button, styles.backButtonText]}>← Back</Text>
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
export default JournalSaveScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  header: { alignItems: 'center', paddingTop: Spacing.lg },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.xs },
  iconCircle: { width: 32, height: 32, borderRadius: Radii.full, backgroundColor: Colors.journalGreenLight, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  title: { color: Colors.black },
  content: { flex: 1, marginTop: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.xl, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: Spacing.xl },
  cardTitle: { fontWeight: '700', color: Colors.black, marginBottom: Spacing.xxs },
  cardSubtitle: { color: Colors.textSecondary },
  avatarSection: { alignItems: 'center', marginTop: Spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: Spacing.sm },
  avatarCircle: { width: 88, height: 88, borderRadius: Radii.full, backgroundColor: Colors.journalGreenLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarIcon: { fontSize: 40 },
  cameraIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.textSecondary, width: 28, height: 28, borderRadius: Radii.full, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  cameraIcon: { fontSize: 12, color: Colors.white },
  chooseAvatarText: { fontWeight: '700', color: Colors.black },
  formSection: { marginTop: Spacing.sm, paddingHorizontal: Spacing.xs },
  formTitle: { fontWeight: '700', color: Colors.black, marginBottom: Spacing.xxs },
  formSubtitle: { color: Colors.textSecondary, fontSize: 14, marginBottom: Spacing.md },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, color: Colors.textPrimary },
  summaryBox: { padding: Spacing.lg, backgroundColor: '#F9FBF9', borderRadius: Radii.md, borderWidth: 1, borderColor: '#E8F2E8' },
  summaryText: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: Colors.background, gap: Spacing.md },
  ctaButton: { backgroundColor: Colors.journalGreen, paddingVertical: Spacing.md, borderRadius: Radii.full, alignItems: 'center' },
  ctaButtonText: { color: Colors.white },
  backButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  backButtonText: { color: Colors.textPrimary, fontSize: 14 },
});
