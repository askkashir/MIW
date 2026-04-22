import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MoreStackParamList, 'CrisisResources'>;

const RESOURCES = [
  { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988 (US)', url: 'tel:988', icon: 'call' as const },
  { name: 'Crisis Text Line', contact: 'Text HOME to 741741', url: 'sms:741741?body=HOME', icon: 'chatbubble-ellipses' as const },
  { name: 'IASP Crisis Centres', contact: 'International directory', url: 'https://www.iasp.info/resources/Crisis_Centres/', icon: 'globe' as const },
  { name: 'SAMHSA Helpline', contact: '1-800-662-4357', url: 'tel:18006624357', icon: 'medkit' as const },
];

const CrisisResourcesScreen: React.FC<Props> = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.headerTitle}>Crisis Resources</Text>
      <View style={{ width: 40 }} />
    </View>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.intro}>If you or someone you know is in crisis, please reach out. You are not alone.</Text>
      {RESOURCES.map((r) => (
        <Pressable key={r.name} style={styles.card} onPress={() => Linking.openURL(r.url)}>
          <View style={styles.iconBox}>
            <Ionicons name={r.icon} size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{r.name}</Text>
            <Text style={styles.cardContact}>{r.contact}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={Colors.textSecondary} />
        </Pressable>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default CrisisResourcesScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  backBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  intro: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxl, lineHeight: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: Spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: Radii.sm, backgroundColor: '#F9F5F5', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  cardContact: { ...Typography.caption, color: Colors.textSecondary },
});
