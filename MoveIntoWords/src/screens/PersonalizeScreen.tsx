import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useUserStore } from '../store/useUserStore';

const MODULES = [
  { id: 'love', label: 'Love', icon: 'heart', color: '#D21A5F' },
  { id: 'relationships', label: 'Relationships', icon: 'people', color: '#3A74D4' },
  { id: 'career', label: 'Career', icon: 'briefcase', color: '#D43E3A' },
  { id: 'development', label: 'Development', icon: 'business', color: '#6A87A6' },
  { id: 'finance', label: 'Finance', icon: 'cash', color: '#27AE60' },
  { id: 'wellness', label: 'Wellness', icon: 'star', color: '#F2C94C' },
];

const AGE_RANGES = ['18 – 24', '25 – 29', '30 – 35'];
const GENDERS = ['Man', 'Women', 'Prefer not to say'];

type Props = NativeStackScreenProps<AuthStackParamList, 'Personalize'>;

export const PersonalizeScreen: React.FC<Props> = ({ navigation }) => {
  const { setPreferences } = useUserStore();
  const [selectedAge, setSelectedAge] = useState<string | null>('18 - 24');
  const [selectedGender, setSelectedGender] = useState<string | null>('Women');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    setPreferences({ ageRange: selectedAge, gender: selectedGender, topics: selectedModules });
    navigation.navigate('Ritual');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Personalize Your{'\n'}Space Yourself.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tell us a bit more about yourself.</Text>
          <Text style={styles.cardSubtitle}>Optionally choose to share a bit more about you.</Text>

          <Text style={styles.label}>Age Range</Text>
          <View style={styles.pillRow}>
            {AGE_RANGES.map((age) => {
              const isActive = selectedAge === age;
              return (
                <Pressable key={age} onPress={() => setSelectedAge(age)} style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}>
                  <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>{age}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pillRow}>
            {GENDERS.map((gen) => {
              const isActive = selectedGender === gen;
              return (
                <Pressable key={gen} onPress={() => setSelectedGender(gen)} style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}>
                  <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>{gen}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: FontFamily.serif, fontSize: 18 }]}>Where would you like to begin?</Text>
          <Text style={styles.cardSubtitle}>Select upto 3 to shape up your experience.</Text>

          <View style={styles.modulesGrid}>
            {MODULES.map((mod) => {
              const isActive = selectedModules.includes(mod.id);
              return (
                <Pressable key={mod.id} onPress={() => toggleModule(mod.id)} style={[styles.moduleBtn, isActive && styles.moduleBtnActive]}>
                  <Ionicons name={mod.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={mod.color} />
                  <Text style={styles.moduleText}>{mod.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.showAllBtn}>
            <Text style={styles.showAllText}>Show all 18 modules</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue" onPress={handleContinue} style={styles.continueBtn} />
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PersonalizeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingTop: Spacing.xxl + Spacing.xl },
  title: { ...Typography.h1, textAlign: 'center', marginBottom: Spacing.xxl },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xxs },
  cardSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  label: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  pill: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radii.full, borderWidth: 1 },
  pillActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  pillInactive: { backgroundColor: Colors.white, borderColor: Colors.border },
  pillText: { ...Typography.caption, fontWeight: '600' },
  pillTextActive: { color: Colors.white },
  pillTextInactive: { color: Colors.textPrimary },
  modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, justifyContent: 'space-between' },
  moduleBtn: { flexDirection: 'row', alignItems: 'center', width: '48%', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, marginBottom: Spacing.xs, gap: Spacing.sm },
  moduleBtnActive: { borderColor: Colors.primaryDark, backgroundColor: '#F7EFF1' },
  moduleText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
  showAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, gap: Spacing.xs },
  showAllText: { ...Typography.caption, color: Colors.textPrimary },
  footer: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing.xxl },
  continueBtn: { borderRadius: Radii.full, backgroundColor: Colors.primaryDark, marginBottom: Spacing.lg },
  backBtn: { alignItems: 'center', paddingVertical: Spacing.xs },
  backText: { ...Typography.button, color: Colors.textPrimary },
});
