/**
 * Reusable Button component.
 *
 * Supports two visual variants:
 *   • "filled"  — solid burgundy background, white label (default)
 *   • "outline" — transparent background with burgundy border & label
 *
 * All colors and typography are pulled from the centralized Theme.
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';

import { Colors, Typography, Spacing, Radii } from '../constants/Theme';

// ── Props ───────────────────────────────────────────────
interface ButtonProps {
  /** Text displayed on the button */
  label: string;
  /** Callback fired on press */
  onPress: () => void;
  /** Visual variant — defaults to "filled" */
  variant?: 'filled' | 'outline';
  /** Disables the button and reduces opacity */
  disabled?: boolean;
  /** Shows a spinner in place of the label */
  loading?: boolean;
  /** Optional extra styles applied to the outer container */
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  loading = false,
  style,
}) => {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.outline,
        style,
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isFilled ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            Typography.button,
            { color: isFilled ? Colors.white : Colors.primary },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  filled: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
