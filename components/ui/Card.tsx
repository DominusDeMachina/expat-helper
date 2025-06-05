import React, { useCallback, useMemo } from 'react';
import {
    ImageSourcePropType,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

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

// Memoize variant to mode mapping
const VARIANT_MODE_MAP = {
  elevated: 'elevated',
  outlined: 'outlined',
  filled: 'contained',
} as const;

// Memoize size configurations
const SIZE_CONFIG = {
  sm: { padding: 12, borderRadius: 8 },
  md: { padding: 16, borderRadius: 12 },
  lg: { padding: 20, borderRadius: 16 },
} as const;

const CardComponent: React.FC<CardProps> = ({
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
}) => {
  const paperTheme = useTheme();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card'
  );
  
  // Memoize computed values
  const backgroundColor = useMemo(() => 
    themeColor || paperTheme.colors.surface, 
    [themeColor, paperTheme.colors.surface]
  );
  
  const sizeConfig = useMemo(() => SIZE_CONFIG[size], [size]);
  const paperMode = useMemo(() => VARIANT_MODE_MAP[variant], [variant]);
  
  // Memoize title and subtitle styles
  const titleStyle = useMemo(() => ({
    fontWeight: '600' as const,
    color: paperTheme.colors.onSurface 
  }), [paperTheme.colors.onSurface]);
  
  const subtitleStyle = useMemo(() => ({
    color: paperTheme.colors.onSurfaceVariant
  }), [paperTheme.colors.onSurfaceVariant]);

  // Memoize image border radius styles
  const imageBorderStyle = useMemo(() => ({
    height: imageHeight || 200,
    borderTopLeftRadius: sizeConfig.borderRadius,
    borderTopRightRadius: sizeConfig.borderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }), [imageHeight, sizeConfig.borderRadius]);

  // Memoize header content padding style
  const contentPaddingStyle = useMemo(() => ({
    paddingHorizontal: sizeConfig.padding
  }), [sizeConfig.padding]);

  // Memoize card style
  const cardStyle = useMemo(() => [
    {
      backgroundColor,
      borderRadius: sizeConfig.borderRadius,
      margin: 0,
    },
    style,
  ], [backgroundColor, sizeConfig.borderRadius, style]);

  // Memoize press handlers to prevent recreation
  const handlePress = useCallback(() => {
    if (touchableProps.onPress) {
      touchableProps.onPress({} as any);
    }
  }, [touchableProps.onPress]);

  const handleLongPress = useCallback(() => {
    if (touchableProps.onLongPress) {
      touchableProps.onLongPress({} as any);
    }
  }, [touchableProps.onLongPress]);

  // Memoize rendered components to prevent recreation
  const renderHeader = useMemo(() => {
    if (header) {
      return (
        <PaperCard.Content style={contentPaddingStyle}>
          {header}
        </PaperCard.Content>
      );
    }
    
    if (title || subtitle) {
      return (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          titleStyle={titleStyle}
          subtitleStyle={subtitleStyle}
          titleNumberOfLines={2}
          subtitleNumberOfLines={2}
        />
      );
    }
    
    return null;
  }, [header, title, subtitle, contentPaddingStyle, titleStyle, subtitleStyle]);

  const renderContent = useMemo(() => {
    if (!children) return null;
    
    return (
      <PaperCard.Content style={contentPaddingStyle}>
        {children}
      </PaperCard.Content>
    );
  }, [children, contentPaddingStyle]);

  const renderFooter = useMemo(() => {
    if (!footer) return null;
    
    return (
      <PaperCard.Actions style={contentPaddingStyle}>
        {footer}
      </PaperCard.Actions>
    );
  }, [footer, contentPaddingStyle]);

  const renderImage = useMemo(() => {
    if (!image) return null;
    
    return (
      <PaperCard.Cover
        source={image}
        style={imageBorderStyle}
      />
    );
  }, [image, imageBorderStyle]);

  // Memoize card props
  const cardProps = useMemo(() => ({
    mode: paperMode,
    style: cardStyle,
    ...(pressable && {
      onPress: handlePress,
      onLongPress: touchableProps.onLongPress ? handleLongPress : undefined,
    }),
  }), [paperMode, cardStyle, pressable, handlePress, touchableProps.onLongPress, handleLongPress]);

  return (
    <PaperCard {...cardProps}>
      {renderImage}
      {renderHeader}
      {renderContent}
      {renderFooter}
    </PaperCard>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const Card = React.memo(CardComponent);

// Convenience components for common card variants
const InfoCardComponent = (props: Omit<CardProps, 'variant'>) => (
  <Card variant="outlined" {...props} />
);
InfoCardComponent.displayName = 'InfoCard';
export const InfoCard = React.memo(InfoCardComponent);

const ActionCardComponent = (props: Omit<CardProps, 'variant' | 'pressable'>) => (
  <Card variant="elevated" pressable {...props} />
);
ActionCardComponent.displayName = 'ActionCard';
export const ActionCard = React.memo(ActionCardComponent); 