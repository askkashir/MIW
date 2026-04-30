/**
 * Reusable TextInput component with an optional label and error message.
 *
 * The border color transitions to the primary (burgundy) color when
 * focused, giving clear visual feedback without being heavy-handed.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
import { useThemeColors } from '../hooks/useThemeColors';

// ── Props ───────────────────────────────────────────────
interface TextInputProps extends RNTextInputProps {
  /** Label displayed above the input */
  label?: string;
  /** Error message displayed below the input (overrides border color) */
  error?: string;
  /** Extra styles for the outer wrapper */
  containerStyle?: ViewStyle;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);

  /** Resolve border color: error > focused > default */
  const borderColor = error
    ? colors.error
    : focused
      ? colors.borderFocused
      : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Optional label */}
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}

      {/* Input field */}
      <RNTextInput
        placeholderTextColor={colors.textPlaceholder}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: colors.inputBackground,
            color: colors.textPrimary,
          },
          style,
        ]}
        {...rest}
      />

      {/* Error text */}
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

export default TextInput;

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxs,
  },
  input: {
    ...Typography.input,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    height: 48,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xxs,
  },
});
