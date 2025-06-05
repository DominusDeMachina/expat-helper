# Component Library Guide

A comprehensive guide to all UI components in the Expat Food Finder application, built with React Native Paper and custom enhancements.

## Overview

Our component library combines React Native Paper's Material Design 3 components with custom wrappers and enhancements specifically designed for the expat food discovery experience. All components are:

- **Theme-aware**: Integrated with React Native Paper's theming system
- **Accessible**: Built with screen readers and accessibility in mind
- **Responsive**: Work seamlessly across mobile, tablet, and desktop
- **Type-safe**: Full TypeScript support with comprehensive interfaces
- **Consistent**: Follow Material Design 3 principles

## Component Categories

### Core Components
- [Button](#button) - Interactive elements with various styles and states
- [Input](#input) - Text input fields with validation and icons
- [Typography](#typography) - Text components with Material Design variants
- [LoadingIndicator](#loadingindicator) - Loading states and progress indicators

### Complex Components
- [Card](#card) - Content containers with images and actions
- [Rating](#rating) - Star ratings with interactive capabilities
- [ProductImage](#productimage) - Product photos with zoom and states
- [ErrorBoundary](#errorboundary) - Error handling and fallback UI

### Layout Components
- [Container](#container) - Responsive content containers
- [Row](#row) - Horizontal layout with gutters
- [Column](#column) - Responsive grid columns

## Import System

Components are exported from a central index file for easy importing:

```tsx
import { 
  Button, 
  Input, 
  Typography, 
  LoadingIndicator,
  Card,
  Rating,
  ProductImage,
  Container,
  Row,
  Column
} from '@/components/ui';
```

---

## Button

Material Design buttons with enhanced variants and states, built on React Native Paper's Button component.

### Basic Usage

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button
  title="Get Started"
  variant="primary"
  onPress={handlePress}
/>

// Secondary button
<Button
  title="Cancel"
  variant="secondary"
  onPress={handleCancel}
/>
```

### Variants

```tsx
// Primary button (contained mode)
<Button title="Primary" variant="primary" />

// Secondary button (outlined mode)
<Button title="Secondary" variant="secondary" />

// Text button (text mode)
<Button title="Text Only" variant="text" />

// Destructive button (custom styling)
<Button title="Delete" variant="destructive" />
```

### Sizes

```tsx
// Small button
<Button title="Small" size="sm" />

// Medium button (default)
<Button title="Medium" size="md" />

// Large button
<Button title="Large" size="lg" />
```

### States and Features

```tsx
// Loading state
<Button
  title="Save Product"
  loading={isLoading}
  onPress={handleSave}
/>

// Disabled state
<Button
  title="Unavailable"
  disabled
/>

// With icons (using Paper's icon prop)
<Button
  title="Add to Favorites"
  leftIcon="heart"
  variant="primary"
/>

<Button
  title="Next"
  rightIconName="arrow-forward"
  variant="secondary"
/>

// Full width
<Button
  title="Continue"
  fullWidth
/>
```

### Props Interface

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIconName?: string;
  fullWidth?: boolean;
  customColor?: string;
  style?: ViewStyle;
  testID?: string;
}
```

### Paper Integration

The Button component uses React Native Paper's `Button` component internally, with automatic mode mapping:
- `primary` variant → `contained` mode
- `secondary` variant → `outlined` mode
- `text` variant → `text` mode
- Custom theme integration for consistent styling

---

## Input

Enhanced text input fields with Material Design styling and validation, built on React Native Paper's TextInput.

### Basic Usage

```tsx
import { Input } from '@/components/ui';

<Input
  label="Product Name"
  placeholder="Enter product name..."
  value={productName}
  onChangeText={setProductName}
/>
```

### Variants

```tsx
// Outlined (default)
<Input variant="outlined" label="Outlined Input" />

// Flat/underlined
<Input variant="flat" label="Flat Input" />
```

### Input Types

```tsx
// Text input
<Input label="Product Name" />

// Number input
<Input 
  label="Price" 
  keyboardType="numeric"
  rightIcon="calculator"
/>

// Password input
<Input
  label="Password"
  secureTextEntry
  showPasswordToggle
/>

// Email input
<Input
  label="Email"
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### States

```tsx
// Default state
<Input label="Normal Input" />

// Success state (custom styling)
<Input
  label="Valid Input"
  state="success"
  helperText="Looks good!"
/>

// Error state
<Input
  label="Invalid Input"
  state="error"
  errorMessage="This field is required"
/>

// Disabled state
<Input
  label="Disabled Input"
  disabled
/>
```

### Icons and Features

```tsx
// Left icon
<Input
  label="Search Products"
  leftIcon="magnify"
/>

// Right icon
<Input
  label="Price"
  rightIcon="calculator"
/>

// Required field with helper text
<Input
  label="Required Field"
  required
  helperText="This field is required"
  helperTextType="info"
/>

// Multiline
<Input
  label="Description"
  multiline
  numberOfLines={4}
/>
```

### Props Interface

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: 'outlined' | 'flat';
  state?: 'default' | 'success' | 'error';
  leftIcon?: string;
  rightIcon?: string;
  helperText?: string;
  helperTextType?: 'info' | 'error' | 'success';
  errorMessage?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  testID?: string;
}
```

### Paper Integration

The Input component uses:
- React Native Paper's `TextInput` for the main input field
- React Native Paper's `HelperText` for validation messages
- Integrated theme colors and typography
- Automatic error state styling

---

## Typography

Material Design text components with comprehensive styling options, enhanced with React Native Paper's Text component.

### Basic Usage

```tsx
import { Typography, Heading1, BodyText, Caption } from '@/components/ui';

// Using Typography component
<Typography variant="displayMedium">Main Heading</Typography>
<Typography variant="bodyLarge">Body text content</Typography>

// Using convenience components
<Heading1>Main Heading</Heading1>
<BodyText>Body text content</BodyText>
<Caption>Small caption text</Caption>
```

### Material Design 3 Variants

```tsx
// Display text (largest)
<Typography variant="displayLarge">Display Large</Typography>
<Typography variant="displayMedium">Display Medium</Typography>
<Typography variant="displaySmall">Display Small</Typography>

// Headlines
<Typography variant="headlineLarge">Headline Large</Typography>
<Typography variant="headlineMedium">Headline Medium</Typography>
<Typography variant="headlineSmall">Headline Small</Typography>

// Titles
<Typography variant="titleLarge">Title Large</Typography>
<Typography variant="titleMedium">Title Medium</Typography>
<Typography variant="titleSmall">Title Small</Typography>

// Labels
<Typography variant="labelLarge">Label Large</Typography>
<Typography variant="labelMedium">Label Medium</Typography>
<Typography variant="labelSmall">Label Small</Typography>

// Body text
<Typography variant="bodyLarge">Body Large</Typography>
<Typography variant="bodyMedium">Body Medium</Typography>
<Typography variant="bodySmall">Body Small</Typography>
```

### Legacy Variants (for compatibility)

```tsx
// Traditional heading levels
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="h6">Heading 6</Typography>

// Body text
<Typography variant="body1">Primary body text</Typography>
<Typography variant="body2">Secondary body text</Typography>

// Specialized text
<Typography variant="subtitle1">Subtitle 1</Typography>
<Typography variant="subtitle2">Subtitle 2</Typography>
<Typography variant="caption">Caption text</Typography>
<Typography variant="overline">OVERLINE TEXT</Typography>
<Typography variant="button">BUTTON TEXT</Typography>
<Typography variant="link">Link text</Typography>
```

### Text Styling

```tsx
// Font weights
<Typography weight="light">Light text</Typography>
<Typography weight="normal">Normal text</Typography>
<Typography weight="medium">Medium text</Typography>
<Typography weight="semibold">Semibold text</Typography>
<Typography weight="bold">Bold text</Typography>

// Alignment
<Typography align="left">Left aligned</Typography>
<Typography align="center">Center aligned</Typography>
<Typography align="right">Right aligned</Typography>

// Text transforms
<Typography uppercase>UPPERCASE TEXT</Typography>
<Typography lowercase>lowercase text</Typography>
<Typography capitalize>Capitalized Text</Typography>

// Text decorations
<Typography italic>Italic text</Typography>
<Typography underline>Underlined text</Typography>
```

### Theme Color Integration

```tsx
// Using Paper theme colors
<Typography style={{ color: theme.colors.primary }}>Primary color</Typography>
<Typography style={{ color: theme.colors.onSurface }}>Surface text</Typography>
<Typography style={{ color: theme.colors.onSurfaceVariant }}>Muted text</Typography>

// Semantic colors (custom implementation)
<Typography color="success">Success message</Typography>
<Typography color="warning">Warning message</Typography>
<Typography color="error">Error message</Typography>
<Typography color="info">Info message</Typography>
```

### Convenience Components

```tsx
import { 
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  BodyText, SmallText, Caption, Link 
} from '@/components/ui';

<Heading1>Page Title</Heading1>
<Heading2>Section Title</Heading2>
<BodyText>Main content</BodyText>
<SmallText>Secondary content</SmallText>
<Caption>Image caption</Caption>
<Link href="/products">View Products</Link>
```

### Paper Integration

- Uses React Native Paper's `Text` component as the base
- Automatic Material Design 3 typography scale integration
- Theme-aware color system
- Proper accessibility roles and properties

---

## LoadingIndicator

Versatile loading components with multiple variants and animations, enhanced with React Native Paper's ActivityIndicator.

### Basic Usage

```tsx
import { 
  LoadingIndicator, 
  SpinnerLoader, 
  SkeletonLoader, 
  ProgressLoader 
} from '@/components/ui';

// Basic spinner (using Paper's ActivityIndicator)
<LoadingIndicator variant="spinner" />

// Using convenience components
<SpinnerLoader />
<SkeletonLoader />
<ProgressLoader progress={75} />
```

### Variants

```tsx
// Spinner loading (Paper ActivityIndicator)
<LoadingIndicator variant="spinner" size="md" />

// Skeleton loading (custom animation)
<LoadingIndicator variant="skeleton" size="md" />

// Progress bar (Paper ProgressBar)
<LoadingIndicator variant="progress" progress={60} />

// Animated dots (custom animation)
<LoadingIndicator variant="dots" size="md" />

// Pulse animation (custom animation)
<LoadingIndicator variant="pulse" size="md" />
```

### Sizes

```tsx
// Small
<LoadingIndicator variant="spinner" size="sm" />

// Medium (default)
<LoadingIndicator variant="spinner" size="md" />

// Large
<LoadingIndicator variant="spinner" size="lg" />
```

### Advanced Features

```tsx
// With loading text
<LoadingIndicator
  variant="spinner"
  text="Loading products..."
/>

// Progress with percentage
<LoadingIndicator
  variant="progress"
  progress={75}
  showProgress
/>

// Fullscreen overlay
<LoadingIndicator
  variant="spinner"
  fullscreen
  text="Please wait..."
/>

// Custom color (theme-aware)
<LoadingIndicator
  variant="spinner"
  color={theme.colors.primary}
/>
```

### Convenience Components

```tsx
import { 
  SpinnerLoader, 
  SkeletonLoader, 
  ProgressLoader, 
  DotsLoader, 
  PulseLoader 
} from '@/components/ui';

<SpinnerLoader size="md" />
<SkeletonLoader size="lg" />
<ProgressLoader progress={50} showProgress />
<DotsLoader size="sm" />
<PulseLoader size="md" />
```

### Paper Integration

- Spinner uses React Native Paper's `ActivityIndicator`
- Progress bars use React Native Paper's `ProgressBar`
- Theme color integration for consistent styling
- Accessibility improvements from Paper components

---

## Card

Material Design cards for content display with images and actions, built on React Native Paper's Card component.

### Basic Usage

```tsx
import { Card } from '@/components/ui';

<Card variant="elevated">
  <Card.Content>
    <Typography variant="titleMedium">Product Title</Typography>
    <Typography variant="bodyMedium">Product description</Typography>
  </Card.Content>
</Card>
```

### Variants

```tsx
// Elevated card (Paper Card with elevation)
<Card variant="elevated" />

// Outlined card (Paper Card with border)
<Card variant="outlined" />

// Filled card (Paper Surface with background)
<Card variant="filled" />
```

### Sizes

```tsx
// Small card
<Card size="sm" />

// Medium card (default)
<Card size="md" />

// Large card
<Card size="lg" />
```

### Card Sections (Paper Components)

```tsx
<Card variant="elevated">
  {/* Title section (Paper Card.Title) */}
  <Card.Title
    title="Product Name"
    subtitle="Brand Name"
    left={(props) => <Avatar.Icon {...props} icon="storefront" />}
  />
  
  {/* Cover image (Paper Card.Cover) */}
  <Card.Cover 
    source={{ uri: 'https://example.com/product.jpg' }}
  />
  
  {/* Content section (Paper Card.Content) */}
  <Card.Content>
    <Typography variant="bodyMedium">
      Product description goes here...
    </Typography>
  </Card.Content>
  
  {/* Action section (Paper Card.Actions) */}
  <Card.Actions>
    <Button title="View Details" variant="text" />
    <Button title="Add to List" variant="primary" />
  </Card.Actions>
</Card>
```

### Interactive Cards

```tsx
// Pressable card (Paper TouchableRipple)
<Card
  variant="elevated"
  pressable
  onPress={() => navigation.navigate('ProductDetails', { id })}
>
  <Card.Content>
    <Typography variant="titleMedium">Tap to view details</Typography>
  </Card.Content>
</Card>
```

### Paper Integration

- Uses React Native Paper's `Card` component as the base
- Supports all Paper Card sub-components (Title, Cover, Content, Actions)
- Integrated with Paper's `TouchableRipple` for interactions
- Theme-aware elevation and surface colors

---

## Rating

Interactive and display-only rating components with multiple icon styles.

### Basic Usage

```tsx
import { Rating } from '@/components/ui';

// Display rating
<Rating value={4.5} readOnly />

// Interactive rating
<Rating
  value={rating}
  onRatingChange={setRating}
  interactive
/>
```

### Variants

```tsx
// Star rating (default)
<Rating variant="star" value={4} />

// Heart rating
<Rating variant="heart" value={3} />

// Thumb rating
<Rating variant="thumb" value={5} />
```

### Sizes

```tsx
// Small rating
<Rating size="sm" value={4} />

// Medium rating (default)
<Rating size="md" value={4} />

// Large rating
<Rating size="lg" value={4} />
```

### Interactive Features

```tsx
// Interactive rating with half ratings
<Rating
  value={rating}
  onRatingChange={setRating}
  interactive
  allowHalfRating
/>

// With labels
<Rating
  value={rating}
  onRatingChange={setRating}
  showLabels
  labels={['Terrible', 'Bad', 'Average', 'Good', 'Excellent']}
/>

// Custom maximum rating
<Rating
  value={rating}
  onRatingChange={setRating}
  maxRating={10}
/>
```

### Theme Integration

The Rating component uses React Native Paper's theme system:
- Colors from `theme.colors.primary` and `theme.colors.onSurfaceVariant`
- Typography using Paper's text variants
- Accessible touch targets following Material Design guidelines

---

## ProductImage

Specialized image component for product photos with zoom and error handling, enhanced with React Native Paper's Surface.

### Basic Usage

```tsx
import { ProductImage } from '@/components/ui';

<ProductImage
  source={{ uri: 'https://example.com/product.jpg' }}
  alt="German Bread"
/>
```

### Sizes

```tsx
// Small image
<ProductImage size="sm" source={imageSource} />

// Medium image (default)
<ProductImage size="md" source={imageSource} />

// Large image
<ProductImage size="lg" source={imageSource} />

// Extra large image
<ProductImage size="xl" source={imageSource} />
```

### Variants

```tsx
// Rounded corners (default)
<ProductImage variant="rounded" source={imageSource} />

// Square image
<ProductImage variant="square" source={imageSource} />

// Circular image
<ProductImage variant="circle" source={imageSource} />
```

### Features

```tsx
// With zoom capability
<ProductImage
  source={imageSource}
  enableZoom
  alt="Product photo"
/>

// With loading placeholder (Paper ActivityIndicator)
<ProductImage
  source={imageSource}
  showLoading
  loadingText="Loading image..."
/>

// With error fallback
<ProductImage
  source={imageSource}
  showError
  errorText="Failed to load image"
  onError={handleImageError}
/>
```

### Paper Integration

- Uses React Native Paper's `Surface` component for consistent elevation
- Loading states use Paper's `ActivityIndicator`
- Error states styled with Paper theme colors
- Modal zoom interface uses Paper's theme system

---

## ErrorBoundary

Error handling components for graceful error recovery, styled with React Native Paper components.

### Basic Usage

```tsx
import { ErrorBoundary } from '@/components/ui';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Variants

```tsx
// Minimal error display
<ErrorBoundary variant="minimal">
  <ComponentThatMightError />
</ErrorBoundary>

// Detailed error information
<ErrorBoundary variant="detailed">
  <ComponentThatMightError />
</ErrorBoundary>

// Centered error layout
<ErrorBoundary variant="centered">
  <ComponentThatMightError />
</ErrorBoundary>

// Inline error display
<ErrorBoundary variant="inline">
  <ComponentThatMightError />
</ErrorBoundary>
```

### Custom Error Handling

```tsx
// Custom fallback component with Paper styling
<ErrorBoundary
  fallback={({ error, retry }) => (
    <Card variant="outlined">
      <Card.Content>
        <Typography variant="titleMedium">Something went wrong</Typography>
        <Typography variant="bodyMedium">{error.message}</Typography>
        <Button title="Try Again" onPress={retry} />
      </Card.Content>
    </Card>
  )}
>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Paper Integration

- Error UI uses Paper's `Surface` and `Card` components
- Typography follows Paper's text variants
- Buttons use Paper Button component
- Theme-aware error colors and styling

---

## Layout Components

### Container

Responsive content container with max-width and padding.

```tsx
import { Container } from '@/components/ui';

// Basic container
<Container>
  <Typography variant="displayMedium">Page Content</Typography>
</Container>

// Fluid container (no max-width)
<Container fluid>
  <Typography variant="displayMedium">Full-width content</Typography>
</Container>

// Centered container
<Container center padding={24}>
  <Typography variant="displayMedium">Centered content</Typography>
</Container>
```

### Row

Horizontal layout container for columns.

```tsx
import { Row } from '@/components/ui';

<Row>
  <Column size={6}>Left content</Column>
  <Column size={6}>Right content</Column>
</Row>

// Custom alignment
<Row align="center" justify="space-between">
  <Column auto>Auto column</Column>
  <Column size={4}>Fixed column</Column>
</Row>
```

### Column

Responsive grid columns with breakpoint support.

```tsx
import { Column } from '@/components/ui';

// Fixed size
<Column size={6}>Half width</Column>

// Responsive sizing
<Column responsive={{ xs: 12, md: 6, lg: 4 }}>
  Responsive column
</Column>

// With offset
<Column size={6} offset={3}>
  Centered with offset
</Column>
```

For detailed layout documentation, see [ResponsiveLayoutGuide.md](../constants/ResponsiveLayoutGuide.md).

---

## Theme Integration

All components integrate seamlessly with React Native Paper's theming system:

```tsx
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Button
      title="Themed Button"
      customColor={theme.colors.primary}
    />
  );
}
```

### Custom Theme

```tsx
import { MD3LightTheme, configureFonts } from 'react-native-paper';

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    secondary: '#FF6B35',
  },
};
```

### Theme Provider Setup

```tsx
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider theme={customTheme}>
      <YourApp />
    </PaperProvider>
  );
}
```

---

## Accessibility

All components support comprehensive accessibility features:

- **Screen readers**: Proper labels and hints using Paper's accessibility props
- **Keyboard navigation**: Focus management with Paper's focus handling
- **High contrast**: Theme-aware colors that adapt to system settings
- **Touch targets**: Minimum 44px touch areas following Material Design
- **Semantic markup**: Proper roles and states from Paper components

### Accessibility Props

```tsx
// Button accessibility
<Button
  title="Save Product"
  accessibilityLabel="Save product to your list"
  accessibilityHint="Adds this product to your shopping list"
/>

// Input accessibility
<Input
  label="Product Name"
  accessibilityLabel="Enter product name"
/>

// Image accessibility
<ProductImage
  source={imageSource}
  alt="German whole grain bread package"
  accessibilityRole="image"
/>
```

---

## Best Practices

### Performance

- Use `React.memo()` for complex components
- Implement proper key props for lists
- Use lazy loading for images
- Leverage Paper's optimized components

### Styling

- Use Paper theme colors instead of hardcoded values
- Follow Material Design 3 spacing guidelines
- Implement responsive designs with breakpoints
- Use semantic Paper component variants

### Development

- Include proper TypeScript interfaces
- Use Paper's built-in prop validation
- Implement error boundaries for robust apps
- Write unit tests for component interactions

### User Experience

- Provide loading states using Paper indicators
- Include error handling with Paper styling
- Ensure proper Material Design feedback
- Support both light and dark themes

---

## Migration Guide

### From Custom Components to Paper

When migrating existing code to use Paper-enhanced components:

1. **Update imports:**
```tsx
// Before
import { CustomButton } from './components';

// After
import { Button } from '@/components/ui';
```

2. **Update prop names:**
```tsx
// Before
<CustomButton text="Save" onClick={handleSave} />

// After
<Button title="Save" onPress={handleSave} />
```

3. **Use theme system:**
```tsx
// Before
<Text style={{ color: '#2E7D32' }}>Success</Text>

// After
<Typography style={{ color: theme.colors.primary }}>Success</Typography>
```

4. **Leverage Paper components:**
```tsx
// Before
<View style={styles.card}>
  <Text>Content</Text>
</View>

// After
<Card variant="elevated">
  <Card.Content>
    <Typography variant="bodyMedium">Content</Typography>
  </Card.Content>
</Card>
```

---

## Component Demo

For interactive examples of all components, visit the [Component Demo](/component-demo) screen in the app. This provides:

- Live component interactions
- All variants and states demonstrated
- Responsive behavior examples
- Theme switching capabilities
- Accessibility feature testing

The demo screen showcases real-world usage patterns and serves as a testing environment for component development.

---

This documentation provides comprehensive guidance for using all React Native Paper-enhanced components in the Expat Food Finder application. Each component leverages Material Design 3 principles while maintaining the flexibility needed for our specific use cases. 