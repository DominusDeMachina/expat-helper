import { TextStyle, ViewStyle } from 'react-native';
import { Button as PaperButton, TouchableRipple } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';

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

export function Button({
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
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Map variants to Paper Button modes
  const getPaperMode = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'outlined';
      case 'text':
        return 'text';
      case 'destructive':
        return 'contained';
      default:
        return 'contained';
    }
  };

  // Get button content height based on size
  const getButtonHeight = (size: ButtonSize) => {
    switch (size) {
      case 'sm':
        return 36;
      case 'md':
        return 44;
      case 'lg':
        return 52;
      default:
        return 44;
    }
  };

  // Get font size based on size
  const getFontSize = (size: ButtonSize) => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyle: ViewStyle = {
    height: getButtonHeight(size),
    justifyContent: 'center',
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  const buttonTextStyle: TextStyle = {
    fontSize: getFontSize(size),
    ...textStyle,
  };

  // For destructive variant, we need custom styling
  if (variant === 'destructive') {
    return (
      <PaperButton
        mode="contained"
        onPress={onPress}
        disabled={isDisabled}
        loading={loading}
        style={buttonStyle}
        labelStyle={buttonTextStyle}
        buttonColor="#dc3545"
        textColor="#ffffff"
        icon={leftIcon ? () => leftIcon : undefined}
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
        onPress={onPress}
        disabled={isDisabled}
        style={[buttonStyle, { backgroundColor: 'transparent' }]}
        testID={testID}
      >
        <PaperButton
          mode="text"
          loading={loading}
          disabled={isDisabled}
          labelStyle={buttonTextStyle}
          icon={leftIcon ? () => leftIcon : undefined}
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
      mode={getPaperMode(variant)}
      onPress={onPress}
      disabled={isDisabled}
      loading={loading}
      style={buttonStyle}
      labelStyle={buttonTextStyle}
      icon={leftIcon ? () => leftIcon : undefined}
      testID={testID}
      {...props}
    >
      {title}
    </PaperButton>
  );
} 