import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

import React from 'react';
import { ViewStyle } from 'react-native';

interface ScreenProps extends SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Screen component that provides SafeAreaView with consistent styling.
 * Use this component as the root for all screens to ensure proper safe area handling.
 * 
 * @example
 * ```tsx
 * export default function MyScreen() {
 *   return (
 *     <Screen>
 *       <Text>My screen content</Text>
 *     </Screen>
 *   );
 * }
 * ```
 */
export const Screen: React.FC<ScreenProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}; 