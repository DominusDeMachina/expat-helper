import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from './Typography';

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
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'tint'
  );
  
  const loadingColor = color || themeColor;
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
          <ActivityIndicator
            size={size === 'sm' ? 'small' : 'large'}
            color={loadingColor}
          />
        );

      case 'skeleton':
        return (
          <SkeletonComponent
            width={sizeValue}
            height={sizeValue / 4}
            color={loadingColor}
          />
        );

      case 'progress':
        return (
          <ProgressBar
            progress={progress}
            width={sizeValue}
            height={sizeValue / 8}
            color={loadingColor}
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
          <ActivityIndicator
            size={size === 'sm' ? 'small' : 'large'}
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      {renderContent()}
      {text && (
        <Typography
          variant="body2"
          color="muted"
          style={{ marginTop: 12 }}
        >
          {text}
        </Typography>
      )}
    </View>
  );
}

// Helper Components
function SkeletonComponent({ width, height, color }: { width: number; height: number; color: string }) {
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

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[
          styles.skeletonBar,
          {
            width,
            height,
            backgroundColor: color,
            opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonBar,
          {
            width: width * 0.7,
            height,
            backgroundColor: color,
            opacity,
            marginTop: 8,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonBar,
          {
            width: width * 0.9,
            height,
            backgroundColor: color,
            opacity,
            marginTop: 8,
          },
        ]}
      />
    </View>
  );
}

function ProgressBar({ progress, width, height, color }: { progress: number; width: number; height: number; color: string }) {
  const backgroundColor = useThemeColor({}, 'border');
  const progressWidth = (progress / 100) * width;

  return (
    <View style={[styles.progressContainer, { width, height, backgroundColor }]}>
      <View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
            height,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function DotsComponent({ animatedValue, size, color }: { animatedValue: Animated.Value; size: number; color: string }) {
  const scale1 = animatedValue.interpolate({
    inputRange: [0, 0.2, 0.4, 1],
    outputRange: [1, 1.5, 1, 1],
  });

  const scale2 = animatedValue.interpolate({
    inputRange: [0, 0.2, 0.6, 1],
    outputRange: [1, 1, 1.5, 1],
  });

  const scale3 = animatedValue.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: [1, 1, 1, 1.5],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: scale1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: scale2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: scale3 }],
          },
        ]}
      />
    </View>
  );
}

function PulseComponent({ animatedValue, size, color }: { animatedValue: Animated.Value; size: number; color: string }) {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.pulseContainer,
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

// Helper function
function getSizeValue(size: LoadingSize): number {
  switch (size) {
    case 'sm':
      return 80;
    case 'md':
      return 120;
    case 'lg':
      return 160;
    default:
      return 120;
  }
}

const styles = StyleSheet.create({
  skeletonContainer: {
    alignItems: 'flex-start',
  },
  skeletonBar: {
    borderRadius: 4,
  },
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 4,
  },
  pulseContainer: {
    borderRadius: 50,
  },
});

// Predefined component variants for common use cases
export const SpinnerLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator variant="spinner" {...props} />
);

export const SkeletonLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator variant="skeleton" {...props} />
);

export const ProgressLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator variant="progress" {...props} />
);

export const DotsLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator variant="dots" {...props} />
);

export const PulseLoader = (props: Omit<LoadingIndicatorProps, 'variant'>) => (
  <LoadingIndicator variant="pulse" {...props} />
); 