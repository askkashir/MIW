import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../constants/Theme';

interface Props {
  title: string;
  icon: string;
  onPress: () => void;
  type: 'email' | 'apple' | 'google';
  style?: ViewStyle;
}

const SocialButton: React.FC<Props> = ({ title, icon, onPress, type, style }) => {
  const isEmail = type === 'email';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isEmail ? styles.emailBg : styles.socialBg,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.icon, isEmail && styles.iconWhite]}>{icon}</Text>
      <Text style={[styles.text, isEmail && styles.textWhite]}>{title}</Text>
    </Pressable>
  );
};

export default SocialButton;
export { SocialButton };

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.xxl + Spacing.xxs,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  emailBg: {
    backgroundColor: Colors.primaryDark,
  },
  socialBg: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: Spacing.sm - 7,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    ...Typography.body,
    marginRight: Spacing.sm,
    color: Colors.textPrimary,
  },
  iconWhite: {
    color: Colors.white,
  },
  text: {
    ...Typography.button,
    color: Colors.textPrimary,
  },
  textWhite: {
    color: Colors.white,
  },
});
