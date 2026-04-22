import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert, Modal, TextInput as RNTextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList, AuthStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps, CommonActions } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import { signOut } from '../services/firebase/auth';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore } from '../store/useJournalStore';
import { getAuth, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreStackParamList, 'MoreHome'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<AuthStackParamList>
  >
>;

export const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const { displayName, email } = useUserStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSignOut = async () => {
    useJournalStore.getState().clearAll();
    useUserStore.getState().clearUser();
    await signOut();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'SignIn' }] }),
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all journal entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', style: 'destructive', onPress: () => setDeleteModalVisible(true) },
      ],
    );
  };

  const confirmDelete = async () => {
    if (deleteText !== 'DELETE') return;
    setIsDeleting(true);
    try {
      const uid = useUserStore.getState().uid;
      if (!uid) throw new Error('Not signed in');

      // Delete journal entries subcollection
      const entriesSnap = await getDocs(collection(db, 'journalEntries', uid, 'entries'));
      for (const d of entriesSnap.docs) { await deleteDoc(d.ref); }

      // Delete module progress subcollection
      const progressSnap = await getDocs(collection(db, 'moduleProgress', uid, 'modules'));
      for (const d of progressSnap.docs) { await deleteDoc(d.ref); }

      // Delete user profile document
      await deleteDoc(doc(db, 'users', uid));

      // Delete Firebase Auth user
      const auth = getAuth();
      if (auth.currentUser) await deleteUser(auth.currentUser);

      // Clear local state
      useJournalStore.getState().clearAll();
      useUserStore.getState().clearUser();

      setDeleteModalVisible(false);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'SignIn' }] }),
      );
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const entries = useJournalStore.getState().entries;
      if (entries.length === 0) {
        Alert.alert('No Entries', 'You don\'t have any journal entries to export.');
        return;
      }
      const content = entries.map((e) => {
        const date = new Date(e.createdAt).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        return `[Date: ${date}]\n${e.content}\n---`;
      }).join('\n\n');

      const file = new File(Paths.document, 'journal_export.txt');
      file.write(content);
      await Sharing.shareAsync(file.uri);
    } catch (err: any) {
      Alert.alert('Export Error', err?.message ?? 'Failed to export entries.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.headerTitle}>More</Text></View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profilePicLg}><Ionicons name="person" size={32} color={Colors.white} /></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName ?? 'Your Name'}</Text>
            <Text style={styles.profileEmail}>{email ?? ''}</Text>
          </View>
          <Pressable style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}><Ionicons name="pencil-outline" size={20} color={Colors.primaryDark} /></Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="notifications-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Reminder Notifications</Text><Text style={styles.listValue}>7:00 pm</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="moon-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Theme</Text><Text style={styles.listValue}>Dark</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="text-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Font Size</Text><Text style={styles.listValue}>Large</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <View style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="warning-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Reduce Motion</Text><Switch trackColor={{ false: '#E0E0E0', true: Colors.primaryDark }} thumbColor={Colors.white} onValueChange={setReduceMotion} value={reduceMotion} /></View>
            <View style={styles.divider} />
            <Pressable style={styles.listItem} onPress={() => navigation.navigate('MemberPerks')}><View style={styles.listIconBox}><Ionicons name="star-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Member Perks</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Data</Text>
          <View style={styles.card}>
            <Pressable style={styles.listItem} onPress={handleExport}>
              <View style={styles.listIconBox}><Ionicons name="cloud-upload-outline" size={18} color={Colors.primaryDark} /></View>
              <Text style={styles.listText}>Export Entries</Text>
              {isExporting ? <ActivityIndicator size="small" color={Colors.primaryDark} /> : <Ionicons name="chevron-forward" size={20} color={Colors.textPlaceholder} />}
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem} onPress={handleDeleteAccount}><View style={styles.listIconBox}><Ionicons name="trash-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Delete Account</Text><Ionicons name="chevron-forward" size={20} color={Colors.textPlaceholder} /></Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="help-buoy-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Help</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="chatbubble-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Feedback</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem} onPress={() => navigation.navigate('CrisisResources')}><View style={styles.listIconBox}><Ionicons name="heart-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Crisis Resources</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="flag-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Report</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Pressable style={styles.signOutItem} onPress={handleSignOut}>
              <View style={styles.listIconBox}><Ionicons name="log-out-outline" size={18} color={Colors.error} /></View>
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalSubtitle}>Type DELETE to confirm account deletion.</Text>
            <RNTextInput
              style={styles.modalInput}
              placeholder="Type DELETE"
              placeholderTextColor={Colors.textPlaceholder}
              value={deleteText}
              onChangeText={setDeleteText}
              autoCapitalize="characters"
            />
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalCancelBtn} onPress={() => { setDeleteModalVisible(false); setDeleteText(''); }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalDeleteBtn, deleteText !== 'DELETE' && styles.modalDeleteBtnDisabled]} onPress={confirmDelete} disabled={deleteText !== 'DELETE' || isDeleting}>
                <Text style={styles.modalDeleteText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
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
  modalBtnRow: { flexDirection: 'row', gap: Spacing.md },
  modalCancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { ...Typography.button, color: Colors.textPrimary },
  modalDeleteBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.full, backgroundColor: Colors.error, alignItems: 'center' },
  modalDeleteBtnDisabled: { opacity: 0.4 },
  modalDeleteText: { ...Typography.button, color: Colors.white },
});
