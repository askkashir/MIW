import React from 'react';
import { View, Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '../constants/Theme';
import Button from './Button';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

const BottomAction: React.FC<Props> = ({ onBack, onNext }) => {
  const { width } = useWindowDimensions();
  const btnSize = width * 0.13;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backBtn,
          { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <View style={styles.nextWrapper}>
        <Button label="Next" onPress={onNext} variant="filled" style={styles.nextBtnOverride} />
      </View>
    </View>
  );
};

export default BottomAction;
export { BottomAction };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  backBtn: {
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  backIcon: {
    ...Typography.h2,
    color: Colors.white,
  },
  nextWrapper: {
    flex: 1,
  },
  nextBtnOverride: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radii.full,
  },
});
