/**
 * BottomTabBar — Shared custom bottom navigation bar.
 *
 * Layout: [Home] [Modules] ——[Write]—— [Journey] [More]
 *
 * The floating Write button sits centered between Modules and Journey.
 * It launches the JournalStack modal from any tab.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabDef {
  routeName: string;
  label: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const LEFT_TABS: TabDef[] = [
  { routeName: 'Dashboard',    label: 'Home',    icon: 'home-outline', activeIcon: 'home' },
  { routeName: 'ModulesStack', label: 'Modules', icon: 'grid-outline', activeIcon: 'grid' },
];

const RIGHT_TABS: TabDef[] = [
  { routeName: 'JourneyStack', label: 'Journey', icon: 'book-outline',   activeIcon: 'book' },
  { routeName: 'MoreStack',    label: 'More',    icon: 'person-outline', activeIcon: 'person' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const activeRouteName = state.routes[state.index]?.name;

  const renderTab = (tab: TabDef) => {
    const isActive = activeRouteName === tab.routeName;
    return (
      <Pressable
        key={tab.routeName}
        style={styles.navItem}
        onPress={() => navigation.navigate(tab.routeName)}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
      >
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={24}
          color={isActive ? Colors.primaryDark : Colors.textSecondary}
        />
        <Text style={[styles.navLabel, isActive && { color: Colors.primaryDark }]}>
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {/* Left tabs */}
        <View style={styles.side}>
          {LEFT_TABS.map(renderTab)}
        </View>

        {/* Centre gap — space for the floating Write button */}
        <View style={styles.centre} />

        {/* Right tabs */}
        <View style={styles.side}>
          {RIGHT_TABS.map(renderTab)}
        </View>
      </View>

      {/* Floating Write button — sits above the centre gap */}
      <Pressable
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('JournalStack')}
        accessibilityRole="button"
        accessibilityLabel="Write"
      >
        <Ionicons name="pencil" size={22} color={Colors.white} />
        <Text style={styles.floatingLabel}>Write</Text>
      </Pressable>
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    height: 85,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 12,
    alignItems: 'flex-start',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  centre: {
    width: 70, // gap reserved for the floating button
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Spacing.xs,
    gap: 3,
  },
  navLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  floatingBtn: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.white,
    marginTop: 2,
  },
});
