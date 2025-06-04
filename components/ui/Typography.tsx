import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Text, type TextProps, TextStyle } from 'react-native';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'subtitle1' | 'subtitle2'
  | 'button' | 'link';

export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
export type TypographyColor = 
  | 'primary' | 'secondary' | 'success' | 'error' | 'warning'
  | 'text' | 'muted' | 'disabled';

export interface TypographyProps extends TextProps {
  /** Typography variant that controls size and styling */
  variant?: TypographyVariant;
  /** Font weight */
  weight?: TypographyWeight;
  /** Text alignment */
  align?: TypographyAlign;
  /** Semantic color variant */
  color?: TypographyColor;
  /** Whether text should be italic */
  italic?: boolean;
  /** Whether text should be underlined */
  underline?: boolean;
  /** Whether text should be uppercase */
  uppercase?: boolean;
  /** Whether text should be lowercase */
  lowercase?: boolean;
  /** Whether text should be capitalized */
  capitalize?: boolean;
  /** Line height multiplier (e.g., 1.5 for 150% line height) */
  lineHeightMultiplier?: number;
  /** Letter spacing adjustment */
  letterSpacing?: number;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
  /** Children text content */
  children: React.ReactNode;
}

export function Typography({
  variant = 'body1',
  weight = 'normal',
  align = 'left',
  color = 'text',
  italic = false,
  underline = false,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  lineHeightMultiplier,
  letterSpacing,
  lightColor,
  darkColor,
  style,
  children,
  ...textProps
}: TypographyProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey(color)
  );

  const variantStyle = getVariantStyle(variant);
  const weightStyle = getWeightStyle(weight);
  const transformStyle = getTransformStyle(uppercase, lowercase, capitalize);

  const combinedStyle: TextStyle = {
    ...variantStyle,
    ...weightStyle,
    color: themeColor,
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: underline ? 'underline' : 'none',
    ...transformStyle,
  };

  // Apply line height multiplier if provided
  if (lineHeightMultiplier && variantStyle.lineHeight) {
    combinedStyle.lineHeight = variantStyle.lineHeight * lineHeightMultiplier;
  }

  // Apply letter spacing if provided
  if (letterSpacing !== undefined) {
    combinedStyle.letterSpacing = letterSpacing;
  }

  return (
    <Text
      {...textProps}
      style={[combinedStyle, style]}
      accessibilityRole="text"
    >
      {children}
    </Text>
  );
}

// Helper functions
function getColorKey(color: TypographyColor): keyof typeof import('@/constants/Colors').Colors.light {
  switch (color) {
    case 'primary':
      return 'tint';
    case 'secondary':
      return 'icon';
    case 'success':
      return 'tint'; // Would be success color in enhanced theme
    case 'error':
      return 'notification';
    case 'warning':
      return 'notification'; // Would be warning color in enhanced theme
    case 'text':
      return 'text';
    case 'muted':
      return 'icon';
    case 'disabled':
      return 'icon';
    default:
      return 'text';
  }
}

function getVariantStyle(variant: TypographyVariant): TextStyle {
  switch (variant) {
    case 'h1':
      return {
        fontSize: 48,
        lineHeight: 56,
        fontWeight: '700',
      };
    case 'h2':
      return {
        fontSize: 40,
        lineHeight: 48,
        fontWeight: '700',
      };
    case 'h3':
      return {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '600',
      };
    case 'h4':
      return {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '600',
      };
    case 'h5':
      return {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
      };
    case 'h6':
      return {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600',
      };
    case 'subtitle1':
      return {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '500',
      };
    case 'subtitle2':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
      };
    case 'body1':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
      };
    case 'body2':
      return {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
      };
    case 'caption':
      return {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
      };
    case 'overline':
      return {
        fontSize: 10,
        lineHeight: 16,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
      };
    case 'button':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      };
    case 'link':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        textDecorationLine: 'underline',
      };
    default:
      return {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
      };
  }
}

function getWeightStyle(weight: TypographyWeight): TextStyle {
  switch (weight) {
    case 'light':
      return { fontWeight: '300' };
    case 'normal':
      return { fontWeight: '400' };
    case 'medium':
      return { fontWeight: '500' };
    case 'semibold':
      return { fontWeight: '600' };
    case 'bold':
      return { fontWeight: '700' };
    default:
      return { fontWeight: '400' };
  }
}

function getTransformStyle(
  uppercase: boolean,
  lowercase: boolean,
  capitalize: boolean
): Partial<TextStyle> {
  if (uppercase) return { textTransform: 'uppercase' };
  if (lowercase) return { textTransform: 'lowercase' };
  if (capitalize) return { textTransform: 'capitalize' };
  return {};
}

// Predefined component variants for common use cases
export const Heading1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);

export const Heading2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);

export const Heading3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);

export const Heading4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
);

export const Heading5 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h5" {...props} />
);

export const Heading6 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h6" {...props} />
);

export const BodyText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" {...props} />
);

export const SmallText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body2" {...props} />
);

export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
);

export const Link = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="link" color="primary" {...props} />
); 