/**
 * JourneyStack — Nested stack navigator for the Journey tab.
 * Screens: JourneyHome → EntryArchive → EntryDetail
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JourneyStackParamList } from '../types';

import JourneyScreen from '../screens/JourneyScreen';
import EntryArchiveScreen from '../screens/EntryArchiveScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';

const Stack = createNativeStackNavigator<JourneyStackParamList>();

export const JourneyStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JourneyHome" component={JourneyScreen} />
    <Stack.Screen name="EntryArchive" component={EntryArchiveScreen} />
    <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
  </Stack.Navigator>
);
