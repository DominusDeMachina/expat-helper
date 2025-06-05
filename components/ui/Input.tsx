import React, { forwardRef, useCallback, useMemo, useState } from 'react';
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

// Memoize variant to mode mapping
const VARIANT_MODE_MAP = {
  outlined: 'outlined',
  filled: 'flat',
  default: 'outlined',
} as const;

// Memoize keyboard type mapping
const TYPE_KEYBOARD_MAP = {
  email: 'email-address',
  number: 'numeric',
  text: 'default',
  password: 'default',
} as const;

// Memoize color constants
const INPUT_COLORS = {
  error: {
    error: true,
    activeOutlineColor: '#dc3545',
    outlineColor: '#dc3545',
  },
  success: {
    activeOutlineColor: '#28a745',
  },
} as const;

const InputComponent = forwardRef<any, InputProps>(function Input(props, ref) {
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

  // Memoize computed values
  const isDisabled = useMemo(() => disabled || state === 'disabled', [disabled, state]);
  const hasError = useMemo(() => state === 'error' || !!errorMessage, [state, errorMessage]);
  const hasSuccess = useMemo(() => state === 'success' || !!successMessage, [state, successMessage]);
  
  const paperMode = useMemo(() => VARIANT_MODE_MAP[variant], [variant]);
  const keyboardType = useMemo(() => TYPE_KEYBOARD_MAP[type], [type]);
  const secureTextEntry = useMemo(() => type === 'password' && !showPassword, [type, showPassword]);
  const finalLabel = useMemo(() => required && label ? `${label} *` : label, [required, label]);

  // Memoize handlers to prevent recreation
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  // Memoize icon renderers to prevent recreation
  const leftIconRenderer = useMemo(() => {
    return leftIcon ? <PaperTextInput.Icon icon={() => leftIcon} /> : undefined;
  }, [leftIcon]);

  const rightIconRenderer = useMemo(() => {
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
  }, [type, showPassword, rightIcon, togglePasswordVisibility]);

  // Memoize input colors based on state
  const inputColors = useMemo(() => {
    if (hasError) {
      return INPUT_COLORS.error;
    }
    if (hasSuccess) {
      return {
        ...INPUT_COLORS.success,
        outlineColor: isFocused ? INPUT_COLORS.success.activeOutlineColor : undefined,
      };
    }
    return {};
  }, [hasError, hasSuccess, isFocused]);

  // Memoize helper text object
  const helper = useMemo(() => {
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
  }, [errorMessage, successMessage, helperText]);

  return (
    <View style={containerStyle}>
      <PaperTextInput
        ref={ref}
        label={finalLabel}
        placeholder={placeholder}
        value={value}
        mode={paperMode}
        disabled={isDisabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        left={leftIconRenderer}
        right={rightIconRenderer}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={style as any}
        contentStyle={textStyle}
        testID={testID}
        {...inputColors}
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

// Memoize the component to prevent unnecessary re-renders
export const Input = React.memo(InputComponent); 