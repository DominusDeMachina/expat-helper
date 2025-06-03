# 🍽️ Expat Food Finder

A React Native mobile application designed to help expats find familiar food from their home countries in their current location. Whether you're craving authentic Italian pasta in Tokyo or looking for proper British tea in New York, this app connects you with local stores, restaurants, and markets that carry the foods you miss from home.

## 🌟 Features

- **Location-based Search**: Find nearby stores and restaurants that carry food from your home country
- **Multi-country Support**: Browse food options from various countries and cuisines
- **Interactive Maps**: View locations on an integrated map with directions
- **User Reviews & Ratings**: Read and write reviews for stores and specific products
- **Favorites & Wishlist**: Save your favorite places and create wishlists for hard-to-find items
- **Community Features**: Connect with other expats and share food discoveries
- **Offline Support**: Access saved locations and favorites even without internet

## 🚀 Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form
- **UI Components**: Custom components with Expo design system
- **Maps**: Google Maps integration
- **Storage**: React Native MMKV for fast local storage
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

## 📱 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio & Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GennadiyVSG/expat-food-finder.git
   cd expat-food-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   - Google Maps API key
   - Food data API keys (Spoonacular, Edamam)
   - Analytics keys (optional)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device testing

## 🛠️ Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Project Structure

```
expat-food/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── constants/            # App constants and configuration
├── hooks/               # Custom React hooks
├── assets/              # Images, fonts, and other assets
├── scripts/             # Build and utility scripts
└── tasks/              # Task Master project management
```

### Code Style

This project uses ESLint and Prettier for code consistency:
- ESLint configuration: `eslint.config.js`
- Prettier configuration: `.prettierrc`
- Run `npm run format` before committing

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for full list):

- `GOOGLE_MAPS_API_KEY` - Required for map functionality
- `SPOONACULAR_API_KEY` - For food data and recipes
- `EDAMAM_APP_ID` & `EDAMAM_APP_KEY` - Alternative food data source
- `API_BASE_URL` - Backend API endpoint

### API Keys Setup

1. **Google Maps API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps SDK for Android/iOS
   - Create API key and add to `.env`

2. **Food Data APIs**:
   - [Spoonacular](https://spoonacular.com/food-api) - Recipe and food data
   - [Edamam](https://developer.edamam.com/) - Nutrition and food database

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building

### Development Build
```bash
npx expo run:android
npx expo run:ios
```

### Production Build
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 🚀 Deployment

This app uses Expo's Over-The-Air (OTA) updates for seamless deployment:

```bash
# Publish update
npx expo publish

# Build for app stores
npx expo build:android --type app-bundle
npx expo build:ios --type archive
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing React Native framework
- [React Navigation](https://reactnavigation.org/) for navigation solutions
- Food data providers (Spoonacular, Edamam)
- The expat community for inspiration and feedback

## 📞 Support

- 📧 Email: support@expatfood.com
- 🐛 Issues: [GitHub Issues](https://github.com/GennadiyVSG/expat-food-finder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/GennadiyVSG/expat-food-finder/discussions)

---

Made with ❤️ for expats around the world 🌍
