import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { JourneyStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useJournalStore } from '../store/useJournalStore';

type Props = NativeStackScreenProps<JourneyStackParamList, 'EntryArchive'>;

const formatDate = (ts: number): string =>
  new Date(ts).toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const wordCount = (content: string): number =>
  content.split(/\s+/).filter(Boolean).length;

/**
 * If the entry was created by a module completion its content starts with
 * "[Module Title]" — extract and return the name, otherwise return null.
 */
const extractModuleName = (content: string): string | null => {
  if (!content.startsWith('[')) return null;
  const end = content.indexOf(']');
  if (end === -1) return null;
  return content.slice(1, end);
};

export const EntryArchiveScreen: React.FC<Props> = ({ navigation }) => {
  const entries = useJournalStore((s) => s.entries);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Entry Archive</Text>
        <View style={styles.profilePic}>
          <Ionicons name="person" size={20} color={Colors.white} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filters row — kept as UI, count derived from real data */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          <Pressable style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>All ({entries.length})</Text>
          </Pressable>
        </ScrollView>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtitle}>Your journal entries will appear here once you start writing.</Text>
          </View>
        ) : (
          <View style={styles.groupSection}>
            <Text style={styles.groupTitle}>All Entries</Text>
            <Text style={styles.groupSubtitle}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved</Text>
            <View style={styles.entryList}>
              {entries.map((entry) => {
                const preview = entry.content.trim().slice(0, 100);
                const words = wordCount(entry.content);
                const moduleName = extractModuleName(entry.content);
                return (
                  <Pressable key={entry.id} style={styles.entryCard} onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}>
                    <View style={styles.entryIconBox}>
                      <Ionicons name={moduleName ? 'layers' : 'flash'} size={16} color="#F2C94C" />
                    </View>
                    <View style={styles.entryContent}>
                      <Text style={styles.entryTitle}>{formatDate(entry.createdAt)}</Text>
                      {moduleName && (
                        <View style={styles.moduleTag}>
                          <Text style={styles.moduleTagText}>{moduleName}</Text>
                        </View>
                      )}
                      <Text style={styles.entryPreview} numberOfLines={3}>
                        {preview}{entry.content.length > 100 ? '...' : ''}
                      </Text>
                      <Text style={styles.entryMeta}>• {words} {words === 1 ? 'word' : 'words'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EntryArchiveScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  headerBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  headerTitle: { fontFamily: FontFamily.serif, fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8FAABC', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 40 },
  filtersContainer: { marginBottom: Spacing.xxl },
  filtersContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingVertical: Spacing.xs },
  filterPill: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  filterPillActive: { backgroundColor: '#731C32', borderColor: '#731C32' },
  filterText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl * 2, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontFamily: FontFamily.serif, fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  groupSection: { paddingHorizontal: Spacing.xl },
  groupTitle: { fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  groupSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.lg },
  entryList: { gap: Spacing.md },
  entryCard: { flexDirection: 'row', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1, alignItems: 'center' },
  entryIconBox: { alignSelf: 'flex-start', marginTop: 4, marginRight: Spacing.md },
  entryContent: { flex: 1, paddingRight: Spacing.sm },
  entryTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  entryPreview: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18, marginBottom: Spacing.sm },
  entryMeta: { ...Typography.caption, fontSize: 11, color: Colors.textSecondary },
  moduleTag: { alignSelf: 'flex-start', backgroundColor: Colors.primary, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: Radii.full, marginBottom: Spacing.xs },
  moduleTagText: { ...Typography.caption, fontSize: 10, color: Colors.white, fontWeight: '700' },
});
