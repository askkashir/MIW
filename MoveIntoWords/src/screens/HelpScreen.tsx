import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { useThemeColors } from '../hooks/useThemeColors';
import { MoreStackParamList } from '../types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Help'>;

const HelpScreen: React.FC<Props> = ({ navigation }) => {
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Us</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              style={styles.listItem}
              onPress={() => Linking.openURL('mailto:support@moveintowords.org')}
            >
              <View style={styles.listIconBox}>
                <Ionicons name="mail-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Email Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Legal</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              style={styles.listItem}
              onPress={() => Linking.openURL('https://moveintowords.org/privacy')}
            >
              <View style={styles.listIconBox}>
                <Ionicons name="document-text-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              style={styles.listItem}
              onPress={() => Linking.openURL('https://moveintowords.org/terms')}
            >
              <View style={styles.listIconBox}>
                <Ionicons name="document-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Terms of Use</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>App Info</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.listItem}>
              <View style={styles.listIconBox}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Version 1.0.0</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.listItem}>
              <View style={styles.listIconBox}>
                <Ionicons name="book-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.listText, { color: colors.textPrimary }]}>Move Into Words — A nonprofit journaling app</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;

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

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  card: { backgroundColor: Colors.surface, borderRadius: Radii.lg, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  listIconBox: { width: 24, alignItems: 'center', marginRight: Spacing.md },
  listText: { ...Typography.body, flex: 1, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 56 },
});

