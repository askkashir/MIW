import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert, Modal, TextInput as RNTextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { MoreStackParamList, AuthStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps, CommonActions } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import { signOut } from '../services/firebase/auth';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreStackParamList, 'MoreHome'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<AuthStackParamList>
  >
>;

export const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const colors = useThemeColors();
  const theme = useUserStore((state) => state.theme);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { displayName, email } = useUserStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('reduce_motion');
        if (!isMounted) return;
        setReduceMotion(raw === 'true');
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleReduceMotion = async (value: boolean) => {
    setReduceMotion(value);
    try {
      await AsyncStorage.setItem('reduce_motion', value ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const handleSignOut = async () => {
    useJournalStore.getState().clearAll();
    useUserStore.getState().clearUser();
    await signOut();
    // Navigation will be handled by App.tsx auth state listener
  };

  const handleDeleteAccountPress = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all journal entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            setDeleteConfirmText('');
            setDeleteError('');
            setShowDeleteModal(true);
          },
        },
      ],
    );
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE exactly to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const uid = useUserStore.getState().uid;
      const currentUser = auth.currentUser;
      if (!uid || !currentUser) throw new Error('No user found');

      // Delete Firestore data first
      const entriesRef = collection(db, 'journalEntries', uid, 'entries');
      const entriesSnap = await getDocs(entriesRef);
      await Promise.all(entriesSnap.docs.map((d) => deleteDoc(d.ref)));

      const progressRef = collection(db, 'moduleProgress', uid, 'modules');
      const progressSnap = await getDocs(progressRef);
      await Promise.all(progressSnap.docs.map((d) => deleteDoc(d.ref)));

      await deleteDoc(doc(db, 'users', uid));

      // Delete Firebase Auth user
      await deleteUser(currentUser);

      // Clear stores
      useJournalStore.getState().clearAll();
      useUserStore.getState().clearUser();

      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      // App.tsx auth listener will redirect — explicit reset as fallback
      (navigation as any).reset({ index: 0, routes: [{ name: 'SignIn' }] });
    } catch (error: any) {
      setIsDeleting(false);
      if (error?.code === 'auth/requires-recent-login') {
        setDeleteError(
          'For security, Firebase requires a recent login to delete your account. Please sign out, sign back in, then try again immediately.',
        );
      } else {
        setDeleteError('Something went wrong: ' + (error?.message ?? 'Please try again.'));
      }
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true)

      const entries = useJournalStore.getState().entries

      if (entries.length === 0) {
        Alert.alert('No Entries', 'You have no journal entries to export.')
        setIsExporting(false)
        return
      }

      // Build text content
      const content = entries.map(entry => {
        const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        return `${date}\n\n${entry.content}\n\n${'─'.repeat(40)}\n`
      }).join('\n')

      const header = `Move Into Words — Journal Export\nExported on ${new Date().toLocaleDateString()}\nTotal entries: ${entries.length}\n\n${'═'.repeat(40)}\n\n`
      const fullContent = header + content

      // Write file using classic FileSystem API
      const fileUri = (FileSystem.documentDirectory ?? '') + 'MoveIntoWords_Journal.txt';
      await FileSystem.writeAsStringAsync(fileUri, fullContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync()
      if (!isSharingAvailable) {
        Alert.alert('Not Available', 'Sharing is not available on this device.')
        setIsExporting(false)
        return
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Export Journal Entries',
        UTI: 'public.plain-text'
      })

    } catch (error) {
      Alert.alert('Export Failed', 'Something went wrong while exporting. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}><Text style={[styles.headerTitle, { color: colors.textPrimary }]}>More</Text></View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profilePicLg}><Ionicons name="person" size={32} color={colors.white} /></View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.primaryDark }]}>{displayName ?? 'Your Name'}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{email ?? ''}</Text>
          </View>
          <Pressable style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}><Ionicons name="pencil-outline" size={20} color={colors.primaryDark} /></Pressable>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              style={styles.listItem}
              onPress={() => navigation.navigate('ReminderSettings')}
            >
              <View style={styles.listIconBox}><Ionicons name="notifications-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Reminder Notifications</Text>
              <Text style={[styles.listValue, { color: colors.textSecondary }]}>7:00 pm</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              style={styles.listItem}
              onPress={() => navigation.navigate('ThemeSettings')}
            >
              <View style={styles.listIconBox}><Ionicons name="moon-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Theme</Text>
              <Text style={[styles.listValue, { color: colors.textSecondary }]}>{theme === 'dark' ? 'Dark' : 'Light'}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              style={styles.listItem}
              onPress={() => navigation.navigate('FontSizeSettings')}
            >
              <View style={styles.listIconBox}><Ionicons name="text-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Font Size</Text>
              <Text style={[styles.listValue, { color: colors.textSecondary }]}>Large</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.listItem}>
              <View style={styles.listIconBox}><Ionicons name="warning-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Reduce Motion</Text>
              <Switch
                trackColor={{ false: '#E0E0E0', true: colors.primaryDark }}
                thumbColor={colors.white}
                onValueChange={handleToggleReduceMotion}
                value={reduceMotion}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.listItem} onPress={() => navigation.navigate('MemberPerks')}><View style={styles.listIconBox}><Ionicons name="star-outline" size={18} color={colors.primaryDark} /></View><Text style={[styles.listText, { color: colors.textPrimary }]}>Member Perks</Text><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Data</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable style={styles.listItem} onPress={isExporting ? undefined : handleExport}>
              <View style={styles.listIconBox}><Ionicons name="cloud-upload-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Export Entries</Text>
              {isExporting ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="chevron-forward" size={20} color={colors.textPlaceholder} />}
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.listItem} onPress={handleDeleteAccountPress}><View style={styles.listIconBox}><Ionicons name="trash-outline" size={18} color={colors.primaryDark} /></View><Text style={[styles.listText, { color: colors.textPrimary }]}>Delete Account</Text><Ionicons name="chevron-forward" size={20} color={colors.textPlaceholder} /></Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              style={styles.listItem}
              onPress={() => navigation.navigate('Help')}
            >
              <View style={styles.listIconBox}><Ionicons name="help-buoy-outline" size={18} color={colors.primaryDark} /></View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Help</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.listItem} onPress={() => Alert.alert('Feedback', 'Email us at feedback@moveintowords.org')}><View style={styles.listIconBox}><Ionicons name="chatbubble-outline" size={18} color={colors.primaryDark} /></View><Text style={[styles.listText, { color: colors.textPrimary }]}>Feedback</Text><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.listItem} onPress={() => navigation.navigate('CrisisResources')}><View style={styles.listIconBox}><Ionicons name="heart-outline" size={18} color={colors.primaryDark} /></View><Text style={[styles.listText, { color: colors.textPrimary }]}>Crisis Resources</Text><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.listItem} onPress={() => Alert.alert('Report an Issue', 'Email us at support@moveintowords.org')}><View style={styles.listIconBox}><Ionicons name="flag-outline" size={18} color={colors.primaryDark} /></View><Text style={[styles.listText, { color: colors.textPrimary }]}>Report</Text><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable style={styles.signOutItem} onPress={handleSignOut}>
              <View style={styles.listIconBox}><Ionicons name="log-out-outline" size={18} color={colors.error} /></View>
              <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm Deletion</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Type DELETE to confirm you want to permanently delete your account.</Text>
            <RNTextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Type DELETE"
              placeholderTextColor={colors.textPlaceholder}
              value={deleteConfirmText}
              onChangeText={(text) => { setDeleteConfirmText(text); setDeleteError(''); }}
              autoCapitalize="characters"
            />
            {deleteError ? (
              <Text style={styles.modalErrorText}>{deleteError}</Text>
            ) : null}
            <View style={styles.modalBtnRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                style={[
                  styles.modalDeleteBtn,
                  isDeleting && styles.modalDeleteBtnDisabled,
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default MoreScreen;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxl },
  profilePicLg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.lg },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.primaryDark, marginBottom: 4 },
  profileEmail: { ...Typography.caption, color: Colors.textSecondary },
  editBtn: { padding: Spacing.sm },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: Radii.lg, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  listIconBox: { width: 24, alignItems: 'center', marginRight: Spacing.md },
  listText: { ...Typography.body, flex: 1, color: Colors.textPrimary },
  listValue: { ...Typography.caption, color: Colors.textSecondary, marginRight: Spacing.sm },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },
  signOutItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  signOutText: { ...Typography.body, color: Colors.error, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  modalContent: { backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing.xl, width: '100%' },
  modalTitle: { fontFamily: FontFamily.serif, fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  modalSubtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },
  modalInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.sm, paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, ...Typography.body, color: Colors.textPrimary, marginBottom: Spacing.lg },
  modalErrorText: { ...Typography.caption, color: Colors.error, marginBottom: Spacing.sm },
  modalBtnRow: { flexDirection: 'row', gap: Spacing.md },
  modalCancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { ...Typography.button, color: Colors.textPrimary },
  modalDeleteBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.full, backgroundColor: Colors.error, alignItems: 'center' },
  modalDeleteBtnDisabled: { opacity: 0.4 },
  modalDeleteText: { ...Typography.button, color: Colors.white },
});
