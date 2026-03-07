/**
 * DealHub AI Mobile — Design tokens
 * Aligns with docs/MOBILE_DESIGN.md
 */

export const colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#1E3A5F',
  primaryLight: '#2E5A8C',
  secondary: '#64748B',
  muted: '#94A3B8',
  border: '#E2E8F0',
  success: '#0D9488',
  successBg: '#CCFBF1',
  error: '#DC2626',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenHorizontal: 20,
  screenVertical: 16,
  cardPadding: 16,
} as const;

export const borderRadius = {
  input: 10,
  button: 12,
  card: 16,
  fab: 28,
} as const;

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  overline: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  modal: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} as const;
