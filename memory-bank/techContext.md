# Technical Context: Expat Food

## Technology Stack

### Core Framework
- **React Native**: 0.79.2 - Latest stable version for cross-platform development
- **Expo SDK**: 53.0.9 - Managed workflow for rapid development and deployment
- **TypeScript**: 5.8.3 - Type safety and better developer experience
- **Expo Router**: 5.0.6 - File-based routing with typed routes enabled

### State Management & Data
- **Zustand**: 5.0.5 - Lightweight state management for global app state
- **TanStack React Query**: 5.77.2 - Server state management and caching
- **React Native MMKV**: 3.2.0 - High-performance local storage
- **React Hook Form**: 7.56.4 - Form handling and validation

### UI & Navigation
- **React Navigation**: 7.1.6 - Navigation library with bottom tabs
- **Expo Vector Icons**: 14.1.0 - Icon library for UI elements
- **React Native Reanimated**: 3.17.4 - High-performance animations
- **React Native Gesture Handler**: 2.24.0 - Touch gesture handling
- **Shopify Flash List**: 1.7.6 - Optimized list rendering

### Platform-Specific Features
- **Expo Image**: 2.1.7 - Optimized image loading and caching
- **Expo Blur**: 14.1.4 - Native blur effects
- **Expo Haptics**: 14.1.4 - Tactile feedback
- **Expo Linking**: 7.1.5 - Deep linking and external app integration
- **React Native WebView**: 13.13.5 - In-app web content display

### Development Tools
- **ESLint**: 9.25.0 with Expo config - Code linting and formatting
- **Babel**: 7.25.2 - JavaScript compilation
- **Metro**: Default bundler for React Native

## Project Architecture

### File Structure
```
expat-food/
├── app/                    # File-based routing
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.tsx      # Home tab
│   │   └── explore.tsx    # Explore tab
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── ThemedText.tsx    # Themed text component
│   ├── ThemedView.tsx    # Themed view component
│   └── ParallaxScrollView.tsx
├── constants/            # App constants and configuration
├── hooks/               # Custom React hooks
├── assets/              # Static assets (images, fonts)
├── memory-bank/         # Project documentation
└── scripts/             # Build and utility scripts
```

### Navigation Structure
- **File-based Routing**: Using Expo Router for automatic route generation
- **Tab Navigation**: Bottom tab bar for main app sections
- **Typed Routes**: TypeScript integration for route safety
- **Deep Linking**: Support for external app integration

### Component Architecture
- **Themed Components**: Consistent theming system with light/dark mode support
- **Reusable UI**: Modular component library in `components/ui/`
- **Custom Hooks**: Shared logic in dedicated hooks directory
- **Parallax Effects**: Advanced scrolling animations for enhanced UX

## Development Environment

### Prerequisites
- **Node.js**: 18+ (recommended LTS version)
- **npm**: Package manager (included with Node.js)
- **Expo CLI**: Global installation for development commands
- **iOS Simulator**: Xcode required for iOS development (macOS only)
- **Android Studio**: Required for Android development

### Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo run:ios
npx expo run:android
npx expo start --web

# Reset project (remove template code)
npm run reset-project
```

### Development Workflow
1. **Local Development**: Expo development server with hot reloading
2. **Device Testing**: Expo Go app for quick testing on physical devices
3. **Platform Testing**: iOS Simulator and Android Emulator
4. **Web Testing**: Browser-based testing for web compatibility

## Build Configuration

### App Configuration (app.json)
- **Bundle Identifiers**: 
  - iOS: `com.furduy.expatfood`
  - Android: `com.furduy.expatfood`
- **Orientation**: Portrait mode only
- **New Architecture**: Enabled for performance improvements
- **Edge-to-Edge**: Android edge-to-edge display support

### Platform-Specific Settings
- **iOS**: Tablet support enabled, custom bundle identifier
- **Android**: Adaptive icon with white background, edge-to-edge enabled
- **Web**: Metro bundler with static output, custom favicon

### Splash Screen
- **Image**: Custom splash icon (200px width)
- **Background**: White background
- **Resize Mode**: Contain for proper scaling

## Performance Considerations

### Optimization Strategies
- **Flash List**: High-performance list rendering for large datasets
- **Image Optimization**: Expo Image for efficient image loading and caching
- **MMKV Storage**: Fast local storage for user preferences and cache
- **React Query**: Intelligent caching and background updates
- **Reanimated**: 60fps animations running on UI thread

### Bundle Size Management
- **Tree Shaking**: Automatic removal of unused code
- **Platform-Specific Code**: Conditional imports for platform features
- **Asset Optimization**: Compressed images and optimized fonts

## Security & Privacy

### Data Protection
- **Local Storage**: Sensitive data stored securely with MMKV
- **API Communication**: HTTPS-only for all network requests
- **User Privacy**: Minimal data collection with explicit consent

### Platform Compliance
- **iOS App Store**: Compliance with Apple's privacy guidelines
- **Google Play**: Android privacy policy requirements
- **GDPR**: European data protection regulation compliance

## Deployment Strategy

### Development Builds
- **Expo Development Builds**: Custom native code integration
- **Over-the-Air Updates**: Instant updates without app store approval
- **Preview Builds**: Shareable builds for testing and feedback

### Production Deployment
- **App Store**: iOS deployment through Apple App Store
- **Google Play**: Android deployment through Google Play Store
- **Web Deployment**: Static site hosting for web version

## Technical Constraints

### Platform Limitations
- **iOS**: Requires Apple Developer account for distribution
- **Android**: Google Play Console account required
- **Web**: Limited native features compared to mobile platforms

### Performance Targets
- **App Launch**: Under 3 seconds on mid-range devices
- **Navigation**: Smooth 60fps transitions
- **List Scrolling**: No frame drops with 1000+ items
- **Image Loading**: Progressive loading with placeholder states

### Compatibility Requirements
- **iOS**: Minimum iOS 13.0 support
- **Android**: Minimum API level 21 (Android 5.0)
- **Web**: Modern browsers with ES6 support

## Future Technical Considerations

### Scalability Planning
- **Backend Integration**: API design for restaurant and user data
- **Real-time Features**: WebSocket integration for live updates
- **Offline Support**: Enhanced offline capabilities with local database
- **Push Notifications**: User engagement and update notifications

### Technology Evolution
- **React Native Updates**: Regular framework updates for performance
- **Expo SDK Updates**: New features and platform capabilities
- **New Architecture**: Migration to React Native's new architecture
- **Performance Monitoring**: Analytics and crash reporting integration 