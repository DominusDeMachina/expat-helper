import {
    Animated,
    Easing,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import {
    ActivityIndicator as PaperActivityIndicator,
    ProgressBar as PaperProgressBar,
    useTheme
} from 'react-native-paper';
import React, { useEffect, useRef } from 'react';

import { Typography } from './Typography';
import { useThemeColor } from '@/hooks/useThemeColor';

export type LoadingVariant = 'spinner' | 'skeleton' | 'progress' | 'dots' | 'pulse';
export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingIndicatorProps {
  /** Visual variant of the loading indicator */
  variant?: LoadingVariant;
  /** Size of the loading indicator */
  size?: LoadingSize;
  /** Progress value for progress variant (0-100) */
  progress?: number;
  /** Loading text to display */
  text?: string;
  /** Color of the loading indicator */
  color?: string;
  /** Whether to show loading indicator fullscreen */
  fullscreen?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export function LoadingIndicator({
  variant = 'spinner',
  size = 'md',
  progress = 0,
  text,
  color,
  fullscreen = false,
  style,
  lightColor,
  darkColor,
}: LoadingIndicatorProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const paperTheme = useTheme();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'tint'
  );
  
  // Use Paper theme primary color as fallback
  const loadingColor = color || themeColor || paperTheme.colors.primary;
  const sizeValue = getSizeValue(size);

  useEffect(() => {
    if (variant === 'dots' || variant === 'pulse') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [variant, animatedValue]);

  const renderContent = () => {
    switch (variant) {
      case 'spinner':
        return (
          <PaperActivityIndicator
            size={getPaperSize(size)}
            animating={true}
            color={loadingColor}
          />
        );

      case 'skeleton':
        return (
          <SkeletonComponent
            width={sizeValue}
            height={sizeValue / 4}
            color={loadingColor}
            theme={paperTheme}
          />
        );

      case 'progress':
        return (
          <PaperProgressBar
            progress={progress / 100}
            color={loadingColor}
            style={[
              styles.progressBar,
              {
                width: sizeValue,
                height: sizeValue / 8,
              }
            ]}
          />
        );

      case 'dots':
        return (
          <DotsComponent
            animatedValue={animatedValue}
            size={sizeValue / 8}
            color={loadingColor}
          />
        );

      case 'pulse':
        return (
          <PulseComponent
            animatedValue={animatedValue}
            size={sizeValue}
            color={loadingColor}
          />
        );

      default:
        return (
          <PaperActivityIndicator
            size={getPaperSize(size)}
            animating={true}
            color={loadingColor}
          />
        );
    }
  };

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullscreen && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: paperTheme.colors.backdrop,
      zIndex: 1000,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      {renderContent()}
      {text && (
        <Typography
          variant="body2"
          style={[
            styles.loadingText,
            { color: paperTheme.colors.onSurfaceVariant }
          ]}
        >
          {text}
        </Typography>
      )}
    </View>
  );
}

// Helper function to map size to Paper size
function getPaperSize(size: LoadingSize): 'small' | 'large' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'md':
    case 'lg':
      return 'large';
    default:
      return 'large';
  }
}

// Helper Components
function SkeletonComponent({ 
  width, 
  height, 
  color, 
  theme 
}: { 
  width: number; 
  height: number; 
  color: string;
  theme: any;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Use theme colors for skeleton with fallback
  const skeletonColor = color || theme.colors.surfaceVariant;

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[
          styles.skeletonBar,
          {
            width,
            height,
            backgroundColor: skeletonColor,
            opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonBar,
          {
            width: width * 0.6,
            height,
            backgroundColor: skeletonColor,
            marginTop: height / 2,
            opacity,
          },
        ]}
      />
    </View>
  );
}

function DotsComponent({ 
  animatedValue, 
  size, 
  color 
}: { 
  animatedValue: Animated.Value; 
  size: number; 
  color: string;
}) {
  const dot1Opacity = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.4, 1, 0.4, 0.4, 0.4],
  });

  const dot2Opacity = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.4, 0.4, 1, 0.4, 0.4],
  });

  const dot3Opacity = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.4, 0.4, 0.4, 1, 0.4],
  });

  const dot4Opacity = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0.4, 0.4, 0.4, 0.4, 1],
  });

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    marginHorizontal: size / 4,
  };

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[dotStyle, { opacity: dot1Opacity }]} />
      <Animated.View style={[dotStyle, { opacity: dot2Opacity }]} />
      <Animated.View style={[dotStyle, { opacity: dot3Opacity }]} />
      <Animated.View style={[dotStyle, { opacity: dot4Opacity }]} />
    </View>
  );
}

function PulseComponent({ 
  animatedValue, 
  size, 
  color 
}: { 
  animatedValue: Animated.Value; 
  size: number; 
  color: string;
}) {
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 0.5],
  });

  return (
    <Animated.View
      style={[
        styles.pulseCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

function getSizeValue(size: LoadingSize): number {
  switch (size) {
    case 'sm':
      return 40;
    case 'md':
      return 80;
    case 'lg':
      return 120;
    default:
      return 80;
  }
}

const styles = StyleSheet.create({
  skeletonContainer: {
    alignItems: 'flex-start',
  },
  skeletonBar: {
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    alignSelf: 'center',
  },
  progressBar: {
    borderRadius: 4,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
});

// Convenience components for common loading variants
export const SpinnerLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator {...props} variant="spinner" />
);

export const SkeletonLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator {...props} variant="skeleton" />
);

export const ProgressLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator {...props} variant="progress" />
);

export const DotsLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator {...props} variant="dots" />
);

export const PulseLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator {...props} variant="pulse" />
); 