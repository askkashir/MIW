/**
 * JournalStack — Modal stack navigator for the journal writing flow.
 * Launched from the floating Write button in BottomTabBar.
 * Screens: JournalWrite → JournalDeepen → JournalReflect → JournalSave
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../types';

import JournalWriteScreen from '../screens/JournalWriteScreen';
import JournalDeepenScreen from '../screens/JournalDeepenScreen';
import JournalReflectScreen from '../screens/JournalReflectScreen';
import JournalSaveScreen from '../screens/JournalSaveScreen';

const Stack = createNativeStackNavigator<JournalStackParamList>();

export const JournalStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JournalWrite" component={JournalWriteScreen} />
    <Stack.Screen name="JournalDeepen" component={JournalDeepenScreen} />
    <Stack.Screen name="JournalReflect" component={JournalReflectScreen} />
    <Stack.Screen name="JournalSave" component={JournalSaveScreen} />
  </Stack.Navigator>
);
