import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageSourcePropType,
    ImageStyle,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';

export type ProductImageSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProductImageVariant = 'rounded' | 'square' | 'circle';

export interface ProductImageProps {
  /** Image source */
  source?: ImageSourcePropType;
  /** Image URI string */
  uri?: string;
  /** Size of the image */
  size?: ProductImageSize;
  /** Shape variant of the image */
  variant?: ProductImageVariant;
  /** Whether to enable zoom functionality */
  zoomable?: boolean;
  /** Whether to show loading indicator */
  showLoading?: boolean;
  /** Placeholder text when no image */
  placeholder?: string;
  /** Placeholder icon when no image */
  placeholderIcon?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Whether to show error state */
  showError?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Callback when zoom modal is opened */
  onZoomOpen?: () => void;
  /** Callback when zoom modal is closed */
  onZoomClose?: () => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom colors for light/dark themes */
  lightColor?: string;
  darkColor?: string;
}

export function ProductImage({
  source,
  uri,
  size = 'md',
  variant = 'rounded',
  zoomable = false,
  showLoading = true,
  placeholder = 'No Image',
  placeholderIcon = 'image-outline',
  alt,
  showError = true,
  errorMessage = 'Failed to load image',
  onLoad,
  onError,
  onZoomOpen,
  onZoomClose,
  style,
  lightColor,
  darkColor,
}: ProductImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card'
  );
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const imageSource = source || (uri ? { uri } : null);
  const containerStyle = getContainerStyle(size, variant, backgroundColor, borderColor);
  const imageStyle = getImageStyle(size, variant);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  const handleZoomOpen = () => {
    if (zoomable && imageSource && !error) {
      setZoomVisible(true);
      onZoomOpen?.();
    }
  };

  const handleZoomClose = () => {
    setZoomVisible(false);
    onZoomClose?.();
  };

  const renderPlaceholder = () => (
    <View style={[containerStyle, styles.placeholder]}>
      <Ionicons
        name={placeholderIcon as any}
        size={getSizeValue(size) / 3}
        color={iconColor}
      />
      <Typography
        variant="caption"
        color="muted"
        style={styles.placeholderText}
      >
        {placeholder}
      </Typography>
    </View>
  );

  const renderError = () => (
    <View style={[containerStyle, styles.error]}>
      <Ionicons
        name="alert-circle-outline"
        size={getSizeValue(size) / 3}
        color={iconColor}
      />
      {showError && (
        <Typography
          variant="caption"
          color="error"
          style={styles.errorText}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  );

  const renderLoading = () => (
    <View style={[containerStyle, styles.loading]}>
      <ActivityIndicator
        size="small"
        color={iconColor}
      />
      {showLoading && (
        <Typography
          variant="caption"
          color="muted"
          style={styles.loadingText}
        >
          Loading...
        </Typography>
      )}
    </View>
  );

  const renderImage = () => {
    const ImageComponent = zoomable ? TouchableOpacity : View;
    
    return (
      <ImageComponent
        style={containerStyle}
        onPress={zoomable ? handleZoomOpen : undefined}
        accessibilityRole={zoomable ? 'button' : 'image'}
        accessibilityLabel={alt || 'Product image'}
        accessibilityHint={zoomable ? 'Tap to zoom' : undefined}
      >
        <Image
          source={imageSource!}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode="cover"
        />
        {zoomable && !loading && !error && (
          <View style={styles.zoomIcon}>
            <Ionicons
              name="expand-outline"
              size={16}
              color="white"
            />
          </View>
        )}
        {loading && renderLoading()}
      </ImageComponent>
    );
  };

  const renderZoomModal = () => (
    <Modal
      visible={zoomVisible}
      transparent
      animationType="fade"
      onRequestClose={handleZoomClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={handleZoomClose}
          accessibilityRole="button"
          accessibilityLabel="Close zoom view"
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleZoomClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            contentContainerStyle={styles.zoomContainer}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={imageSource!}
              style={styles.zoomImage}
              resizeMode="contain"
            />
          </ScrollView>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // Render logic
  if (!imageSource) {
    return renderPlaceholder();
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={style}>
      {renderImage()}
      {zoomable && renderZoomModal()}
    </View>
  );
}

// Helper functions
function getSizeValue(size: ProductImageSize): number {
  switch (size) {
    case 'sm':
      return 60;
    case 'md':
      return 100;
    case 'lg':
      return 150;
    case 'xl':
      return 200;
    default:
      return 100;
  }
}

function getContainerStyle(
  size: ProductImageSize,
  variant: ProductImageVariant,
  backgroundColor: string,
  borderColor: string
): ViewStyle {
  const sizeValue = getSizeValue(size);
  
  const baseStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    backgroundColor,
    borderWidth: 1,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  // Variant-specific styles
  switch (variant) {
    case 'rounded':
      baseStyle.borderRadius = 8;
      break;
    case 'square':
      baseStyle.borderRadius = 0;
      break;
    case 'circle':
      baseStyle.borderRadius = sizeValue / 2;
      break;
  }

  return baseStyle;
}

function getImageStyle(size: ProductImageSize, variant: ProductImageVariant): ImageStyle {
  const sizeValue = getSizeValue(size);
  
  const baseStyle: ImageStyle = {
    width: '100%',
    height: '100%',
  };

  // Variant-specific styles for image
  switch (variant) {
    case 'rounded':
      baseStyle.borderRadius = 8;
      break;
    case 'square':
      baseStyle.borderRadius = 0;
      break;
    case 'circle':
      baseStyle.borderRadius = sizeValue / 2;
      break;
  }

  return baseStyle;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    textAlign: 'center',
  },
  error: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 8,
  },
  zoomIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlay: {
    flex: 1,
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  zoomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 50,
  },
  zoomImage: {
    width: screenWidth,
    height: screenHeight - 150,
  },
});

// Predefined component variants for common use cases
export const ProductThumbnail = (props: Omit<ProductImageProps, 'size' | 'variant'>) => (
  <ProductImage size="sm" variant="rounded" {...props} />
);

export const ProductPreview = (props: Omit<ProductImageProps, 'size' | 'variant'>) => (
  <ProductImage size="md" variant="rounded" {...props} />
);

export const ProductHero = (props: Omit<ProductImageProps, 'size' | 'variant' | 'zoomable'>) => (
  <ProductImage size="xl" variant="rounded" zoomable {...props} />
);

export const CircleProductImage = (props: Omit<ProductImageProps, 'variant'>) => (
  <ProductImage variant="circle" {...props} />
); 