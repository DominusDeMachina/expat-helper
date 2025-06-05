# System Patterns: Expat Food

## Architecture Overview

### Application Architecture

The Expat Food app follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (React Native Components & Screens)│
├─────────────────────────────────────┤
│           Business Logic Layer      │
│     (Custom Hooks & State Mgmt)    │
├─────────────────────────────────────┤
│           Data Access Layer         │
│    (API Clients & Local Storage)   │
├─────────────────────────────────────┤
│           Platform Layer            │
│      (Expo APIs & Native Modules)  │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
App Root (_layout.tsx)
├── Tab Navigation ((tabs)/_layout.tsx)
│   ├── Home Screen (index.tsx)
│   ├── Explore Screen (explore.tsx)
│   └── [Future Tabs]
├── Modal Screens
├── Auth Screens
└── Utility Screens (+not-found.tsx)
```

## Design Patterns

### 1. Screen Container Pattern

**Usage**: All screens use a consistent container approach with flex: 1 for full-screen layout

**Implementation**:
```typescript
// Reusable Screen Component (Recommended)
import { Screen } from '@/components/ui/Screen';

export default function MyScreen() {
  return (
    <Screen>
      {/* Screen content */}
    </Screen>
  );
}

// Direct View Usage (Alternative)
import { View } from 'react-native';

export default function MyScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Screen content */}
    </View>
  );
}

// ThemedView for Theme Support
import { ThemedView } from '@/components/ThemedView';

export default function MyScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Screen content */}
    </ThemedView>
  );
}
```

**Pattern Requirements**:
- ✅ Consistent container pattern across all screens
- ✅ Reusable Screen component available for consistency
- ✅ Full-screen layout using flex: 1
- ✅ Theme-aware containers using ThemedView when needed

**Examples**:
- Auth screen: Uses View with flex: 1 as container
- Not-found screen: Uses ThemedView for theme-aware container
- Tab screens: Use ParallaxScrollView or Screen component
- Custom screens: Use Screen component for consistency

### 2. Composition Pattern

**Usage**: Building complex UI components from smaller, reusable pieces

```typescript
// Example: Restaurant Card Component
<Card>
  <CardHeader>
    <RestaurantImage />
    <FavoriteButton />
  </CardHeader>
  <CardContent>
    <RestaurantInfo />
    <RatingDisplay />
  </CardContent>
  <CardActions>
    <DirectionsButton />
    <CallButton />
  </CardActions>
</Card>
```

**Benefits**:

- Highly reusable components
- Easy to test individual pieces
- Flexible layout arrangements

### 3. Container/Presenter Pattern

**Usage**: Separating data logic from presentation logic

```typescript
// Container Component (handles data)
const RestaurantListContainer = () => {
  const { data, loading, error } = useRestaurants();
  return <RestaurantListPresenter restaurants={data} loading={loading} />;
};

// Presenter Component (handles UI)
const RestaurantListPresenter = ({ restaurants, loading }) => {
  if (loading) return <LoadingSpinner />;
  return <FlashList data={restaurants} renderItem={RestaurantCard} />;
};
```

### 4. Custom Hook Pattern

**Usage**: Encapsulating reusable business logic

```typescript
// Location Hook
const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Location logic
  }, []);

  return { location, error, requestPermission };
};

// API Hook
const useRestaurants = filters => {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => fetchRestaurants(filters),
  });
};
```

### 5. Provider Pattern

**Usage**: Sharing global state and context

```typescript
// Theme Provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// User Provider
const UserProvider = ({ children }) => {
  const [user, setUser] = useMMKVObject('user');
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

## State Management Patterns

### Global State (Zustand)

```typescript
interface AppState {
  user: User | null;
  preferences: UserPreferences;
  setUser: (user: User) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const useAppStore = create<AppState>(set => ({
  user: null,
  preferences: defaultPreferences,
  setUser: user => set({ user }),
  updatePreferences: prefs =>
    set(state => ({
      preferences: { ...state.preferences, ...prefs },
    })),
}));
```

### Server State (React Query)

```typescript
// Query Keys Factory
const queryKeys = {
  restaurants: {
    all: ['restaurants'] as const,
    lists: () => [...queryKeys.restaurants.all, 'list'] as const,
    list: (filters: RestaurantFilters) =>
      [...queryKeys.restaurants.lists(), filters] as const,
    details: () => [...queryKeys.restaurants.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.restaurants.details(), id] as const,
  },
};

// Query Hooks
const useRestaurants = (filters: RestaurantFilters) => {
  return useQuery({
    queryKey: queryKeys.restaurants.list(filters),
    queryFn: () => restaurantApi.getRestaurants(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Local State (React Hook Form)

```typescript
const RestaurantReviewForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      rating: 0,
      comment: '',
      photos: [],
    },
  });

  const onSubmit = (data) => {
    // Submit review
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="rating"
        rules={{ required: 'Rating is required' }}
        render={({ field }) => <StarRating {...field} />}
      />
    </Form>
  );
};
```

## Navigation Patterns

### File-Based Routing Structure

```
app/
├── _layout.tsx                 # Root layout with providers
├── (tabs)/                     # Tab group
│   ├── _layout.tsx            # Tab navigation layout
│   ├── index.tsx              # Home tab
│   ├── explore.tsx            # Explore tab
│   ├── favorites.tsx          # Favorites tab
│   └── profile.tsx            # Profile tab
├── restaurant/                 # Restaurant stack
│   ├── [id].tsx              # Restaurant details
│   └── review.tsx            # Add review
├── auth/                      # Authentication stack
│   ├── login.tsx             # Login screen
│   └── register.tsx          # Registration screen
└── +not-found.tsx            # 404 page
```

### Navigation Hooks

```typescript
// Typed navigation hook
const useTypedNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamList>>();
};

// Route parameters hook
const useRestaurantId = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return id;
};
```

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action → Event Handler → State Update → UI Re-render
     ↑                                           ↓
     └─────────── Side Effects ←─────────────────┘
```

### API Integration Pattern

```typescript
// API Client Structure
class RestaurantApiClient {
  private baseURL = 'https://api.expatfood.com';

  async getRestaurants(filters: RestaurantFilters): Promise<Restaurant[]> {
    const response = await fetch(`${this.baseURL}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    return response.json();
  }
}

// Error Boundary Pattern
const ApiErrorBoundary = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorScreen error={error} onRetry={resetErrorBoundary} />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

## UI Patterns

### Theming System

```typescript
// Theme Definition
const lightTheme = {
  colors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#333333',
    textSecondary: '#666666',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16, fontWeight: 'normal' },
  },
};

// Themed Component Pattern
const ThemedText = ({ type = 'body', style, ...props }) => {
  const theme = useTheme();
  return (
    <Text
      style={[theme.typography[type], { color: theme.colors.text }, style]}
      {...props}
    />
  );
};
```

### Loading States Pattern

```typescript
// Skeleton Loading
const RestaurantCardSkeleton = () => (
  <View style={styles.card}>
    <SkeletonPlaceholder>
      <View style={styles.image} />
      <View style={styles.title} />
      <View style={styles.subtitle} />
    </SkeletonPlaceholder>
  </View>
);

// Progressive Loading
const RestaurantImage = ({ uri, placeholder }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View>
      {loading && <ImagePlaceholder />}
      <Image
        source={{ uri }}
        onLoadEnd={() => setLoading(false)}
        style={[styles.image, loading && styles.hidden]}
      />
    </View>
  );
};
```

### List Optimization Pattern

```typescript
// Optimized List Rendering
const RestaurantList = ({ restaurants }) => {
  const renderItem = useCallback(({ item }) => (
    <RestaurantCard restaurant={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlashList
      data={restaurants}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={120}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

## Performance Patterns

### Memoization Strategy

```typescript
// Component Memoization
const RestaurantCard = memo(({ restaurant }) => {
  return (
    <Card>
      <RestaurantInfo restaurant={restaurant} />
    </Card>
  );
});

// Hook Memoization
const useFilteredRestaurants = (restaurants, filters) => {
  return useMemo(() => {
    return restaurants.filter(restaurant =>
      matchesFilters(restaurant, filters)
    );
  }, [restaurants, filters]);
};
```

### Lazy Loading Pattern

```typescript
// Component Lazy Loading
const RestaurantDetails = lazy(() => import('./RestaurantDetails'));

// Image Lazy Loading
const LazyImage = ({ uri, ...props }) => {
  const [inView, setInView] = useState(false);

  return (
    <View onLayout={() => setInView(true)}>
      {inView ? (
        <Image source={{ uri }} {...props} />
      ) : (
        <ImagePlaceholder {...props} />
      )}
    </View>
  );
};
```

## Error Handling Patterns

### Graceful Degradation

```typescript
// Network Error Handling
const useRestaurantsWithFallback = filters => {
  const query = useRestaurants(filters);
  const cachedData = useMMKVObject('cached_restaurants');

  if (query.error && !query.data) {
    return { ...query, data: cachedData };
  }

  return query;
};

// Feature Availability Check
const useLocationWithFallback = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Use browser geolocation
    } else {
      // Use Expo Location
    }
  }, []);

  return { location, error };
};
```

## Testing Patterns

### Component Testing Structure

```typescript
// Test Utilities
const renderWithProviders = (component, options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </QueryClientProvider>,
    options
  );
};

// Mock Patterns
const mockRestaurant = {
  id: '1',
  name: 'Test Restaurant',
  cuisine: 'Italian',
  rating: 4.5,
};

// Test Structure
describe('RestaurantCard', () => {
  it('displays restaurant information correctly', () => {
    renderWithProviders(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });
});
```
