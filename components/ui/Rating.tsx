import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';
import { useTheme } from 'react-native-paper';
import { useThemeColor } from '@/hooks/useThemeColor';

export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingVariant = 'star' | 'heart' | 'thumb';

export interface RatingProps {
  /** Current rating value (0-maxRating) */
  rating: number;
  /** Maximum rating value */
  maxRating?: number;
  /** Size of the rating icons */
  size?: RatingSize;
  /** Visual variant of the rating */
  variant?: RatingVariant;
  /** Whether the rating is interactive */
  interactive?: boolean;
  /** Whether the rating is read-only */
  readOnly?: boolean;
  /** Whether to show the numeric value */
  showValue?: boolean;
  /** Whether to show the count/total */
  showCount?: boolean;
  /** Total count for display */
  count?: number;
  /** Custom label for the rating */
  label?: string;
  /** Whether to allow half ratings */
  allowHalf?: boolean;
  /** Callback when rating changes */
  onRatingChange?: (rating: number) => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export function Rating({
  rating,
  maxRating = 5,
  size = 'md',
  variant = 'star',
  interactive = false,
  readOnly = false,
  showValue = false,
  showCount = false,
  count,
  label,
  allowHalf = false,
  onRatingChange,
  style,
  lightColor,
  darkColor,
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const paperTheme = useTheme();
  
  const themeActiveColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'tint'
  );
  const themeInactiveColor = useThemeColor({}, 'icon');
  
  // Use Paper theme colors as fallback
  const activeColor = themeActiveColor || paperTheme.colors.primary;
  const inactiveColor = themeInactiveColor || paperTheme.colors.onSurfaceVariant;

  const iconSize = getSizeValue(size);
  const isInteractive = interactive && !readOnly;
  const displayRating = hoverRating !== null ? hoverRating : rating;

  const getIconName = (index: number, currentRating: number) => {
    const { filled, half, empty } = getIconNames(variant);
    
    if (currentRating >= index + 1) {
      return filled;
    } else if (allowHalf && currentRating >= index + 0.5) {
      return half;
    } else {
      return empty;
    }
  };

  const getIconColor = (index: number, currentRating: number) => {
    if (currentRating > index) {
      return activeColor;
    }
    return inactiveColor;
  };

  const handlePress = (index: number) => {
    if (!isInteractive) return;
    
    const newRating = index + 1;
    onRatingChange?.(newRating);
  };

  const handleHalfPress = (index: number) => {
    if (!isInteractive || !allowHalf) return;
    
    const newRating = index + 0.5;
    onRatingChange?.(newRating);
  };

  const renderIcon = (index: number) => {
    const iconName = getIconName(index, displayRating);
    const iconColor = getIconColor(index, displayRating);
    
    if (isInteractive) {
      return (
        <View key={index} style={styles.iconContainer}>
          {allowHalf && (
            <TouchableOpacity
              style={[styles.halfTouchArea, { width: iconSize / 2 }]}
              onPress={() => handleHalfPress(index)}
              onPressIn={() => setHoverRating(index + 0.5)}
              onPressOut={() => setHoverRating(null)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${index + 0.5} ${variant}s`}
            >
              <View style={styles.halfIconContainer}>
                <Ionicons
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.touchArea,
              allowHalf ? { width: iconSize / 2 } : { width: iconSize }
            ]}
            onPress={() => handlePress(index)}
            onPressIn={() => setHoverRating(index + 1)}
            onPressOut={() => setHoverRating(null)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${index + 1} ${variant}s`}
          >
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View key={index} style={styles.iconContainer}>
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </View>
    );
  };

  const renderValue = () => {
    if (!showValue && !showCount && !label) return null;

    return (
      <View style={styles.valueContainer}>
        {label && (
          <Typography 
            variant="body2" 
            style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}
          >
            {label}
          </Typography>
        )}
        {showValue && (
          <Typography 
            variant="body2" 
            weight="medium" 
            style={[styles.value, { color: paperTheme.colors.onSurface }]}
          >
            {rating.toFixed(allowHalf ? 1 : 0)}
          </Typography>
        )}
        {showCount && count !== undefined && (
          <Typography 
            variant="body2" 
            style={{ color: paperTheme.colors.onSurfaceVariant }}
          >
            ({count})
          </Typography>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconsContainer}>
        {Array.from({ length: maxRating }, (_, index) => renderIcon(index))}
      </View>
      {renderValue()}
    </View>
  );
}

// Helper functions
function getSizeValue(size: RatingSize): number {
  switch (size) {
    case 'sm':
      return 16;
    case 'md':
      return 20;
    case 'lg':
      return 24;
    default:
      return 20;
  }
}

function getIconNames(variant: RatingVariant) {
  switch (variant) {
    case 'star':
      return {
        filled: 'star' as const,
        half: 'star-half' as const,
        empty: 'star-outline' as const,
      };
    case 'heart':
      return {
        filled: 'heart' as const,
        half: 'heart-half' as const,
        empty: 'heart-outline' as const,
      };
    case 'thumb':
      return {
        filled: 'thumbs-up' as const,
        half: 'thumbs-up-outline' as const,
        empty: 'thumbs-up-outline' as const,
      };
    default:
      return {
        filled: 'star' as const,
        half: 'star-half' as const,
        empty: 'star-outline' as const,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  touchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  halfTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  halfIconContainer: {
    overflow: 'hidden',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  label: {
    marginRight: 4,
  },
  value: {
    marginRight: 4,
  },
});

// Predefined component variants for common use cases
export const StarRating = (props: Omit<RatingProps, 'variant'>) => (
  <Rating variant="star" {...props} />
);

export const HeartRating = (props: Omit<RatingProps, 'variant'>) => (
  <Rating variant="heart" {...props} />
);

export const InteractiveRating = (props: Omit<RatingProps, 'interactive'>) => (
  <Rating interactive {...props} />
);

export const ReadOnlyRating = (props: Omit<RatingProps, 'readOnly'>) => (
  <Rating readOnly {...props} />
); 