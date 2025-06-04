import React, { forwardRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'success' | 'error' | 'disabled';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input label */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Current state of the input */
  state?: InputState;
  /** Whether the input is required */
  required?: boolean;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Whether to show a toggle button for password visibility */
  showPasswordToggle?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  helperText,
  errorMessage,
  variant = 'outlined',
  size = 'md',
  state = 'default',
  required = false,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  containerStyle,
  inputStyle,
  textStyle,
  lightColor,
  darkColor,
  secureTextEntry,
  ...textInputProps
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Get all theme colors at the top level
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );
  
  const backgroundColor = useThemeColor({}, 'background');
  const defaultBorderColor = useThemeColor({}, 'border');
  const focusedBorderColor = useThemeColor({}, 'tint');
  const errorBorderColor = useThemeColor({}, 'notification');
  const placeholderColor = useThemeColor({}, 'icon');
  const errorTextColor = useThemeColor({}, 'notification');

  const isDisabled = state === 'disabled';
  const hasError = state === 'error' || !!errorMessage;
  const isPassword = secureTextEntry || showPasswordToggle;
  const showPassword = isPassword && !isPasswordVisible;

  // Determine border color based on state and focus
  const borderColor = getBorderColor(state, isFocused, defaultBorderColor, focusedBorderColor, errorBorderColor);
  
  const containerStyles = getContainerStyle(variant, size, borderColor, backgroundColor);
  const inputStyles = getInputStyle(size, textColor);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={[containerStyles, inputStyle]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          {...textInputProps}
          style={[inputStyles, textStyle]}
          secureTextEntry={showPassword}
          placeholderTextColor={placeholderColor}
          editable={!isDisabled}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          accessibilityState={{
            disabled: isDisabled,
          }}
        />
        
        {(rightIcon || showPasswordToggle) && (
          <View style={styles.rightIcon}>
            {showPasswordToggle && isPassword ? (
              <TouchableOpacity
                onPress={handlePasswordToggle}
                accessibilityRole="button"
                accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
              >
                <Text style={[styles.passwordToggle, { color: textColor }]}>
                  {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>
      
      {(helperText || errorMessage) && (
        <Text style={[
          styles.helperText,
          { color: hasError ? errorTextColor : placeholderColor }
        ]}>
          {errorMessage || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// Helper functions
function getBorderColor(
  state: InputState,
  isFocused: boolean,
  defaultColor: string,
  focusedColor: string,
  errorColor: string
): string {
  if (state === 'error') return errorColor;
  if (isFocused) return focusedColor;
  return defaultColor;
}

function getContainerStyle(
  variant: InputVariant,
  size: InputSize,
  borderColor: string,
  backgroundColor: string
): ViewStyle {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  };

  // Variant-specific styles
  switch (variant) {
    case 'outlined':
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = borderColor;
      baseStyle.backgroundColor = 'transparent';
      break;
    case 'filled':
      baseStyle.backgroundColor = backgroundColor;
      baseStyle.borderWidth = 0;
      break;
    case 'default':
      baseStyle.borderBottomWidth = 1;
      baseStyle.borderBottomColor = borderColor;
      baseStyle.backgroundColor = 'transparent';
      break;
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

  return baseStyle;
}

function getInputStyle(size: InputSize, textColor: string): TextStyle {
  const baseStyle: TextStyle = {
    flex: 1,
    color: textColor,
    fontWeight: '400',
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
  wrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  required: {
    color: '#ef4444',
  },
  leftIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordToggle: {
    fontSize: 16,
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
}); 