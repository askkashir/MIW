/**
 * JournalCard — displays a single journal entry in the feed.
 *
 * Keeps rendering logic minimal: receives data, formats dates,
 * and delegates all actions back to the parent via callbacks.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import type { JournalEntry } from '../types';

// ── Props ───────────────────────────────────────────────
interface JournalCardProps {
  entry: JournalEntry;
  /** Called when the user taps the card */
  onPress?: (entry: JournalEntry) => void;
}

/** Format a Unix-ms timestamp into a readable date string */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const JournalCard: React.FC<JournalCardProps> = ({ entry, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {/* Content preview — capped at 3 lines */}
      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>

      {/* Date footer */}
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
      </View>
    </Pressable>
  );
};

export default JournalCard;

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    // Subtle shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  footer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
