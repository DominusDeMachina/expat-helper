/**
 * Container component for responsive layouts
 * Provides proper padding and max-width based on breakpoints
 */

import { StyleSheet, View, ViewProps } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  /** Whether to apply maximum width constraints */
  fluid?: boolean;
  /** Custom padding override */
  padding?: number;
  /** Center the container horizontally */
  center?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  padding,
  center = false,
  style,
  ...rest
}) => {
  const { getGridConfig, dimensions } = useResponsive();
  const gridConfig = getGridConfig();

  const containerStyle = [
    styles.container,
    {
      paddingHorizontal: padding ?? gridConfig.containerPadding,
      maxWidth: fluid ? undefined : Math.min(gridConfig.containerMaxWidth, dimensions.width),
      alignSelf: center ? 'center' as const : undefined,
    },
    style,
  ];

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 