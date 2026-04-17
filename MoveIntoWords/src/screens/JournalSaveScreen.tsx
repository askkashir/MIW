import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import JournalProgress from '../components/JournalProgress';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const JournalSaveScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [firstName, setFirstName] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Header portion */}
            <View style={styles.header}>
              <JournalProgress
                currentStep={4}
                totalSteps={4}
                activeColor={Colors.journalGreen}
                inactiveColor={Colors.journalGreenLight}
              />
              <View style={styles.titleContainer}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>📓</Text>
                </View>
                <Text style={[Typography.h1, styles.title]}>Save</Text>
              </View>
            </View>

            {/* Content portion */}
            <View style={styles.content}>
              
              {/* Profile Card */}
              <View style={styles.card}>
                <Text style={[Typography.h3, styles.cardTitle]}>Your first entry is waiting.</Text>
                <Text style={[Typography.body, styles.cardSubtitle]}>Let's give it a home.</Text>
                
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarIcon}>🌿</Text>
                    </View>
                    <View style={styles.cameraIconContainer}>
                      <Text style={styles.cameraIcon}>📷</Text>
                    </View>
                  </View>
                  <Text style={[Typography.body, styles.chooseAvatarText]}>Choose an avatar</Text>
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <Text style={[Typography.h3, styles.formTitle]}>What should we call you?</Text>
                <Text style={[Typography.body, styles.formSubtitle]}>
                  This is how your space will greet you
                </Text>
                <TextInput
                  style={[Typography.body, styles.input]}
                  placeholder="First Name"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

            </View>
          </ScrollView>

          {/* Footer portion - Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.ctaButton} onPress={onNext}>
              <Text style={[Typography.button, styles.ctaButtonText]}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={[Typography.button, styles.backButtonText]}>← Back</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default JournalSaveScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: Colors.journalGreenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  title: {
    color: Colors.black,
  },
  content: {
    flex: 1,
    marginTop: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xxs,
  },
  cardSubtitle: {
    color: Colors.textSecondary,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: Radii.full,
    backgroundColor: Colors.journalGreenLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    // Soft inner shadow effect could use elevation/shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarIcon: {
    fontSize: 40,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.textSecondary, // usually grey or offblack
    width: 28,
    height: 28,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cameraIcon: {
    fontSize: 12,
    color: Colors.white,
  },
  chooseAvatarText: {
    fontWeight: '700',
    color: Colors.black,
  },
  formSection: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs, // Slight padding to match styling visually
  },
  formTitle: {
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xxs,
  },
  formSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2, // Slight height tweak
    color: Colors.textPrimary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  ctaButton: {
    backgroundColor: Colors.journalGreen,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: Colors.white,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
});
