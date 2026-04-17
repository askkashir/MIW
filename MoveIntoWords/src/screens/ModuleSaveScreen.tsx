import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { ModulesStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ModulesStackParamList, 'ModuleSave'>;

export const ModuleSaveScreen: React.FC<Props> = ({ navigation }) => {
  const [actionText, setActionText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <View style={styles.streakBadge}>
              <Ionicons name="gift" size={16} color={Colors.white} />
              <Text style={styles.streakText}>150</Text>
            </View>
            <View style={styles.profilePic}>
              <Ionicons name="person" size={20} color={Colors.white} />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#27AE60" />
              </View>
              <Text style={styles.heroTitle}>Entry Saved</Text>
              <Text style={styles.heroSubtitle}>Great job, Alex. Keep up the momentum!</Text>
            </View>

            <View style={styles.entriesList}>
              <View style={styles.entryCard}>
                <View style={styles.pillLatest}><Text style={styles.pillTextWhite}>Latest</Text></View>
                <Text style={styles.entryText}>I faced a really difficult situation at work. Initially, I felt overwhelmed and unsure how to handle it. It took sometime....</Text>
                <View style={styles.entryFooter}>
                  <Text style={styles.entryMeta}>• 137 words • 16 min</Text>
                  <TouchableOpacity style={styles.readMoreBtn}>
                    <Text style={styles.readMoreText}>Read your full entry</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.entryCard}>
                <View style={styles.pillOld}><Text style={styles.pillTextWhite}>2 Days Ago</Text></View>
                <Text style={styles.entryText}>I faced a really difficult situation at work. Initially, I felt overwhelmed and unsure how to handle it. It took sometime....</Text>
                <View style={styles.entryFooter}>
                  <Text style={styles.entryMeta}>• 137 words • 16 min</Text>
                  <TouchableOpacity style={styles.readMoreBtn}>
                    <Text style={styles.readMoreText}>Read your full entry</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.actionSection}>
              <Text style={styles.actionTitle}>What is one small action you can take to apply what you wrote?</Text>
              <Text style={styles.actionSubtitle}>Turn your reflection into one simple, meaningful next step.</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Enter your action" placeholderTextColor={Colors.textPlaceholder} value={actionText} onChangeText={setActionText} maxLength={64} />
                <Text style={styles.charCount}>{actionText.length}/64</Text>
              </View>
              <TouchableOpacity style={styles.homeLink} onPress={() => navigation.navigate('ModulesHome')}>
                <Text style={styles.homeLinkText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ModuleSaveScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryDark, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radii.sm, gap: Spacing.xs },
  streakText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  hero: { alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  successIconCircle: { marginBottom: Spacing.sm },
  heroTitle: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  heroSubtitle: { ...Typography.body, color: Colors.textSecondary },
  entriesList: { gap: Spacing.lg, marginBottom: Spacing.xxl },
  entryCard: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  pillLatest: { backgroundColor: '#8C6C6C', alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radii.sm, marginBottom: Spacing.sm },
  pillOld: { backgroundColor: '#A08080', alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radii.sm, marginBottom: Spacing.sm },
  pillTextWhite: { ...Typography.caption, fontSize: 10, color: Colors.white, fontWeight: '700' },
  entryText: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.md },
  entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryMeta: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  readMoreText: { ...Typography.caption, fontSize: 12, color: Colors.textSecondary },
  actionSection: { backgroundColor: Colors.white, padding: Spacing.xl, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  actionTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  actionSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg, lineHeight: 18 },
  inputContainer: { position: 'relative', marginBottom: Spacing.xl },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, padding: Spacing.md, ...Typography.body, color: Colors.textPrimary },
  charCount: { position: 'absolute', right: Spacing.md, bottom: Spacing.md, ...Typography.caption, fontSize: 12, color: Colors.textPlaceholder },
  homeLink: { alignItems: 'center', paddingVertical: Spacing.sm },
  homeLinkText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
});
