/**
 * Row component for grid system
 * Creates horizontal layout container for columns with proper gutters
 */

import { StyleSheet, View, ViewProps } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';

interface RowProps extends ViewProps {
  children: React.ReactNode;
  /** Whether to add horizontal gutters between columns */
  noGutters?: boolean;
  /** Alignment of columns within the row */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** Justify content alignment */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /** Whether to wrap columns to next line */
  wrap?: boolean;
}

export const Row: React.FC<RowProps> = ({
  children,
  noGutters = false,
  align = 'stretch',
  justify = 'flex-start',
  wrap = true,
  style,
  ...rest
}) => {
  const { getGridConfig } = useResponsive();
  const { gutterWidth } = getGridConfig();

  const flexWrapValue: 'wrap' | 'nowrap' = wrap ? 'wrap' : 'nowrap';

  const rowStyle = [
    styles.row,
    {
      marginHorizontal: noGutters ? 0 : -gutterWidth / 2,
      alignItems: align,
      justifyContent: justify,
      flexWrap: flexWrapValue,
    },
    style,
  ];

  return (
    <View style={rowStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
  },
}); 