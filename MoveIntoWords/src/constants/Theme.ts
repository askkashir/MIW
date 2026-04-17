/**
 * Theme.ts — Centralized design system for Move Into Words.
 *
 * All colors, typography, and spacing tokens live here.
 * Never hardcode colors or font sizes in component files —
 * always import from this module.
 *
 * Usage:
 *   import { Colors, Typography, Spacing, Radii } from '../constants/Theme';
 */

import { Platform, TextStyle } from 'react-native';

// ─────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────

export const Colors = {
  // ── Brand ────────────────────────────────────────────
  /** Deep burgundy — primary accent for CTAs and highlights */
  primary: '#6B1E2E',
  /** Lighter burgundy for pressed / hover states */
  primaryLight: '#8C3A4B',
  /** Darker burgundy for subtle emphasis */
  primaryDark: '#4A0F1C',

  // ── Base ─────────────────────────────────────────────
  black: '#000000',
  white: '#FFFFFF',

  // ── Backgrounds ──────────────────────────────────────
  /** Warm off-white screen background */
  background: '#FAF8F5',
  /** Card / elevated surface */
  surface: '#FFFFFF',
  /** Dark card surface for onboarding/modules */
  surfaceDark: '#382B2D',
  /** Even darker card surface */
  surfaceDarker: '#2D2123',

  // ── Text ─────────────────────────────────────────────
  /** Primary body text */
  textPrimary: '#1A1A1A',
  /** Secondary / muted text */
  textSecondary: '#6E6E6E',
  /** Placeholder & disabled text */
  textPlaceholder: '#A3A3A3',

  // ── Borders & Dividers ───────────────────────────────
  border: '#E0DCDA',
  borderFocused: '#6B1E2E',
  /** Soft pinkish-grey — inactive progress dots & step bars */
  dotInactive: '#E6D7D9',

  // ── Journaling Specific ──────────────────────────────
  journalBlue: '#8FAABC', // Reflect screen CTA
  journalBlueLight: '#D9E3EA', // Reflect inactive progress
  journalGreen: '#8BB098', // Save screen CTA
  journalGreenLight: '#DDE9E0', // Save inactive progress

  // ── Feedback ─────────────────────────────────────────
  error: '#C0392B',
  success: '#27AE60',

  // ── Overlays ─────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

// ─────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────

/**
 * Font families:
 *   • Serif  → headings & emotional / literary text
 *   • Sans   → inputs, buttons, general UI
 */
export const FontFamily = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }) as string,
  sans: Platform.select({ ios: 'System', default: 'Roboto' }) as string,
} as const;

/** Pre-defined text styles keyed by role */
export const Typography: Record<string, TextStyle> = {
  /** Large screen title (serif) */
  h1: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  /** Section heading (serif) */
  h2: {
    fontFamily: FontFamily.serif,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  /** Card / item title (serif) */
  h3: {
    fontFamily: FontFamily.serif,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  /** Standard body text (sans) */
  body: {
    fontFamily: FontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  /** Smaller supporting text (sans) */
  caption: {
    fontFamily: FontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  /** Button label (sans, medium weight) */
  button: {
    fontFamily: FontFamily.sans,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  /** Text input value (sans) */
  input: {
    fontFamily: FontFamily.sans,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
} as const;

// ─────────────────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────────────────

/** 4-pt grid scale for padding, margins, and gaps */
export const Spacing = {
  /** 4 px */
  xxs: 4,
  /** 8 px */
  xs: 8,
  /** 12 px */
  sm: 12,
  /** 16 px — default padding */
  md: 16,
  /** 24 px */
  lg: 24,
  /** 32 px */
  xl: 32,
  /** 48 px — section-level spacing */
  xxl: 48,
} as const;

/** Border-radius presets */
export const Radii = {
  sm: 6,
  md: 10,
  lg: 16,
  /** Pill / fully rounded */
  full: 9999,
} as const;
