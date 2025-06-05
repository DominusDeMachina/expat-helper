import React, { useCallback, useMemo } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { Button as PaperButton, TouchableRipple } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button text content */
  title: string;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button takes full width */
  fullWidth?: boolean;
  /** Icon to display before the text */
  leftIcon?: React.ReactNode;
  /** Right icon name from Ionicons */
  rightIconName?: keyof typeof Ionicons.glyphMap;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
  /** OnPress handler */
  onPress?: () => void;
  /** Test ID for testing */
  testID?: string;
}

// Memoize size calculations to prevent recreation
const SIZE_CONFIG = {
  sm: { height: 36, fontSize: 14 },
  md: { height: 44, fontSize: 16 },
  lg: { height: 52, fontSize: 18 },
} as const;

// Memoize mode mapping to prevent recreation
const VARIANT_MODE_MAP = {
  primary: 'contained',
  secondary: 'outlined',
  text: 'text',
  destructive: 'contained',
} as const;

// Memoize destructive button colors to prevent recreation
const DESTRUCTIVE_COLORS = {
  buttonColor: '#dc3545',
  textColor: '#ffffff',
} as const;

export const Button = React.memo<ButtonProps>(function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIconName,
  style,
  textStyle,
  onPress,
  testID,
  ...props
}) {
  const isDisabled = disabled || loading;

  // Memoize computed values to prevent recalculation on every render
  const sizeConfig = useMemo(() => SIZE_CONFIG[size], [size]);
  const paperMode = useMemo(() => VARIANT_MODE_MAP[variant], [variant]);
  
  // Memoize styles to prevent recreation
  const buttonStyle = useMemo((): ViewStyle => ({
    height: sizeConfig.height,
    justifyContent: 'center',
    ...(fullWidth && { width: '100%' }),
    ...style,
  }), [sizeConfig.height, fullWidth, style]);

  const buttonTextStyle = useMemo((): TextStyle => ({
    fontSize: sizeConfig.fontSize,
    ...textStyle,
  }), [sizeConfig.fontSize, textStyle]);

  // Memoize icon render function to prevent recreation
  const iconRenderer = useMemo(() => {
    return leftIcon ? () => leftIcon : undefined;
  }, [leftIcon]);

  // Memoize transparent style for text variant
  const transparentStyle = useMemo(() => [
    buttonStyle, 
    { backgroundColor: 'transparent' }
  ], [buttonStyle]);

  // Use useCallback for handlers to prevent recreation
  const handlePress = useCallback(() => {
    if (onPress && !isDisabled) {
      onPress();
    }
  }, [onPress, isDisabled]);

  // For destructive variant, we need custom styling
  if (variant === 'destructive') {
    return (
      <PaperButton
        mode="contained"
        onPress={handlePress}
        disabled={isDisabled}
        loading={loading}
        style={buttonStyle}
        labelStyle={buttonTextStyle}
        buttonColor={DESTRUCTIVE_COLORS.buttonColor}
        textColor={DESTRUCTIVE_COLORS.textColor}
        icon={iconRenderer}
        testID={testID}
        {...props}
      >
        {title}
      </PaperButton>
    );
  }

  // For text variant with custom styling
  if (variant === 'text') {
    return (
      <TouchableRipple
        onPress={handlePress}
        disabled={isDisabled}
        style={transparentStyle}
        testID={testID}
      >
        <PaperButton
          mode="text"
          loading={loading}
          disabled={isDisabled}
          labelStyle={buttonTextStyle}
          icon={iconRenderer}
          contentStyle={{ height: '100%' }}
        >
          {title}
        </PaperButton>
      </TouchableRipple>
    );
  }

  // Standard Paper Button for primary and secondary variants
  return (
    <PaperButton
      mode={paperMode}
      onPress={handlePress}
      disabled={isDisabled}
      loading={loading}
      style={buttonStyle}
      labelStyle={buttonTextStyle}
      icon={iconRenderer}
      testID={testID}
      {...props}
    >
      {title}
    </PaperButton>
  );
}); 