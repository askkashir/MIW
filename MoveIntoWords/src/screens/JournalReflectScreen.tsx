import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import { JournalStackParamList } from '../types';
import JournalProgress from '../components/JournalProgress';

const TONES = ['Clarity', 'Comfort', 'Insight', 'Calm'];
const JOURNAL_ENTRY = "Right now, I'm juggling a few deadlines at once and trying not to drop any details, which takes up most of my mental space. The constant context switching makes it harder to stay grounded, and that's where boredom creeps in. The hardest part to let go of is the quiet, empty stretches where nothing feels engaging and my mind starts spiraling.";

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalReflect'>;

const JournalReflectScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedTone, setSelectedTone] = useState('Clarity');
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <JournalProgress currentStep={3} totalSteps={4} activeColor={Colors.journalBlue} inactiveColor={Colors.journalBlueLight} />
          <TouchableOpacity style={styles.crisisLink} onPress={() => (navigation as any).navigate('CrisisResources')}>
            <Text style={styles.crisisLinkText}>Crisis Resources</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={styles.iconCircle}><Text style={styles.iconText}>🧭</Text></View>
            <Text style={[Typography.h1, styles.title]}>Reflect</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[Typography.h2, styles.heroTitle]}>You just did something for you.</Text>
          <Text style={[Typography.body, styles.heroSubtitle]}>What you wrote holds more than you think.</Text>
          <View style={styles.card}>
            <Text style={[Typography.h3, styles.cardTitle]}>Entry 1</Text>
            <Text style={[Typography.caption, styles.cardDate]}>Today · 7:50 PM</Text>
            <Text style={[Typography.body, styles.cardBody]} numberOfLines={6}>{JOURNAL_ENTRY}</Text>
            <TouchableOpacity hitSlop={10}><Text style={styles.readMoreText}>Read more</Text></TouchableOpacity>
          </View>
          <View style={styles.toneSection}>
            <Text style={[Typography.h3, styles.toneTitle]}>Choose a reflection tone</Text>
            <Text style={[Typography.body, styles.toneSubtitle]}>Based on what you shared here's something to sit with.</Text>
            <View style={styles.chipsContainer}>
              {TONES.map((tone) => {
                const isActive = selectedTone === tone;
                return (
                  <TouchableOpacity key={tone} style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]} onPress={() => setSelectedTone(tone)}>
                    <Text style={[Typography.body, isActive ? styles.chipTextActive : styles.chipTextInactive]}>{tone}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('JournalSave', { content: route.params?.content, deepenContent: route.params?.deepenContent, reflectContent: selectedTone })}>
          <Text style={[Typography.button, styles.ctaButtonText]}>Save & Create My Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('JournalSave', { content: route.params?.content, deepenContent: route.params?.deepenContent })}>
          <Text style={[Typography.button, styles.skipButtonText]}>Save & Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default JournalReflectScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  header: { alignItems: 'center', paddingTop: Spacing.lg },
  crisisLink: { alignSelf: 'flex-end', marginTop: Spacing.xs },
  crisisLinkText: { ...Typography.caption, color: Colors.textSecondary, fontSize: 11 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.xs },
  iconCircle: { width: 32, height: 32, borderRadius: Radii.full, backgroundColor: Colors.journalBlueLight, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  title: { color: Colors.black },
  content: { flex: 1, marginTop: Spacing.xl },
  heroTitle: { fontWeight: '700', color: Colors.black },
  heroSubtitle: { color: Colors.textSecondary, marginBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.lg, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: Spacing.xl },
  cardTitle: { fontWeight: '700', color: Colors.black },
  cardDate: { color: Colors.textSecondary, marginBottom: Spacing.md },
  cardBody: { color: Colors.textPrimary },
  readMoreText: { color: Colors.journalBlue, marginTop: Spacing.xs, alignSelf: 'flex-end', fontWeight: '600' },
  toneSection: { marginTop: Spacing.sm },
  toneTitle: { fontWeight: '700', color: Colors.black, marginBottom: Spacing.xxs },
  toneSubtitle: { color: Colors.textSecondary, fontSize: 14, marginBottom: Spacing.md },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1 },
  chipActive: { backgroundColor: Colors.journalBlue, borderColor: Colors.journalBlue },
  chipInactive: { backgroundColor: 'transparent', borderColor: Colors.border },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  chipTextInactive: { color: Colors.textPrimary },
  footer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: Colors.background, gap: Spacing.md },
  ctaButton: { backgroundColor: Colors.journalBlue, paddingVertical: Spacing.md, borderRadius: Radii.full, alignItems: 'center' },
  ctaButtonText: { color: Colors.white },
  skipButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  skipButtonText: { color: Colors.textPrimary, fontSize: 14 },
});
