import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useMemo } from 'react';
import { type TextProps, TextStyle } from 'react-native';
import { Text as PaperText } from 'react-native-paper';

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

  /** Letter spacing adjustment */
  letterSpacing?: number;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
  /** Children text content */
  children: React.ReactNode;
}

// Memoize style mappings to prevent recreation
const VARIANT_STYLES = {
  h1: { fontSize: 48, fontWeight: '700' as const },
  h2: { fontSize: 40, fontWeight: '700' as const },
  h3: { fontSize: 32, fontWeight: '600' as const },
  h4: { fontSize: 28, fontWeight: '600' as const },
  h5: { fontSize: 24, fontWeight: '600' as const },
  h6: { fontSize: 20, fontWeight: '600' as const },
  subtitle1: { fontSize: 18, fontWeight: '500' as const },
  subtitle2: { fontSize: 16, fontWeight: '500' as const },
  body1: { fontSize: 16, fontWeight: '400' as const },
  body2: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  overline: { fontSize: 10, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  button: { fontSize: 14, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  link: { fontSize: 16, fontWeight: '500' as const },
} as const;

const WEIGHT_STYLES = {
  light: { fontWeight: '300' as const },
  normal: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
} as const;

const COLOR_KEY_MAP = {
  primary: 'tint',
  secondary: 'icon',
  success: 'tint',
  error: 'notification',
  warning: 'notification',
  text: 'text',
  muted: 'icon',
  disabled: 'icon',
} as const;

const PAPER_VARIANT_MAP = {
  h1: 'displayLarge',
  h2: 'displayMedium',
  h3: 'displaySmall',
  h4: 'headlineLarge',
  h5: 'headlineMedium',
  h6: 'headlineSmall',
  subtitle1: 'titleLarge',
  subtitle2: 'titleMedium',
  body1: 'bodyLarge',
  body2: 'bodyMedium',
  caption: 'bodySmall',
  overline: 'labelSmall',
  button: 'labelMedium',
  link: 'labelLarge',
} as const;

const TypographyComponent: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'normal',
  align = 'left',
  color = 'text',
  italic = false,
  underline = false,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  letterSpacing,
  lightColor,
  darkColor,
  style,
  children,
  ...textProps
}) => {
  // Memoize color key lookup
  const colorKey = useMemo(() => COLOR_KEY_MAP[color] || 'text', [color]);
  
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorKey as keyof typeof import('@/constants/Colors').Colors.light
  );

  // Memoize style computations
  const variantStyle = useMemo(() => VARIANT_STYLES[variant] || VARIANT_STYLES.body1, [variant]);
  const weightStyle = useMemo(() => WEIGHT_STYLES[weight], [weight]);
  const paperVariant = useMemo(() => PAPER_VARIANT_MAP[variant] || 'bodyMedium', [variant]);

  // Memoize text transform style
  const transformStyle = useMemo(() => {
    if (uppercase) return { textTransform: 'uppercase' as const };
    if (lowercase) return { textTransform: 'lowercase' as const };
    if (capitalize) return { textTransform: 'capitalize' as const };
    return {};
  }, [uppercase, lowercase, capitalize]);

  // Memoize combined style
  const combinedStyle = useMemo((): TextStyle => ({
    ...variantStyle,
    ...weightStyle,
    color: themeColor,
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine: underline ? 'underline' : 'none',
    ...transformStyle,
    ...(letterSpacing !== undefined && { letterSpacing }),
  }), [
    variantStyle,
    weightStyle,
    themeColor,
    align,
    italic,
    underline,
    transformStyle,
    letterSpacing,
  ]);

  // Memoize final style array
  const finalStyle = useMemo(() => [combinedStyle, style], [combinedStyle, style]);

  return (
    <PaperText
      {...textProps}
      variant={paperVariant as any}
      style={finalStyle}
    >
      {children}
    </PaperText>
  );
};

// Memoize the main component
export const Typography = React.memo(TypographyComponent);

// Convenience components with proper memoization and display names
const Heading1Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);
Heading1Component.displayName = 'Heading1';
export const Heading1 = React.memo(Heading1Component);

const Heading2Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);
Heading2Component.displayName = 'Heading2';
export const Heading2 = React.memo(Heading2Component);

const Heading3Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);
Heading3Component.displayName = 'Heading3';
export const Heading3 = React.memo(Heading3Component);

const Heading4Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
);
Heading4Component.displayName = 'Heading4';
export const Heading4 = React.memo(Heading4Component);

const Heading5Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h5" {...props} />
);
Heading5Component.displayName = 'Heading5';
export const Heading5 = React.memo(Heading5Component);

const Heading6Component = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h6" {...props} />
);
Heading6Component.displayName = 'Heading6';
export const Heading6 = React.memo(Heading6Component);

const BodyTextComponent = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" {...props} />
);
BodyTextComponent.displayName = 'BodyText';
export const BodyText = React.memo(BodyTextComponent);

const SmallTextComponent = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body2" {...props} />
);
SmallTextComponent.displayName = 'SmallText';
export const SmallText = React.memo(SmallTextComponent);

const CaptionComponent = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
);
CaptionComponent.displayName = 'Caption';
export const Caption = React.memo(CaptionComponent);

const LinkComponent = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="link" {...props} />
);
LinkComponent.displayName = 'Link';
export const Link = React.memo(LinkComponent); 