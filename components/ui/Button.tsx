import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
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
  /** Icon to display after the text */
  rightIcon?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  lightColor,
  darkColor,
  ...touchableProps
}: ButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getBackgroundColorKey(variant)
  );
  
  const textColor = useThemeColor(
    {},
    getTextColorKey(variant)
  );

  const isDisabled = disabled || loading;
  const buttonStyle = getButtonStyle(variant, size, fullWidth, backgroundColor, isDisabled);
  const buttonTextStyle = getTextStyle(variant, size, textColor);

  return (
    <TouchableOpacity
      {...touchableProps}
      style={[buttonStyle, style]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {leftIcon && !loading && (
          <View style={[styles.icon, styles.leftIcon]}>
            {leftIcon}
          </View>
        )}
        
        {loading && (
          <View style={[styles.icon, styles.leftIcon]}>
            <ActivityIndicator
              size="small"
              color={textColor}
            />
          </View>
        )}
        
        <Text style={[buttonTextStyle, textStyle]}>
          {title}
        </Text>
        
        {rightIcon && !loading && (
          <View style={[styles.icon, styles.rightIcon]}>
            {rightIcon}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Helper functions
function getBackgroundColorKey(variant: ButtonVariant): keyof typeof import('@/constants/Colors').Colors.light {
  switch (variant) {
    case 'primary':
      return 'tint';
    case 'secondary':
      return 'card';
    case 'destructive':
      return 'notification';
    case 'text':
      return 'background';
    default:
      return 'tint';
  }
}

function getTextColorKey(variant: ButtonVariant): keyof typeof import('@/constants/Colors').Colors.light {
  switch (variant) {
    case 'primary':
      return 'background';
    case 'secondary':
      return 'text';
    case 'destructive':
      return 'background';
    case 'text':
      return 'tint';
    default:
      return 'background';
  }
}

function getButtonStyle(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  backgroundColor: string,
  disabled: boolean
): ViewStyle {
  const baseStyle: ViewStyle = {
    backgroundColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  // Add border for secondary variant
  if (variant === 'secondary') {
    baseStyle.borderWidth = 1;
    baseStyle.borderColor = backgroundColor;
  }

  // Size-specific styles
  switch (size) {
    case 'sm':
      baseStyle.paddingHorizontal = 12;
      baseStyle.paddingVertical = 8;
      baseStyle.minHeight = 36;
      break;
    case 'md':
      baseStyle.paddingHorizontal = 16;
      baseStyle.paddingVertical = 12;
      baseStyle.minHeight = 44;
      break;
    case 'lg':
      baseStyle.paddingHorizontal = 20;
      baseStyle.paddingVertical = 16;
      baseStyle.minHeight = 52;
      break;
  }

  // Full width
  if (fullWidth) {
    baseStyle.width = '100%';
  }

  // Text variant has no background
  if (variant === 'text') {
    baseStyle.backgroundColor = 'transparent';
  }

  return baseStyle;
}

function getTextStyle(
  variant: ButtonVariant,
  size: ButtonSize,
  textColor: string
): TextStyle {
  const baseStyle: TextStyle = {
    color: textColor,
    fontWeight: '600',
    textAlign: 'center',
  };

  // Size-specific text styles
  switch (size) {
    case 'sm':
      baseStyle.fontSize = 14;
      baseStyle.lineHeight = 20;
      break;
    case 'md':
      baseStyle.fontSize = 16;
      baseStyle.lineHeight = 24;
      break;
    case 'lg':
      baseStyle.fontSize = 18;
      baseStyle.lineHeight = 28;
      break;
  }

  return baseStyle;
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
}); 