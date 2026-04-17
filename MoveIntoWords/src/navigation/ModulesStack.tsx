/**
 * ModulesStack — Nested stack navigator for the Modules tab.
 * Screens: ModulesHome → ModuleDetail → ModuleWrite → ModuleDeepen → ModuleSave
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModulesStackParamList } from '../types';

import ModulesScreen from '../screens/ModulesScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import ModuleWriteScreen from '../screens/ModuleWriteScreen';
import ModuleDeepenScreen from '../screens/ModuleDeepenScreen';
import ModuleSaveScreen from '../screens/ModuleSaveScreen';

const Stack = createNativeStackNavigator<ModulesStackParamList>();

export const ModulesStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ModulesHome" component={ModulesScreen} />
    <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
    <Stack.Screen name="ModuleWrite" component={ModuleWriteScreen} />
    <Stack.Screen name="ModuleDeepen" component={ModuleDeepenScreen} />
    <Stack.Screen name="ModuleSave" component={ModuleSaveScreen} />
  </Stack.Navigator>
);
