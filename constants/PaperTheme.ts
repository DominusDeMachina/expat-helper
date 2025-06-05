import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

import { Colors } from './Colors';

const fontConfig = {
  fontFamily: 'System',
};

export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    primaryContainer: Colors.light.tint + '20',
    secondary: Colors.light.icon,
    secondaryContainer: Colors.light.tabIconDefault + '20',
    tertiary: Colors.light.text,
    surface: Colors.light.card,
    surfaceVariant: Colors.light.background,
    background: Colors.light.background,
    error: Colors.light.notification,
    errorContainer: Colors.light.notification + '20',
    onPrimary: Colors.light.background,
    onSecondary: Colors.light.text,
    onSurface: Colors.light.text,
    onBackground: Colors.light.text,
    outline: Colors.light.tabIconDefault,
    outlineVariant: Colors.light.tabIconDefault + '50',
    inverseSurface: Colors.dark.card,
    inverseOnSurface: Colors.dark.text,
    inversePrimary: Colors.dark.tint,
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint,
    primaryContainer: Colors.dark.tint + '20',
    secondary: Colors.dark.icon,
    secondaryContainer: Colors.dark.tabIconDefault + '20',
    tertiary: Colors.dark.text,
    surface: Colors.dark.card,
    surfaceVariant: Colors.dark.background,
    background: Colors.dark.background,
    error: Colors.dark.notification,
    errorContainer: Colors.dark.notification + '20',
    onPrimary: Colors.dark.background,
    onSecondary: Colors.dark.text,
    onSurface: Colors.dark.text,
    onBackground: Colors.dark.text,
    outline: Colors.dark.tabIconDefault,
    outlineVariant: Colors.dark.tabIconDefault + '50',
    inverseSurface: Colors.light.card,
    inverseOnSurface: Colors.light.text,
    inversePrimary: Colors.light.tint,
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(255, 255, 255, 0.5)',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export type PaperTheme = typeof paperLightTheme; 