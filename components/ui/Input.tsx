import React, { forwardRef, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';

export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputType = 'text' | 'number' | 'password' | 'email';
export type InputState = 'default' | 'success' | 'error' | 'disabled';

export interface InputProps {
  /** Input value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input label */
  label?: string;
  /** Input type */
  type?: InputType;
  /** Visual variant */
  variant?: InputVariant;
  /** Input state */
  state?: InputState;
  /** Whether input is required */
  required?: boolean;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether input is multiline */
  multiline?: boolean;
  /** Number of lines for multiline input */
  numberOfLines?: number;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Helper text */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
  /** Success message */
  successMessage?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** OnChange handler */
  onChangeText?: (text: string) => void;
  /** OnFocus handler */
  onFocus?: () => void;
  /** OnBlur handler */
  onBlur?: () => void;
  /** Test ID for testing */
  testID?: string;
}

export const Input = forwardRef<any, InputProps>(function Input(props, ref) {
  const {
    value,
    placeholder,
    label,
    type = 'text',
    variant = 'outlined',
    state = 'default',
    required = false,
    disabled = false,
    multiline = false,
    numberOfLines,
    leftIcon,
    rightIcon,
    helperText,
    errorMessage,
    successMessage,
    containerStyle,
    style,
    textStyle,
    onChangeText,
    onFocus,
    onBlur,
    testID,
    ...restProps
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || state === 'disabled';
  const hasError = state === 'error' || !!errorMessage;
  const hasSuccess = state === 'success' || !!successMessage;

  // Get Paper TextInput mode based on variant
  const getPaperMode = (variant: InputVariant) => {
    switch (variant) {
      case 'outlined':
        return 'outlined';
      case 'filled':
        return 'flat';
      case 'default':
        return 'outlined';
      default:
        return 'outlined';
    }
  };

  // Get keyboard type based on input type
  const getKeyboardType = (type: InputType) => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'text':
      case 'password':
      default:
        return 'default';
    }
  };

  // Get secure text entry
  const getSecureTextEntry = () => {
    return type === 'password' && !showPassword;
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Build the right icon
  const getRightIcon = () => {
    if (type === 'password') {
      return (
        <PaperTextInput.Icon
          icon={showPassword ? 'eye-off' : 'eye'}
          onPress={togglePasswordVisibility}
          forceTextInputFocus={false}
        />
      );
    }
    if (rightIcon) {
      return <PaperTextInput.Icon icon={() => rightIcon} />;
    }
    return undefined;
  };

  // Get input colors based on state
  const getInputColors = () => {
    if (hasError) {
      return {
        error: true,
        activeOutlineColor: '#dc3545',
        outlineColor: '#dc3545',
      };
    }
    if (hasSuccess) {
      return {
        activeOutlineColor: '#28a745',
        outlineColor: isFocused ? '#28a745' : undefined,
      };
    }
    return {};
  };

  // Get helper text with proper type and color
  const getHelperText = () => {
    if (errorMessage) {
      return { text: errorMessage, type: 'error' as const };
    }
    if (successMessage) {
      return { text: successMessage, type: 'info' as const };
    }
    if (helperText) {
      return { text: helperText, type: 'info' as const };
    }
    return null;
  };

  const finalLabel = required && label ? `${label} *` : label;
  const helper = getHelperText();

  return (
    <View style={containerStyle}>
      <PaperTextInput
        ref={ref}
        label={finalLabel}
        placeholder={placeholder}
        value={value}
        mode={getPaperMode(variant)}
        disabled={isDisabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={getKeyboardType(type)}
        secureTextEntry={getSecureTextEntry()}
        left={leftIcon ? <PaperTextInput.Icon icon={() => leftIcon} /> : undefined}
        right={getRightIcon()}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={style as any}
        contentStyle={textStyle}
        testID={testID}
        {...getInputColors()}
        {...restProps}
      />
      {helper && (
        <HelperText type={helper.type} visible={!!helper.text}>
          {helper.text}
        </HelperText>
      )}
    </View>
  );
}); 