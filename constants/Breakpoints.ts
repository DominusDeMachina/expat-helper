/**
 * Responsive breakpoints and grid system configuration
 * for mobile-first responsive design
 */

import { Dimensions } from 'react-native';

// Breakpoint values
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices (phones in portrait)
  sm: 576,   // Small devices (phones in landscape)
  md: 768,   // Medium devices (tablets in portrait)
  lg: 992,   // Large devices (tablets in landscape, small desktops)
  xl: 1200,  // Extra large devices (large desktops)
} as const;

// Grid system configuration
export const GRID = {
  columns: 12,
  gutterWidth: 16,
  containerMaxWidth: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
  },
  containerPadding: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 32,
  },
} as const;

// Spacing system for consistent padding/margin
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Type definitions
export type Breakpoint = keyof typeof BREAKPOINTS;
export type SpacingSize = keyof typeof SPACING;

// Utility functions
export const getScreenData = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const getCurrentBreakpoint = (): Breakpoint => {
  const { width } = getScreenData();
  
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

export const isBreakpointUp = (breakpoint: Breakpoint): boolean => {
  const { width } = getScreenData();
  return width >= BREAKPOINTS[breakpoint];
};

export const isBreakpointDown = (breakpoint: Breakpoint): boolean => {
  const { width } = getScreenData();
  return width < BREAKPOINTS[breakpoint];
};

export const isBreakpointBetween = (min: Breakpoint, max: Breakpoint): boolean => {
  const { width } = getScreenData();
  return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
};

export const getContainerMaxWidth = (): number => {
  const breakpoint = getCurrentBreakpoint();
  
  // Handle xs breakpoint which doesn't have a max width
  if (breakpoint === 'xs') {
    return GRID.containerMaxWidth.sm;
  }
  
  return GRID.containerMaxWidth[breakpoint as keyof typeof GRID.containerMaxWidth] || GRID.containerMaxWidth.xl;
};

export const getContainerPadding = (): number => {
  const breakpoint = getCurrentBreakpoint();
  return GRID.containerPadding[breakpoint] || GRID.containerPadding.xs;
}; 