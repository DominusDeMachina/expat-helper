/**
 * Custom hook for responsive design utilities
 */

import {
    BREAKPOINTS,
    getContainerMaxWidth,
    getContainerPadding,
    getCurrentBreakpoint,
    GRID,
    isBreakpointDown,
    isBreakpointUp,
    SPACING,
    type Breakpoint,
    type SpacingSize,
} from '@/constants/Breakpoints';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

interface ScreenDimensions {
  width: number;
  height: number;
}

interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getCurrentBreakpoint());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
      setBreakpoint(getCurrentBreakpoint());
    });

    return () => subscription?.remove();
  }, []);

  /**
   * Get responsive value based on current breakpoint
   * Returns the closest match for current screen size
   */
  const getResponsiveValue = <T>(values: ResponsiveValue<T>): T | undefined => {
    const current = getCurrentBreakpoint();
    
    // First try to get exact match
    if (values[current] !== undefined) {
      return values[current];
    }

    // Fallback to smaller breakpoints
    const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(current);
    
    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }

    return undefined;
  };

  /**
   * Get spacing value
   */
  const spacing = (size: SpacingSize): number => SPACING[size];

  /**
   * Check if current breakpoint is at least the specified breakpoint
   */
  const isUp = (bp: Breakpoint): boolean => isBreakpointUp(bp);

  /**
   * Check if current breakpoint is below the specified breakpoint
   */
  const isDown = (bp: Breakpoint): boolean => isBreakpointDown(bp);

  /**
   * Get column width based on total columns and gutter
   */
  const getColumnWidth = (cols: number, totalCols: number = GRID.columns): number => {
    const containerWidth = dimensions.width - (getContainerPadding() * 2);
    const gutterSpace = (totalCols - 1) * GRID.gutterWidth;
    const availableWidth = containerWidth - gutterSpace;
    return (availableWidth / totalCols) * cols;
  };

  /**
   * Get responsive grid configuration
   */
  const getGridConfig = () => ({
    columns: GRID.columns,
    gutterWidth: GRID.gutterWidth,
    containerMaxWidth: getContainerMaxWidth(),
    containerPadding: getContainerPadding(),
  });

  return {
    // Screen data
    dimensions,
    breakpoint,
    
    // Responsive utilities
    getResponsiveValue,
    spacing,
    isUp,
    isDown,
    
    // Grid utilities
    getColumnWidth,
    getGridConfig,
    
    // Constants
    breakpoints: BREAKPOINTS,
    grid: GRID,
    spacingScale: SPACING,
  };
};

export type UseResponsiveReturn = ReturnType<typeof useResponsive>; 