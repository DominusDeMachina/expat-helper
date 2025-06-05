const { getDefaultConfig } = require('expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

// Add network request handling for React Native
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = wrapWithReanimatedMetroConfig(config);
