import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useUserStore } from '../store/useUserStore';
import { createUserProfile } from '../services/firebase/firestore';
import { getCurrentUser } from '../services/firebase/auth';

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', sublabel: '(before 10am)', icon: 'cloud',  bgColor: Colors.primaryDark, textColor: Colors.white, iconColor: Colors.white },
  { id: 'midday',  label: 'Midday',  sublabel: '(10am – 3pm)',  icon: 'sunny', bgColor: '#EAE1F3', textColor: Colors.textPrimary, iconColor: '#4A3B74' },
  { id: 'evening', label: 'Evening', sublabel: '(3pm – 7pm)',   icon: 'cafe',  bgColor: '#E4F0F2', textColor: Colors.textPrimary, iconColor: '#366F7C' },
  { id: 'night',   label: 'Night',   sublabel: '(after 7pm)',   icon: 'moon',  bgColor: '#F2EFE1', textColor: Colors.textPrimary, iconColor: '#7A6229' },
] as const;

type Props = NativeStackScreenProps<AuthStackParamList, 'Ritual'>;

export const RitualScreen: React.FC<Props> = ({ navigation }) => {
  const { setRitual, preferences, displayName, email, uid } = useUserStore();
  const [selectedTime, setSelectedTime] = useState('morning');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setRitual({ timeOfDay: selectedTime, remindersEnabled });

    const firebaseUid = uid ?? getCurrentUser()?.uid;
    if (!firebaseUid) {
      navigation.navigate('FirstPrompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await createUserProfile(firebaseUid, {
        displayName: displayName ?? '',
        email: email ?? '',
        demographics: {
          ageRange: preferences.ageRange,
          gender: preferences.gender,
        },
        preferences: preferences.topics,
        ritual: { timeOfDay: selectedTime, remindersEnabled },
        onboardingComplete: false,
      });
      navigation.navigate('FirstPrompt');
    } catch {
      setError('Could not save your profile. You can continue anyway.');
      navigation.navigate('FirstPrompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{'Build Your\nRitual.'}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>The best time to actually reflect is the one you'll actually keep.</Text>
          <Text style={styles.cardSubtitle}>When feels right?</Text>

          <View style={styles.slotsContainer}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  onPress={() => setSelectedTime(slot.id)}
                  style={[
                    styles.slotBtn,
                    { backgroundColor: isSelected ? Colors.primaryDark : slot.bgColor },
                    !isSelected && slot.id === 'morning' && { backgroundColor: '#F0F0F0' },
                  ]}
                >
                  <Ionicons
                    name={slot.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={20}
                    color={isSelected ? Colors.white : slot.iconColor}
                    style={styles.slotIcon}
                  />
                  <Text style={[styles.slotLabel, { color: isSelected ? Colors.white : slot.textColor }]}>
                    {slot.label} <Text style={styles.slotSublabel}>{slot.sublabel}</Text>
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setSelectedTime('custom')}
              style={[styles.slotBtn, styles.customSlot, selectedTime === 'custom' && { borderColor: Colors.primaryDark }]}
            >
              <Ionicons name="time" size={20} color={Colors.primaryDark} style={styles.slotIcon} />
              <Text style={styles.slotLabel}>Pick a specific time</Text>
              <Ionicons name="chevron-down" size={18} color={Colors.textPrimary} style={{ marginLeft: 'auto' }} />
            </Pressable>
          </View>

          <Pressable style={styles.checkboxContainer} onPress={() => setRemindersEnabled(!remindersEnabled)}>
            <View style={[styles.checkbox, remindersEnabled && styles.checkboxActive]}>
              {remindersEnabled && <Ionicons name="checkmark" size={14} color={Colors.textPrimary} />}
            </View>
            <Text style={styles.checkboxLabel}>Get Priority Reminders Daily?</Text>
          </Pressable>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isLoading ? 'Saving...' : 'Skip for now'}
          onPress={handleContinue}
          style={styles.continueBtn}
        />
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default RitualScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingTop: Spacing.xxl + Spacing.xl },
  title: { ...Typography.h1, textAlign: 'center', marginBottom: Spacing.xxl },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, lineHeight: 24 },
  cardSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  slotsContainer: { gap: Spacing.sm },
  slotBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radii.full },
  customSlot: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  slotIcon: { marginRight: Spacing.sm },
  slotLabel: { ...Typography.button, fontSize: 15 },
  slotSublabel: { ...Typography.caption, fontWeight: '400' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl, gap: Spacing.xs },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.white, borderColor: Colors.textPrimary },
  checkboxLabel: { ...Typography.caption, color: Colors.textSecondary },
  errorText: { ...Typography.caption, color: Colors.error, textAlign: 'center', marginTop: Spacing.sm },
  footer: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, paddingBottom: Spacing.xxl },
  continueBtn: { borderRadius: Radii.full, backgroundColor: Colors.primaryDark, marginBottom: Spacing.lg },
  backBtn: { alignItems: 'center', paddingVertical: Spacing.xs },
  backText: { ...Typography.button, color: Colors.textPrimary },
});
