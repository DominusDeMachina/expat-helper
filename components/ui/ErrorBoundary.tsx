import React, { Component, ReactNode } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';

export type ErrorBoundaryVariant = 'minimal' | 'detailed' | 'centered' | 'inline';

export interface ErrorBoundaryProps {
  /** Children to render when no error */
  children: ReactNode;
  /** Variant of the error display */
  variant?: ErrorBoundaryVariant;
  /** Custom fallback component to render on error */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  /** Custom error title */
  title?: string;
  /** Custom error message */
  message?: string;
  /** Whether to show the retry button */
  showRetry?: boolean;
  /** Custom retry button text */
  retryText?: string;
  /** Whether to show error details in development */
  showDetails?: boolean;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback when retry is pressed */
  onRetry?: () => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Paper theme (injected by wrapper) */
  theme?: any;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorInfo {
  componentStack: string;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service or console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call onError prop if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
    
    this.props.onRetry?.();
  };

  renderMinimalError() {
    const { theme } = this.props;
    
    return (
      <Surface style={[styles.container, styles.minimal, this.props.style]} elevation={0}>
        <Ionicons 
          name="alert-circle-outline" 
          size={20} 
          color={theme?.colors.error || '#FF6B6B'} 
        />
        <Typography 
          variant="body2" 
          style={[styles.minimalText, { color: theme?.colors.error || '#FF6B6B' }]}
        >
          Something went wrong
        </Typography>
        {this.props.showRetry && (
          <TouchableOpacity onPress={this.resetError} style={styles.retryLink}>
            <Typography 
              variant="body2" 
              style={{ color: theme?.colors.primary || '#007AFF' }}
            >
              Retry
            </Typography>
          </TouchableOpacity>
        )}
      </Surface>
    );
  }

  renderDetailedError() {
    const {
      title = 'Oops! Something went wrong',
      message = 'An unexpected error occurred. Please try again.',
      showRetry = true,
      retryText = 'Try Again',
      showDetails = __DEV__,
      theme,
    } = this.props;

    return (
      <View style={[styles.container, styles.detailed, this.props.style]}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="alert-circle" 
            size={48} 
            color={theme?.colors.error || '#FF6B6B'} 
          />
        </View>
        
        <Typography 
          variant="h5" 
          weight="semibold" 
          style={[styles.title, { color: theme?.colors.onSurface }]}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          style={[styles.message, { color: theme?.colors.onSurfaceVariant }]}
        >
          {message}
        </Typography>

        {showDetails && this.state.error && (
          <Surface 
            style={[styles.detailsContainer, { backgroundColor: theme?.colors.surfaceVariant }]} 
            elevation={0}
          >
            <Typography 
              variant="body2" 
              weight="medium" 
              style={[styles.detailsTitle, { color: theme?.colors.onSurfaceVariant }]}
            >
              Error Details:
            </Typography>
            <Typography 
              variant="caption" 
              style={[styles.errorDetails, { color: theme?.colors.onSurfaceVariant }]}
            >
              {this.state.error.message}
            </Typography>
            {this.state.errorInfo?.componentStack && (
              <Typography 
                variant="caption" 
                style={[styles.errorDetails, { color: theme?.colors.onSurfaceVariant }]}
              >
                {this.state.errorInfo.componentStack}
              </Typography>
            )}
          </Surface>
        )}

        {showRetry && (
          <Button
            title={retryText}
            onPress={this.resetError}
            variant="primary"
            style={styles.retryButton}
          />
        )}
      </View>
    );
  }

  renderCenteredError() {
    const {
      title = 'Something went wrong',
      message = 'Please try refreshing the page',
      showRetry = true,
      retryText = 'Refresh',
      theme,
    } = this.props;

    return (
      <View style={[styles.container, styles.centered, this.props.style]}>
        <View style={styles.centeredContent}>
          <Ionicons 
            name="warning-outline" 
            size={64} 
            color={theme?.colors.error || '#FF6B6B'} 
          />
          
          <Typography 
            variant="h4" 
            weight="bold" 
            style={[styles.centeredTitle, { color: theme?.colors.onSurface }]}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            style={[styles.centeredMessage, { color: theme?.colors.onSurfaceVariant }]}
          >
            {message}
          </Typography>

          {showRetry && (
            <Button
              title={retryText}
              onPress={this.resetError}
              variant="primary"
              size="lg"
              style={styles.centeredButton}
            />
          )}
        </View>
      </View>
    );
  }

  renderInlineError() {
    const { message = 'Error loading content', theme } = this.props;

    return (
      <Surface 
        style={[styles.container, styles.inline, this.props.style]} 
        elevation={0}
      >
        <Ionicons 
          name="warning" 
          size={16} 
          color={theme?.colors.error || '#FF6B6B'} 
        />
        <Typography 
          variant="caption" 
          style={[styles.inlineText, { color: theme?.colors.error || '#FF6B6B' }]}
        >
          {message}
        </Typography>
        {this.props.showRetry && (
          <TouchableOpacity onPress={this.resetError} style={styles.inlineRetry}>
            <Typography 
              variant="caption" 
              style={{ color: theme?.colors.primary || '#007AFF' }}
            >
              Retry
            </Typography>
          </TouchableOpacity>
        )}
      </Surface>
    );
  }

  renderErrorUI() {
    const { variant = 'detailed', fallback } = this.props;
    
    // Use custom fallback if provided
    if (fallback && this.state.error) {
      return fallback(this.state.error, this.resetError);
    }

    // Render based on variant
    switch (variant) {
      case 'minimal':
        return this.renderMinimalError();
      case 'detailed':
        return this.renderDetailedError();
      case 'centered':
        return this.renderCenteredError();
      case 'inline':
        return this.renderInlineError();
      default:
        return this.renderDetailedError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

// Wrapper component to inject Paper theme
export function ErrorBoundary(props: Omit<ErrorBoundaryProps, 'theme'>) {
  const theme = useTheme();
  return <ErrorBoundaryComponent {...props} theme={theme} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  minimal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  minimalText: {
    marginLeft: 8,
    flex: 1,
  },
  retryLink: {
    marginLeft: 8,
  },
  detailed: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  detailsTitle: {
    marginBottom: 8,
  },
  errorDetails: {
    marginBottom: 8,
    lineHeight: 18,
  },
  retryButton: {
    minWidth: 120,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  centeredContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  centeredTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  centeredMessage: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  centeredButton: {
    minWidth: 150,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  inlineText: {
    marginLeft: 6,
    flex: 1,
  },
  inlineRetry: {
    marginLeft: 8,
  },
});

// Predefined component variants for common use cases
export const MinimalErrorBoundary = (props: Omit<ErrorBoundaryProps, 'variant' | 'theme'>) => (
  <ErrorBoundary variant="minimal" {...props} />
);

export const DetailedErrorBoundary = (props: Omit<ErrorBoundaryProps, 'variant' | 'theme'>) => (
  <ErrorBoundary variant="detailed" {...props} />
);

export const CenteredErrorBoundary = (props: Omit<ErrorBoundaryProps, 'variant' | 'theme'>) => (
  <ErrorBoundary variant="centered" {...props} />
);

export const InlineErrorBoundary = (props: Omit<ErrorBoundaryProps, 'variant' | 'theme'>) => (
  <ErrorBoundary variant="inline" {...props} />
); 