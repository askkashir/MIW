import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radii, FontFamily, ThemeName } from '../constants/Theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { useUserStore } from '../store/useUserStore';
import { MoreStackParamList } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'ThemeSettings'>;

const STORAGE_KEY = 'app_theme';

const ThemeSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const colors = useThemeColors();
  const theme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!isMounted) return;
        if (raw === 'dark' || raw === 'light') setTheme(raw);
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectTheme = async (value: ThemeName) => {
    setTheme(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const Row = ({ label, value }: { label: string; value: ThemeName }) => {
    const isSelected = theme === value;
    return (
      <Pressable style={styles.listItem} onPress={() => selectTheme(value)}>
        <View style={styles.listIconBox}>
          <Ionicons name={value === 'dark' ? 'moon-outline' : 'sunny-outline'} size={18} color={colors.primaryDark} />
        </View>
        <Text style={[styles.listText, { color: colors.textPrimary }]}>{label}</Text>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
          size={18}
          color={isSelected ? colors.primary : colors.textSecondary}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Theme</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Row label="Light" value="light" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Dark" value="dark" />
        </View>
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Your theme preference is saved on this device.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ThemeSettingsScreen;

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
