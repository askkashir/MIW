import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/useUserStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

type Props = NativeStackScreenProps<MoreStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { uid, displayName, email } = useUserStore();
  const [name, setName] = useState(displayName ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) { setError('Name cannot be empty'); return; }
    if (!uid) { setError('Not signed in'); return; }
    setError(null);
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), { displayName: name.trim() });
      const current = useUserStore.getState();
      useUserStore.getState().setUser({
        uid: current.uid ?? uid,
        displayName: name.trim(),
        email: current.email ?? email ?? '',
      });
      navigation.goBack();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailText}>{email ?? ''}</Text>
        </View>

        <Button
          label={isLoading ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          disabled={isLoading}
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  backBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs, marginBottom: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  title: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  avatarRow: { alignItems: 'center', marginBottom: Spacing.xxl },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  errorText: { ...Typography.caption, color: Colors.error, textAlign: 'center', marginBottom: Spacing.md },
  form: { marginBottom: Spacing.lg },
  label: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs },
  emailText: { ...Typography.body, color: Colors.textSecondary, paddingVertical: Spacing.md },
  saveBtn: { backgroundColor: Colors.primaryDark, borderRadius: Radii.full, marginTop: Spacing.lg },
});
