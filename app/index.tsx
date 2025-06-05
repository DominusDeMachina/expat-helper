/**
 * Landing Page - Expat Food Finder
 * Clean and minimal design focused on the core app purpose
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

// Hide the header for this landing page
export const options = {
  headerShown: false,
};

export default function LandingPage() {
  const theme = useTheme();

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* App Icon */}
          <Surface style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]} elevation={4}>
            <Ionicons name="storefront" size={48} color={theme.colors.onPrimary} />
          </Surface>

          {/* Title */}
          <Text variant="displayMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Expat Food Finder
          </Text>

          {/* Subtitle */}
          <Text variant="headlineSmall" style={[styles.subtitle, { color: theme.colors.onBackground }]}>
            Find food that tastes like home
          </Text>

          {/* Description */}
          <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            Discover supermarket products that satisfy your taste buds. 
            Connect with fellow expats and share reviews of food products from your local grocery stores.
          </Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="search" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.textWrapper}>
                <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onBackground }]}>
                  Search products by taste preferences from your home country
                </Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="star" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.textWrapper}>
                <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onBackground }]}>
                  Rate and review supermarket products with cultural context
                </Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.textWrapper}>
                <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onBackground }]}>
                  Connect with expats from your country sharing their discoveries
                </Text>
              </View>
            </View>
          </View>

          {/* Get Started Button */}
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon={({ color }) => <Ionicons name="arrow-forward" size={20} color={color} />}
          >
            Get Started
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    width: '100%',
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
    paddingTop: 2,
  },
  featureText: {
    lineHeight: 22,
    textAlign: 'left',
  },
  button: {
    minWidth: 200,
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
}); 