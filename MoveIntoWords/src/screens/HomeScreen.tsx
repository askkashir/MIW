import React from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../constants/Theme';
import Button from '../components/Button';
import JournalCard from '../components/JournalCard';
import type { JournalEntry } from '../types';

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    content:
      'Today I noticed how the sunlight hit the kitchen tiles just right. ' +
      'It reminded me that beauty hides in ordinary moments — you just have to slow down.',
    createdAt: Date.now() - 86_400_000,
  },
  {
    id: '2',
    content:
      'I sat by the window and listened to the rain. Each drop carried a thought I had been avoiding. ' +
      'Writing it down made it feel smaller, more manageable.',
    createdAt: Date.now() - 172_800_000,
  },
  {
    id: '3',
    content:
      'Gratitude list: a warm cup of tea, a phone call with an old friend, ' +
      'the smell of bread baking down the street.',
    createdAt: Date.now() - 259_200_000,
  },
  {
    id: '4',
    content:
      'Sometimes the hardest part is starting. But once I put pen to paper — or fingers to screen — ' +
      'the words find their own way.',
    createdAt: Date.now() - 345_600_000,
  },
];

const HomeScreen: React.FC = () => {
  const handleNewEntry = () => {
    // Navigate to compose screen — wired up when tabs are built
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Move Into Words</Text>
        <Text style={styles.subtitle}>Your journal awaits</Text>
      </View>

      <FlatList
        data={MOCK_ENTRIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JournalCard entry={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <Button label="New Entry" onPress={handleNewEntry} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xxs,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xs,
    backgroundColor: Colors.background,
  },
});
