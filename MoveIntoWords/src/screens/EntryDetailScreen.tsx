import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { JourneyStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<JourneyStackParamList, 'EntryDetail'>;

const formatFullDate = (ts: number): string =>
  new Date(ts).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const EntryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { entryId } = route.params;
  const entry = useJournalStore((s) => s.entries).find((e) => e.id === entryId);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Entry</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Entry not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Entry</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{formatFullDate(entry.createdAt)}</Text>
        <Text style={styles.content}>{entry.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EntryDetailScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  backBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  date: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.lg },
  content: { ...Typography.body, color: Colors.textPrimary, lineHeight: 26 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...Typography.body, color: Colors.textSecondary },
});
