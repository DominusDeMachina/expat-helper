# Responsive Layout System

A comprehensive responsive grid system for React Native applications that provides consistent layouts across all device sizes.

## Overview

The responsive layout system consists of:
- **Breakpoints**: Device size categories (xs, sm, md, lg, xl)
- **Grid System**: 12-column flexible grid with gutters
- **Layout Components**: Container, Row, Column components
- **Responsive Hook**: useResponsive hook for dynamic values
- **Spacing System**: Consistent spacing scale

## Breakpoints

```typescript
const BREAKPOINTS = {
  xs: 0,     // Extra small devices (phones in portrait)
  sm: 576,   // Small devices (phones in landscape)  
  md: 768,   // Medium devices (tablets in portrait)
  lg: 992,   // Large devices (tablets in landscape, small desktops)
  xl: 1200,  // Extra large devices (large desktops)
}
```

## Grid System

- **12-column grid** with flexible column sizing
- **16px gutter width** between columns
- **Responsive container padding** based on breakpoint
- **Maximum container widths** for each breakpoint

## Components

### Container

Provides proper padding and max-width constraints.

```tsx
import { Container } from '@/components/ui/Layout';

// Basic container
<Container>
  <Text>Content with responsive padding</Text>
</Container>

// Fluid container (no max-width)
<Container fluid>
  <Text>Full-width content</Text>
</Container>

// Centered container with custom padding
<Container center padding={24}>
  <Text>Centered content</Text>
</Container>
```

**Props:**
- `fluid?: boolean` - Remove max-width constraints
- `padding?: number` - Custom padding override
- `center?: boolean` - Center horizontally

### Row

Creates horizontal layout container for columns.

```tsx
import { Row } from '@/components/ui/Layout';

// Basic row
<Row>
  <Column size={6}>Left half</Column>
  <Column size={6}>Right half</Column>
</Row>

// Row with custom alignment
<Row align="center" justify="space-between">
  <Column auto>Auto-sized column</Column>
  <Column size={4}>Fixed-size column</Column>
</Row>

// Row without gutters
<Row noGutters>
  <Column size={12}>Full width, no gutters</Column>
</Row>
```

**Props:**
- `noGutters?: boolean` - Remove horizontal gutters
- `align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'` - Vertical alignment
- `justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'` - Horizontal alignment
- `wrap?: boolean` - Whether to wrap columns (default: true)

### Column

Responsive column with size and offset support.

```tsx
import { Column } from '@/components/ui/Layout';

// Fixed size column
<Column size={6}>
  <Text>Half width</Text>
</Column>

// Responsive column sizes
<Column responsive={{ xs: 12, md: 6, lg: 4 }}>
  <Text>Full width on mobile, half on tablet, third on desktop</Text>
</Column>

// Auto-sized column
<Column auto>
  <Text>Auto-sized to content</Text>
</Column>

// Column with offset
<Column size={6} offset={3}>
  <Text>Centered with offset</Text>
</Column>

// Responsive offset
<Column 
  size={6} 
  offsetResponsive={{ xs: 0, md: 3 }}
>
  <Text>No offset on mobile, offset on larger screens</Text>
</Column>
```

**Props:**
- `size?: number` - Column size (1-12) for all breakpoints
- `responsive?: ResponsiveColumn` - Different sizes per breakpoint
- `noGutters?: boolean` - Remove horizontal gutters
- `offset?: number` - Offset columns from the left
- `offsetResponsive?: ResponsiveColumn` - Responsive offset values
- `auto?: boolean` - Auto-size to content

## useResponsive Hook

Access responsive utilities and breakpoint information.

```tsx
import { useResponsive } from '@/hooks/useResponsive';

function MyComponent() {
  const { 
    dimensions, 
    breakpoint, 
    getResponsiveValue, 
    spacing, 
    isUp, 
    isDown 
  } = useResponsive();

  // Get current screen dimensions
  console.log(dimensions); // { width: 768, height: 1024 }
  
  // Get current breakpoint
  console.log(breakpoint); // 'md'
  
  // Check breakpoint conditions
  const isMobile = isDown('md');
  const isTabletUp = isUp('md');
  
  // Get responsive values
  const fontSize = getResponsiveValue({
    xs: 14,
    md: 16,
    lg: 18,
  });
  
  // Get spacing values
  const padding = spacing('md'); // 16
  
  return (
    <View style={{ fontSize, padding }}>
      <Text>Responsive content</Text>
    </View>
  );
}
```

**Hook API:**
- `dimensions` - Current screen dimensions
- `breakpoint` - Current breakpoint ('xs' | 'sm' | 'md' | 'lg' | 'xl')
- `getResponsiveValue<T>(values: ResponsiveValue<T>)` - Get value for current breakpoint
- `spacing(size: SpacingSize)` - Get spacing value
- `isUp(breakpoint: Breakpoint)` - Check if screen is at least breakpoint size
- `isDown(breakpoint: Breakpoint)` - Check if screen is below breakpoint size
- `getColumnWidth(cols: number)` - Calculate column width
- `getGridConfig()` - Get current grid configuration

## Spacing System

Consistent spacing scale for padding and margins:

```typescript
const SPACING = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
}
```

## Usage Examples

### Basic Grid Layout

```tsx
import { Container, Row, Column } from '@/components/ui/Layout';

function ProductGrid() {
  return (
    <Container>
      <Row>
        <Column responsive={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard />
        </Column>
        <Column responsive={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard />
        </Column>
        <Column responsive={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard />
        </Column>
      </Row>
    </Container>
  );
}
```

### Responsive Content

```tsx
import { useResponsive } from '@/hooks/useResponsive';

function ResponsiveHeader() {
  const { getResponsiveValue, isUp } = useResponsive();
  
  const showLogo = isUp('md');
  const fontSize = getResponsiveValue({
    xs: 20,
    md: 24,
    lg: 28,
  });
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showLogo && <Logo />}
      <Text style={{ fontSize }}>App Title</Text>
    </View>
  );
}
```

### Form Layout

```tsx
function ContactForm() {
  return (
    <Container>
      <Row>
        <Column responsive={{ xs: 12, md: 6 }}>
          <TextInput placeholder="First Name" />
        </Column>
        <Column responsive={{ xs: 12, md: 6 }}>
          <TextInput placeholder="Last Name" />
        </Column>
        <Column size={12}>
          <TextInput placeholder="Email" />
        </Column>
        <Column size={12}>
          <TextInput placeholder="Message" multiline />
        </Column>
        <Column responsive={{ xs: 12, md: 6 }} offset={3}>
          <Button title="Submit" />
        </Column>
      </Row>
    </Container>
  );
}
```

## Best Practices

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```tsx
// ✅ Good: Mobile-first responsive design
<Column responsive={{ xs: 12, md: 6, lg: 4 }}>

// ❌ Avoid: Desktop-first design
<Column responsive={{ lg: 4, md: 6, xs: 12 }}>
```

### 2. Use Semantic Breakpoints
Use breakpoint conditions for behavior, not just sizing:

```tsx
const { isUp } = useResponsive();
const showSidebar = isUp('lg');
const showMobileMenu = !isUp('md');
```

### 3. Consistent Spacing
Use the spacing system instead of hardcoded values:

```tsx
const { spacing } = useResponsive();

// ✅ Good: Using spacing system
<View style={{ padding: spacing('md') }}>

// ❌ Avoid: Hardcoded values
<View style={{ padding: 16 }}>
```

### 4. Test Across Devices
Always test layouts on multiple device sizes:
- Mobile portrait (xs)
- Mobile landscape (sm)
- Tablet portrait (md)
- Tablet landscape (lg)
- Desktop (xl)

### 5. Performance Considerations
- The responsive hook updates on screen rotation/resize
- Use responsive values for conditional rendering sparingly
- Consider using CSS-like responsive props over conditional rendering

## TypeScript Support

Full TypeScript support with type safety:

```typescript
import type { Breakpoint, SpacingSize, UseResponsiveReturn } from '@/components/ui/Layout';

// Type-safe breakpoint values
const breakpoint: Breakpoint = 'md';

// Type-safe spacing values  
const spacing: SpacingSize = 'lg';

// Type-safe hook return
const responsive: UseResponsiveReturn = useResponsive();
``` 