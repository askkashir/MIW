import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { MoreStackParamList } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'ReminderSettings'>;

const STORAGE_KEYS = {
  enabled: 'reminder_enabled',
  time: 'reminder_time',
} as const;

const TIME_OPTIONS = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '12:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
] as const;

const DEFAULT_TIME = '7:00 PM';

const ReminderSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState<string>(DEFAULT_TIME);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [rawEnabled, rawTime] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.enabled),
          AsyncStorage.getItem(STORAGE_KEYS.time),
        ]);
        if (!isMounted) return;
        if (rawEnabled !== null) setEnabled(rawEnabled === 'true');
        if (rawTime) setTime(rawTime);
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleEnabled = async (value: boolean) => {
    setEnabled(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.enabled, value ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const handleSelectTime = async (newTime: string) => {
    setTime(newTime);
    setTimeModalVisible(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.time, newTime);
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Reminder Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.listItem}>
            <View style={styles.listIconBox}>
              <Ionicons name="notifications-outline" size={18} color={Colors.primaryDark} />
            </View>
            <Text style={styles.listText}>Daily Reminder</Text>
            <Switch
              trackColor={{ false: Colors.border, true: Colors.primaryDark }}
              thumbColor={Colors.white}
              onValueChange={handleToggleEnabled}
              value={enabled}
            />
          </View>

          <View style={styles.divider} />

          <Pressable style={styles.listItem} onPress={() => setTimeModalVisible(true)}>
            <View style={styles.listIconBox}>
              <Ionicons name="time-outline" size={18} color={Colors.primaryDark} />
            </View>
            <Text style={styles.listText}>Reminder Time</Text>
            <Text style={styles.listValue}>{time}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={styles.note}>
          Push notification delivery will be enabled in a future update. Your preference will be saved.
        </Text>
      </View>

      <Modal
        transparent
        visible={timeModalVisible}
        animationType="fade"
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setTimeModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select a time</Text>
            <FlatList
              data={[...TIME_OPTIONS]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === time;
                return (
                  <Pressable style={styles.timeRow} onPress={() => handleSelectTime(item)}>
                    <Text style={styles.timeRowText}>{item}</Text>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={isSelected ? Colors.primary : Colors.textSecondary}
                    />
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ReminderSettingsScreen;

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
  listValue: { ...Typography.caption, color: Colors.textSecondary, marginRight: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
  note: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.md, textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  modalCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, width: '100%', maxHeight: '70%', padding: Spacing.lg },
  modalTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md, textAlign: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  timeRowText: { ...Typography.body, color: Colors.textPrimary, flex: 1 },
  modalDivider: { height: 1, backgroundColor: Colors.border },
});

