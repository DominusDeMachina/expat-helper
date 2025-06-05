/**
 * Landing Page - Expat Food Finder
 * Clean and minimal design focused on the core app purpose
 */

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

// Hide the header for this landing page
export const options = {
  headerShown: false,
};

export default function LandingPage() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* App Icon */}
          <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
            <Ionicons name="storefront" size={48} color="white" />
          </View>

          {/* Title */}
          <ThemedText style={[styles.title, { color: textColor }]}>
            Expat Food Finder
          </ThemedText>

          {/* Subtitle */}
          <ThemedText style={[styles.subtitle, { color: textColor }]}>
            Find food that tastes like home
          </ThemedText>

          {/* Description */}
          <ThemedText style={[styles.description, { color: textColor }]}>
            Discover supermarket products that satisfy your taste buds. 
            Connect with fellow expats and share reviews of food products from your local grocery stores.
          </ThemedText>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="search" size={24} color={tintColor} />
              </View>
              <View style={styles.textWrapper}>
                <ThemedText style={[styles.featureText, { color: textColor }]}>
                  Search products by taste preferences from your home country
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="star" size={24} color={tintColor} />
              </View>
              <View style={styles.textWrapper}>
                <ThemedText style={[styles.featureText, { color: textColor }]}>
                  Rate and review supermarket products with cultural context
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.iconWrapper}>
                <Ionicons name="people" size={24} color={tintColor} />
              </View>
              <View style={styles.textWrapper}>
                <ThemedText style={[styles.featureText, { color: textColor }]}>
                  Connect with expats from your country sharing their discoveries
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.9,
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
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 