import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '../constants/Theme';

interface Props {
  currentStep: number;
  totalSteps?: number;
  activeColor: string;
  inactiveColor: string;
}

const JournalProgress: React.FC<Props> = ({ 
  currentStep, 
  totalSteps = 4, 
  activeColor, 
  inactiveColor 
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < currentStep ? activeColor : inactiveColor }
          ]}
        />
      ))}
    </View>
  );
};

export default JournalProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    width: '100%',
  },
  segment: {
    width: 32, // Fixed width for progress dashes
    height: 3,
    borderRadius: 2,
  },
});
