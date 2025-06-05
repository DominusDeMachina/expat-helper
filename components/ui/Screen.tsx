import { View, ViewProps, ViewStyle } from 'react-native';

import { ReactNode } from 'react';

interface ScreenProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Screen component that provides a consistent container with flex: 1.
 * This replaces the previous SafeAreaView implementation.
 * 
 * @param children - The content to render inside the screen
 * @param style - Additional styles to apply
 * @param props - Other view props
 */
export function Screen({ children, style, ...props }: ScreenProps) {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
} 