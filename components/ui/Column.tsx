/**
 * Column component for grid system
 * Provides responsive column sizing with proper gutters
 */

import { StyleSheet, View, ViewProps } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';

interface ResponsiveColumn {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface ColumnProps extends ViewProps {
  children: React.ReactNode;
  /** Column size (1-12) for all breakpoints */
  size?: number;
  /** Responsive column sizes for different breakpoints */
  responsive?: ResponsiveColumn;
  /** Whether to add horizontal gutters */
  noGutters?: boolean;
  /** Offset columns from the left */
  offset?: number;
  /** Responsive offset values */
  offsetResponsive?: ResponsiveColumn;
  /** Whether column should auto-size to content */
  auto?: boolean;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  size,
  responsive,
  noGutters = false,
  offset = 0,
  offsetResponsive,
  auto = false,
  style,
  ...rest
}) => {
  const { getResponsiveValue, getGridConfig, getColumnWidth } = useResponsive();
  const { gutterWidth, columns } = getGridConfig();

  // Get responsive column size
  const getCurrentSize = (): number => {
    if (auto) return 0; // Auto width
    
    if (responsive) {
      const responsiveSize = getResponsiveValue(responsive);
      if (responsiveSize !== undefined) return responsiveSize;
    }
    
    return size || columns; // Default to full width
  };

  // Get responsive offset
  const getCurrentOffset = (): number => {
    if (offsetResponsive) {
      const responsiveOffset = getResponsiveValue(offsetResponsive);
      if (responsiveOffset !== undefined) return responsiveOffset;
    }
    
    return offset;
  };

  const columnSize = getCurrentSize();
  const columnOffset = getCurrentOffset();

  const columnStyle = [
    styles.column,
    {
      paddingHorizontal: noGutters ? 0 : gutterWidth / 2,
      ...(auto 
        ? { flex: 1 } 
        : {
            width: `${(columnSize / columns) * 100}%`,
            marginLeft: columnOffset > 0 ? `${(columnOffset / columns) * 100}%` : undefined,
          }
      ),
    },
    style,
  ];

  return (
    <View style={columnStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    // Base column styles
  },
}); 