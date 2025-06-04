/**
 * Landing Page - Expat Food Finder
 * Showcasing the responsive layout system with compelling app introduction
 */

import { Column, Container, Row } from '@/components/ui/Layout';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

export default function LandingPage() {
  const { isUp, getResponsiveValue } = useResponsive();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  // Responsive values
  const heroTextSize = getResponsiveValue({
    xs: 28,
    sm: 32,
    md: 40,
    lg: 48,
  });

  const subtitleSize = getResponsiveValue({
    xs: 16,
    sm: 18,
    md: 20,
    lg: 22,
  });

  const showSideImage = isUp('md');
  const heroImageHeight = getResponsiveValue({
    xs: 200,
    sm: 250,
    md: 300,
    lg: 350,
  });

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const features = [
    {
      icon: 'search-outline',
      title: 'Discover Products',
      description: 'Find food products in local supermarkets that taste like home',
    },
    {
      icon: 'star-outline',
      title: 'Rate & Review',
      description: 'Share your experience with products using our 3-tier rating system',
    },
    {
      icon: 'location-outline',
      title: 'Find Stores',
      description: 'Locate supermarkets and stores that carry your favorite products',
    },
    {
      icon: 'people-outline',
      title: 'Join Community',
      description: 'Connect with other expats and share product recommendations',
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Container style={styles.hero}>
          <Row align="center" justify="center">
            <Column responsive={{ xs: 12, md: 6 }}>
              <View style={styles.heroContent}>
                <ThemedText
                  style={[
                    styles.heroTitle,
                    { fontSize: heroTextSize, color: textColor }
                  ]}
                >
                  Find Food That{'\n'}Tastes Like Home
                </ThemedText>
                <ThemedText
                  style={[
                    styles.heroSubtitle,
                    { fontSize: subtitleSize, color: textColor }
                  ]}
                >
                  Discover supermarket products that satisfy your taste buds. 
                  Connect with fellow expats and share reviews of food products 
                  from your local grocery stores.
                </ThemedText>

                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: tintColor }]}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.ctaButtonText}>
                    Get Started
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Column>

            {showSideImage && (
              <Column responsive={{ md: 6 }}>
                <View style={[styles.heroImageContainer, { height: heroImageHeight }]}>
                  <View style={[styles.heroImagePlaceholder, { backgroundColor: cardColor }]}>
                    <Ionicons name="storefront" size={100} color={tintColor} />
                    <ThemedText style={styles.heroImageText}>
                      Your Grocery Adventure Starts Here
                    </ThemedText>
                  </View>
                </View>
              </Column>
            )}
          </Row>
        </Container>

        {/* Mobile Hero Image (when side image is hidden) */}
        {!showSideImage && (
          <Container>
            <Row>
              <Column size={12}>
                <View style={[styles.heroImageContainer, { height: heroImageHeight }]}>
                  <View style={[styles.heroImagePlaceholder, { backgroundColor: cardColor }]}>
                    <Ionicons name="storefront" size={80} color={tintColor} />
                    <ThemedText style={styles.heroImageText}>
                      Your Grocery Adventure Starts Here
                    </ThemedText>
                  </View>
                </View>
              </Column>
            </Row>
          </Container>
        )}

        {/* Features Section */}
        <Container style={styles.featuresSection}>
          <Row>
            <Column size={12}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                How It Works
              </ThemedText>
              <ThemedText style={[styles.sectionSubtitle, { color: textColor }]}>
                Making grocery shopping easier for expats everywhere
              </ThemedText>
            </Column>
          </Row>

          <Row style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Column
                key={index}
                responsive={{ xs: 12, sm: 6, lg: 3 }}
                style={styles.featureColumn}
              >
                <View style={[styles.featureCard, { backgroundColor: cardColor }]}>
                  <View style={[styles.featureIcon, { backgroundColor: tintColor }]}>
                    <Ionicons 
                      name={feature.icon as any} 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                    {feature.title}
                  </ThemedText>
                  <ThemedText style={[styles.featureDescription, { color: textColor }]}>
                    {feature.description}
                  </ThemedText>
                </View>
              </Column>
            ))}
          </Row>
        </Container>

        {/* Stats Section */}
        <Container style={styles.statsSection}>
          <Row>
            <Column size={12}>
              <View style={[styles.statsContainer, { backgroundColor: tintColor }]}>
                <Row>
                  <Column responsive={{ xs: 12, sm: 4 }} style={styles.statColumn}>
                    <ThemedText style={styles.statNumber}>10k+</ThemedText>
                    <ThemedText style={styles.statLabel}>Products Reviewed</ThemedText>
                  </Column>
                  <Column responsive={{ xs: 12, sm: 4 }} style={styles.statColumn}>
                    <ThemedText style={styles.statNumber}>500+</ThemedText>
                    <ThemedText style={styles.statLabel}>Supermarkets</ThemedText>
                  </Column>
                  <Column responsive={{ xs: 12, sm: 4 }} style={styles.statColumn}>
                    <ThemedText style={styles.statNumber}>50+</ThemedText>
                    <ThemedText style={styles.statLabel}>Countries</ThemedText>
                  </Column>
                </Row>
              </View>
            </Column>
          </Row>
        </Container>

        {/* CTA Section */}
        <Container style={styles.ctaSection}>
          <Row>
            <Column responsive={{ xs: 12, md: 8 }} offset={2}>
              <View style={styles.ctaContent}>
                <ThemedText style={[styles.ctaTitle, { color: textColor }]}>
                  Ready to Find Your Favorite Foods?
                </ThemedText>
                <ThemedText style={[styles.ctaSubtitle, { color: textColor }]}>
                  Join thousands of expats who have found their taste of home
                </ThemedText>
                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: tintColor }]}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.ctaButtonText}>
                    Start Exploring
                  </ThemedText>
                  <Ionicons name="rocket" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Column>
          </Row>
        </Container>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    paddingVertical: 60,
    minHeight: 400,
  },
  heroContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 20,
  },
  heroTitle: {
    fontWeight: 'bold',
    lineHeight: 1.2,
    marginBottom: 20,
    textAlign: 'left',
  },
  heroSubtitle: {
    lineHeight: 1.5,
    marginBottom: 30,
    opacity: 0.8,
  },
  heroImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroImageText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    paddingVertical: 80,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 50,
  },
  featuresGrid: {
    marginTop: 20,
  },
  featureColumn: {
    marginBottom: 20,
  },
  featureCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    textAlign: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 1.4,
  },
  statsSection: {
    paddingVertical: 40,
  },
  statsContainer: {
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  statColumn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  ctaSection: {
    paddingVertical: 80,
    paddingBottom: 100,
  },
  ctaContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
}); 