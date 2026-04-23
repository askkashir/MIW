import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'FontSizeSettings'>;

const STORAGE_KEY = 'font_size';
type FontSizeOption = 'small' | 'medium' | 'large';

const FontSizeSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [size, setSize] = useState<FontSizeOption>('medium');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!isMounted) return;
        if (raw === 'small' || raw === 'medium' || raw === 'large') setSize(raw);
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectSize = async (value: FontSizeOption) => {
    setSize(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const Row = ({ label, value }: { label: string; value: FontSizeOption }) => {
    const isSelected = size === value;
    return (
      <Pressable style={styles.listItem} onPress={() => selectSize(value)}>
        <View style={styles.listIconBox}>
          <Ionicons name="text-outline" size={18} color={Colors.primaryDark} />
        </View>
        <Text style={styles.listText}>{label}</Text>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
          size={18}
          color={isSelected ? Colors.primary : Colors.textSecondary}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Font Size</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Row label="Small" value="small" />
          <View style={styles.divider} />
          <Row label="Medium" value="medium" />
          <View style={styles.divider} />
          <Row label="Large" value="large" />
        </View>
        <Text style={styles.note}>
          Custom font sizes will be applied in a future update.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default FontSizeSettingsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backBtn: { padding: Spacing.xs, marginLeft: -Spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: FontFamily.serif, fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerRight: { width: 32 },

  section: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  listIconBox: { width: 24, alignItems: 'center', marginRight: Spacing.md },
  listText: { ...Typography.body, flex: 1, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  note: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.md, textAlign: 'center' },
});

