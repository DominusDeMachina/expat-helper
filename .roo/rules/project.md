---
description:
globs:
alwaysApply: false
---

# Expat Food Project Rules

## Project Overview

This is a React Native app built with Expo that helps expatriates find authentic food from their home countries. The app focuses on community-driven restaurant discovery and reviews.

## Core Principles

### Code Quality

- **TypeScript First**: All new code must be written in TypeScript with proper type definitions
- **Functional Components**: Use functional components with hooks, avoid class components
- **Composition over Inheritance**: Build complex components from smaller, reusable pieces
- **Performance Focused**: Optimize for 60fps animations and smooth scrolling

### Architecture Patterns

- **File-based Routing**: Use Expo Router's file-based routing system
- **Custom Hooks**: Extract business logic into reusable custom hooks
- **Container/Presenter**: Separate data logic from presentation logic
- **Themed Components**: Use the established theming system for all UI components

## Technology Stack Preferences

### State Management

- **Global State**: Use Zustand for app-wide state (user, preferences, settings)
- **Server State**: Use TanStack React Query for API data and caching
- **Local Storage**: Use MMKV for high-performance local storage
- **Form State**: Use React Hook Form for form handling and validation

### UI Components

- **Custom Components**: Build custom themed components rather than using external UI libraries
- **Theming**: Always use ThemedText and ThemedView for consistent theming
- **Icons**: Use Expo Vector Icons for all iconography
- **Images**: Use Expo Image for optimized image loading and caching
- **Lists**: Use Shopify FlashList for high-performance list rendering

### Navigation

- **Primary Navigation**: Tab-based navigation for main app sections
- **Secondary Navigation**: Stack navigation for detail screens and flows
- **Deep Linking**: Support deep linking for restaurant details and sharing
- **Typed Routes**: Use TypeScript for route parameter validation

## File Organization

### Directory Structure

```
app/                    # File-based routing
├── (tabs)/            # Tab navigation group
├── restaurant/        # Restaurant-related screens
├── auth/             # Authentication screens
└── _layout.tsx       # Root layout

components/            # Reusable UI components
├── ui/               # Base UI components
├── restaurant/       # Restaurant-specific components
└── common/           # Shared components

hooks/                # Custom React hooks
├── api/              # API-related hooks
├── storage/          # Storage-related hooks
└── location/         # Location-related hooks

stores/               # Zustand stores
├── userStore.ts      # User state management
├── appStore.ts       # App-wide settings
└── restaurantStore.ts # Restaurant data cache

types/                # TypeScript type definitions
├── api.ts            # API response types
├── restaurant.ts     # Restaurant-related types
└── user.ts           # User-related types
```

### Naming Conventions

- **Components**: PascalCase (e.g., `RestaurantCard.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useRestaurants.ts`)
- **Stores**: camelCase ending with "Store" (e.g., `userStore.ts`)
- **Types**: PascalCase for interfaces, camelCase for type aliases
- **Files**: kebab-case for non-component files (e.g., `api-client.ts`)

## Component Patterns

### Component Structure

```typescript
// 1. Imports (React, libraries, local)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '@/components';

// 2. Types
interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
}

// 3. Component
export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
}) => {
  // 4. Hooks and state
  const theme = useTheme();

  // 5. Event handlers
  const handlePress = () => {
    onPress?.();
  };

  // 6. Render
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{restaurant.name}</ThemedText>
    </ThemedView>
  );
};

// 7. Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
```

### Hook Patterns

```typescript
// API Hooks
export const useRestaurants = (filters: RestaurantFilters) => {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => restaurantApi.getRestaurants(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Storage Hooks
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useMMKVObject('user_preferences');

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences(prev => ({ ...prev, ...updates }));
    },
    [setPreferences]
  );

  return { preferences, updatePreferences };
};
```

## Performance Guidelines

### List Optimization

- Always use FlashList for lists with more than 20 items
- Implement proper keyExtractor and renderItem memoization
- Use getItemType for heterogeneous lists
- Set appropriate estimatedItemSize

### Image Optimization

- Use Expo Image for all images
- Implement progressive loading with placeholders
- Compress images appropriately for mobile
- Use appropriate cache policies

### Memory Management

- Memoize expensive calculations with useMemo
- Memoize callbacks with useCallback
- Use React.memo for pure components
- Clean up subscriptions and timers in useEffect

## Error Handling

### API Errors

```typescript
const { data, error, isLoading } = useRestaurants(filters);

if (error) {
  return <ErrorScreen error={error} onRetry={() => refetch()} />;
}
```

### Error Boundaries

- Wrap major sections in error boundaries
- Provide meaningful error messages to users
- Log errors for debugging and monitoring
- Implement graceful fallbacks

## Testing Patterns

### Component Testing

```typescript
import { renderWithProviders } from '@/test-utils';

describe('RestaurantCard', () => {
  it('displays restaurant information correctly', () => {
    const mockRestaurant = createMockRestaurant();
    renderWithProviders(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(mockRestaurant.name)).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react-hooks';

describe('useRestaurants', () => {
  it('fetches restaurants with filters', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useRestaurants({ cuisine: 'Italian' })
    );

    await waitForNextUpdate();
    expect(result.current.data).toBeDefined();
  });
});
```

## Accessibility

### Requirements

- All interactive elements must have accessible labels
- Support for screen readers and voice control
- Proper color contrast ratios (WCAG AA)
- Keyboard navigation support for web
- Semantic HTML elements for web version

### Implementation

```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel={`View details for ${restaurant.name}`}
  accessibilityHint="Opens restaurant detail screen"
>
  <RestaurantCard restaurant={restaurant} />
</TouchableOpacity>
```

## Internationalization

### Text Management

- All user-facing text must be externalized
- Use i18n library for text management
- Support for RTL languages
- Cultural considerations for date/time formatting

### Implementation

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

return (
  <ThemedText>{t('restaurant.rating', { rating: restaurant.rating })}</ThemedText>
);
```

## Security Considerations

### Data Protection

- Never store sensitive data in plain text
- Use MMKV's encryption for sensitive local data
- Validate all user inputs
- Sanitize data before displaying

### API Security

- Use HTTPS for all API communications
- Implement proper authentication tokens
- Validate API responses before using
- Handle authentication errors gracefully

## Development Workflow

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components follow established patterns
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Error handling implemented
- [ ] Tests written for new functionality

### Git Conventions

- **Commit Messages**: Use conventional commits format
- **Branch Names**: feature/description, fix/description, refactor/description
- **Pull Requests**: Include description, screenshots, and testing notes

## Common Patterns to Follow

### Loading States

```typescript
if (isLoading) return <RestaurantListSkeleton />;
if (error) return <ErrorScreen error={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState message="No restaurants found" />;

return <RestaurantList restaurants={data} />;
```

### Form Handling

```typescript
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  defaultValues: { rating: 0, comment: '' },
});

const onSubmit = async data => {
  try {
    await submitReview(data);
    navigation.goBack();
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

### Navigation

```typescript
// Use typed navigation
const navigation = useNavigation<NavigationProp<RootStackParamList>>();

// Navigate with parameters
navigation.navigate('restaurant/[id]', { id: restaurant.id });

// Use router for simple navigation
import { router } from 'expo-router';
router.push(`/restaurant/${restaurant.id}`);
```

## Project-Specific Considerations

### Expat User Experience

- Always consider users in foreign countries with limited local knowledge
- Provide clear cultural context for food and restaurants
- Support multiple languages and cultural preferences
- Consider offline functionality for areas with poor connectivity

### Restaurant Data

- Prioritize authenticity and cultural accuracy
- Support multiple cuisine types and regional variations
- Handle restaurant closures and changes gracefully
- Implement robust search_files and filtering for diverse food preferences

### Community Features

- Encourage helpful, constructive reviews
- Implement moderation for inappropriate content
- Support photo sharing with proper compression
- Build trust through verified reviews and user profiles
