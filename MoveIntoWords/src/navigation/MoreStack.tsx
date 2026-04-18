/**
 * MoreStack — Nested stack navigator for the More tab.
 * Screens: MoreHome → MemberPerks
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../types';

import MoreScreen from '../screens/MoreScreen';
import MemberPerksScreen from '../screens/MemberPerksScreen';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoreHome" component={MoreScreen} />
    <Stack.Screen name="MemberPerks" component={MemberPerksScreen} />
  </Stack.Navigator>
);
