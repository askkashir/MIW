import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHome'>;

export const MoreScreen: React.FC<Props> = ({ navigation }) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.headerTitle}>More</Text></View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profilePicLg}><Ionicons name="person" size={32} color={Colors.white} /></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Evans</Text>
            <Text style={styles.profileEmail}>alex@example.com</Text>
          </View>
          <Pressable style={styles.editBtn}><Ionicons name="pencil-outline" size={20} color={Colors.primaryDark} /></Pressable>
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
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="cloud-upload-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Export Entries</Text><Ionicons name="chevron-forward" size={20} color={Colors.textPlaceholder} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="trash-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Delete Account</Text><Ionicons name="chevron-forward" size={20} color={Colors.textPlaceholder} /></Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="help-buoy-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Help</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="chatbubble-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Feedback</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listItem}><View style={styles.listIconBox}><Ionicons name="flag-outline" size={18} color={Colors.primaryDark} /></View><Text style={styles.listText}>Report</Text><Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} /></Pressable>
          </View>
        </View>
      </ScrollView>
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
});
