import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/Theme';

interface Props {
  currentStep: number;
  totalSteps?: number;
}

const AuthProgress: React.FC<Props> = ({ currentStep, totalSteps = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[styles.segment, i < currentStep ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
};

export default AuthProgress;
export { AuthProgress };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  segment: {
    flex: 1,
    height: Spacing.xxs,
    borderRadius: 2,
  },
  active: {
    backgroundColor: Colors.primaryDark,
  },
  inactive: {
    backgroundColor: Colors.dotInactive,
  },
});
