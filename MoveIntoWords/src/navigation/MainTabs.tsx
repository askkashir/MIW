/**
 * MainTabs — Bottom tab navigator for the main app experience.
 *
 * Tabs: Dashboard | ModulesStack | JourneyStack | MoreStack
 * JournalStack lives here as a hidden tab, navigated to by the floating
 * Write button in BottomTabBar — it presents like a modal over any tab.
 *
 * The custom BottomTabBar component drives the visual design.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import { BottomTabBar } from '../components/BottomTabBar';

import DashboardScreen from '../screens/DashboardScreen';
import { ModulesStack } from './ModulesStack';
import { JournalStack } from './JournalStack';
import { JourneyStack } from './JourneyStack';
import { MoreStack } from './MoreStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard"    component={DashboardScreen} />
    <Tab.Screen name="ModulesStack" component={ModulesStack} />
    <Tab.Screen name="JourneyStack" component={JourneyStack} />
    <Tab.Screen name="MoreStack"    component={MoreStack} />
    {/*
      JournalStack is a hidden tab — it's not shown in the tab bar.
      It's navigated to programmatically from the floating Write button.
    */}
    <Tab.Screen
      name="JournalStack"
      component={JournalStack}
      options={{ tabBarButton: () => null }}
    />
  </Tab.Navigator>
);
