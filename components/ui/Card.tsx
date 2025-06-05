import {
  ImageSourcePropType,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

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
  const paperTheme = useTheme();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card'
  );
  
  // Use Paper theme colors as fallback
  const backgroundColor = themeColor || paperTheme.colors.surface;
  const paddingValue = getPaddingValue(size);
  const borderRadius = getBorderRadius(size);

  // Map variant to Paper card mode
  const paperMode = getPaperMode(variant);

  const renderHeader = () => {
    if (header) {
      return (
        <PaperCard.Content style={{ paddingHorizontal: paddingValue }}>
          {header}
        </PaperCard.Content>
      );
    }
    
    if (title || subtitle) {
      return (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          titleStyle={{ 
            fontWeight: '600',
            color: paperTheme.colors.onSurface 
          }}
          subtitleStyle={{
            color: paperTheme.colors.onSurfaceVariant
          }}
          titleNumberOfLines={2}
          subtitleNumberOfLines={2}
        />
      );
    }
    
    return null;
  };

  const renderContent = () => {
    if (!children) return null;
    
    return (
      <PaperCard.Content style={{ paddingHorizontal: paddingValue }}>
        {children}
      </PaperCard.Content>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;
    
    return (
      <PaperCard.Actions style={{ paddingHorizontal: paddingValue }}>
        {footer}
      </PaperCard.Actions>
    );
  };

  const cardProps = {
    mode: paperMode,
    style: [
      {
        backgroundColor,
        borderRadius,
        margin: 0,
      },
      style,
    ],
    ...(pressable && {
      onPress: touchableProps.onPress,
      onLongPress: touchableProps.onLongPress ? () => touchableProps.onLongPress!({} as any) : undefined,
    }),
  };

  return (
    <PaperCard {...cardProps}>
      {image && (
        <PaperCard.Cover
          source={image}
          style={{
            height: imageHeight || 200,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
      )}
      
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </PaperCard>
  );
}

// Helper functions
function getPaperMode(variant: CardVariant): 'elevated' | 'outlined' | 'contained' {
  switch (variant) {
    case 'elevated':
      return 'elevated';
    case 'outlined':
      return 'outlined';
    case 'filled':
      return 'contained';
    default:
      return 'elevated';
  }
}

function getPaddingValue(size: CardSize): number {
  switch (size) {
    case 'sm':
      return 12;
    case 'md':
      return 16;
    case 'lg':
      return 20;
    default:
      return 16;
  }
}

function getBorderRadius(size: CardSize): number {
  switch (size) {
    case 'sm':
      return 8;
    case 'md':
      return 12;
    case 'lg':
      return 16;
    default:
      return 12;
  }
}

// Convenience components for common card variants
export const ProductCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="elevated" />
);

export const InfoCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="outlined" />
);

export const ActionCard = (props: Omit<CardProps, 'variant' | 'pressable'>) => (
  <Card {...props} variant="filled" pressable={true} />
); 