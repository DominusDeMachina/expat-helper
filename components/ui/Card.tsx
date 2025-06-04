import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Typography } from './Typography';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Size of the card */
  size?: CardSize;
  /** Card header content */
  header?: React.ReactNode;
  /** Card title (for simple headers) */
  title?: string;
  /** Card subtitle (for simple headers) */
  subtitle?: string;
  /** Card content */
  children?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Image to display at the top of the card */
  image?: ImageSourcePropType;
  /** Image height when image is provided */
  imageHeight?: number;
  /** Whether the card should be pressable */
  pressable?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export function Card({
  variant = 'elevated',
  size = 'md',
  header,
  title,
  subtitle,
  children,
  footer,
  image,
  imageHeight,
  pressable = false,
  style,
  lightColor,
  darkColor,
  ...touchableProps
}: CardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card'
  );
  
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'text');

  const cardStyle = getCardStyle(variant, size, backgroundColor, borderColor, shadowColor);
  const imageStyle = getImageStyle(imageHeight);
  const paddingStyle = getPaddingStyle(size);

  const renderHeader = () => {
    if (header) {
      return (
        <View style={[styles.header, paddingStyle.horizontal]}>
          {header}
        </View>
      );
    }
    
    if (title || subtitle) {
      return (
        <View style={[styles.header, paddingStyle.horizontal]}>
          {title && (
            <Typography variant="h6" weight="semibold">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="muted" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      );
    }
    
    return null;
  };

  const renderContent = () => {
    if (!children) return null;
    
    return (
      <View style={[styles.content, paddingStyle.horizontal]}>
        {children}
      </View>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;
    
    return (
      <View style={[styles.footer, paddingStyle.horizontal]}>
        {footer}
      </View>
    );
  };

  const CardComponent = pressable ? TouchableOpacity : View;

  return (
    <CardComponent
      {...(pressable ? touchableProps : {})}
      style={[cardStyle, style]}
      accessibilityRole={pressable ? 'button' : 'none'}
    >
      {image && (
        <Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      )}
      
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </CardComponent>
  );
}

// Helper functions
function getCardStyle(
  variant: CardVariant,
  size: CardSize,
  backgroundColor: string,
  borderColor: string,
  shadowColor: string
): ViewStyle {
  const baseStyle: ViewStyle = {
    backgroundColor,
    borderRadius: getSizeValue(size, 'radius'),
    overflow: 'hidden',
  };

  // Variant-specific styles
  switch (variant) {
    case 'elevated':
      baseStyle.shadowColor = shadowColor;
      baseStyle.shadowOffset = { width: 0, height: 2 };
      baseStyle.shadowOpacity = 0.1;
      baseStyle.shadowRadius = 4;
      baseStyle.elevation = 3;
      break;
    case 'outlined':
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = borderColor;
      break;
    case 'filled':
      // Just background color, no additional styling
      break;
  }

  return baseStyle;
}

function getImageStyle(imageHeight?: number): ViewStyle {
  return {
    height: imageHeight || 200,
    width: '100%',
  };
}

function getPaddingStyle(size: CardSize) {
  const padding = getSizeValue(size, 'padding');
  
  return {
    all: { padding },
    horizontal: { paddingHorizontal: padding },
    vertical: { paddingVertical: padding },
  };
}

function getSizeValue(size: CardSize, type: 'padding' | 'radius'): number {
  const values = {
    padding: {
      sm: 12,
      md: 16,
      lg: 20,
    },
    radius: {
      sm: 6,
      md: 8,
      lg: 12,
    },
  };
  
  return values[type][size];
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 4,
  },
  content: {
    paddingVertical: 8,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  image: {
    // Image styles handled dynamically
  },
});

// Predefined component variants for common use cases
export const ProductCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="elevated" {...props} />
);

export const InfoCard = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="outlined" {...props} />
);

export const ActionCard = (props: Omit<CardProps, 'variant' | 'pressable'>) => (
  <Card variant="elevated" pressable {...props} />
); 