/**
 * Home Screen - Product Discovery Dashboard
 * Showcasing responsive layout with product discovery features
 */

import { Column, Container, Row } from '@/components/ui/Layout';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  rating: number;
  price: string;
  supermarket: string;
  category: string;
  image?: string;
}

interface Supermarket {
  id: string;
  name: string;
  distance: string;
  rating: number;
  productsCount: number;
}

export default function HomeScreen() {
  const { user, profile, signOut } = useAuth();
  const { isUp, getResponsiveValue, spacing } = useResponsive();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Responsive values
  const headerSize = getResponsiveValue({
    xs: 24,
    sm: 28,
    md: 32,
  });

  const showSidebar = isUp('lg');
  const productsPerRow = getResponsiveValue({
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  });

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Mock data for demonstration
  const categories = [
    { id: 'all', name: 'All Categories', icon: 'grid-outline' },
    { id: 'bread', name: 'Bread & Bakery', icon: 'nutrition-outline' },
    { id: 'dairy', name: 'Dairy', icon: 'water-outline' },
    { id: 'snacks', name: 'Snacks', icon: 'pizza-outline' },
    { id: 'beverages', name: 'Beverages', icon: 'wine-outline' },
    { id: 'condiments', name: 'Condiments', icon: 'restaurant-outline' },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Schwarzbrot (German Dark Bread)',
      rating: 2.8,
      price: '€3.49',
      supermarket: 'REWE',
      category: 'bread',
    },
    {
      id: '2',
      name: 'Real Soy Sauce',
      rating: 2.5,
      price: '€2.99',
      supermarket: 'Carrefour',
      category: 'condiments',
    },
    {
      id: '3',
      name: 'Authentic Kimchi',
      rating: 2.9,
      price: '€4.99',
      supermarket: 'Asian Market',
      category: 'condiments',
    },
    {
      id: '4',
      name: 'Mexican Corn Tortillas',
      rating: 2.6,
      price: '€2.49',
      supermarket: 'Lidl',
      category: 'bread',
    },
    {
      id: '5',
      name: 'Italian Parmesan',
      rating: 2.7,
      price: '€6.99',
      supermarket: 'Auchan',
      category: 'dairy',
    },
    {
      id: '6',
      name: 'Japanese Pocky Sticks',
      rating: 2.4,
      price: '€1.99',
      supermarket: 'Monoprix',
      category: 'snacks',
    },
  ];

  const mockSupermarkets: Supermarket[] = [
    {
      id: '1',
      name: 'REWE',
      distance: '0.3 km',
      rating: 2.8,
      productsCount: 1200,
    },
    {
      id: '2',
      name: 'Carrefour',
      distance: '0.5 km',
      rating: 2.6,
      productsCount: 950,
    },
    {
      id: '3',
      name: 'Asian Market',
      distance: '1.2 km',
      rating: 2.9,
      productsCount: 380,
    },
  ];

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 3 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {Array(fullStars).fill(0).map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={16} color="#FFD700" />
        ))}
        {hasHalfStar && (
          <Ionicons name="star-half" size={16} color="#FFD700" />
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
        ))}
        <ThemedText style={styles.ratingText}>({rating.toFixed(1)})</ThemedText>
      </View>
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Container style={styles.header}>
        <Row align="center" justify="space-between">
          <Column auto>
            <View>
              <ThemedText style={[styles.greeting, { color: textColor }]}>
                Welcome back!
              </ThemedText>
              <ThemedText style={[styles.userName, { fontSize: headerSize, color: textColor }]}>
                {profile?.email || user?.email || 'Explorer'}
              </ThemedText>
            </View>
          </Column>
          <Column auto>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: cardColor }]}
              onPress={handleSignOut}
            >
              <Ionicons name="person-outline" size={24} color={tintColor} />
            </TouchableOpacity>
          </Column>
        </Row>
      </Container>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <Container style={styles.searchSection}>
          <Row>
            <Column size={12}>
              <View style={[styles.searchContainer, { backgroundColor: cardColor }]}>
                <Ionicons name="search-outline" size={20} color={tintColor} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: textColor }]}
                  placeholder="Search for products that taste like home..."
                  placeholderTextColor={textColor + '80'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </Column>
          </Row>
        </Container>

        {/* Categories */}
        <Container style={styles.categoriesSection}>
          <Row>
            <Column size={12}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                Categories
              </ThemedText>
            </Column>
          </Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <Row noGutters style={styles.categoriesRow}>
              {categories.map((category) => (
                <Column key={category.id} auto style={styles.categoryColumn}>
                  <TouchableOpacity
                    style={[
                      styles.categoryCard,
                      { backgroundColor: selectedCategory === category.id ? tintColor : cardColor }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={selectedCategory === category.id ? 'white' : tintColor}
                    />
                    <ThemedText
                      style={[
                        styles.categoryText,
                        { color: selectedCategory === category.id ? 'white' : textColor }
                      ]}
                    >
                      {category.name}
                    </ThemedText>
                  </TouchableOpacity>
                </Column>
              ))}
            </Row>
          </ScrollView>
        </Container>

        <Container>
          <Row>
            {/* Main Content */}
            <Column responsive={{ xs: 12, lg: showSidebar ? 8 : 12 }}>
              {/* Products Grid */}
              <View style={styles.productsSection}>
                <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                  Recommended Products ({filteredProducts.length})
                </ThemedText>
                <Row style={styles.productsGrid}>
                  {filteredProducts.map((product) => (
                    <Column
                      key={product.id}
                      responsive={{
                        xs: 12,
                        sm: 6,
                        md: 6,
                        lg: showSidebar ? 6 : 4,
                        xl: showSidebar ? 4 : 3,
                      }}
                      style={styles.productColumn}
                    >
                      <TouchableOpacity style={[styles.productCard, { backgroundColor: cardColor }]}>
                        <View style={[styles.productImage, { backgroundColor: tintColor + '20' }]}>
                          <Ionicons name="nutrition-outline" size={40} color={tintColor} />
                        </View>
                        <View style={styles.productInfo}>
                          <ThemedText style={[styles.productName, { color: textColor }]} numberOfLines={2}>
                            {product.name}
                          </ThemedText>
                          {getRatingStars(product.rating)}
                          <View style={styles.productDetails}>
                            <ThemedText style={[styles.productPrice, { color: tintColor }]}>
                              {product.price}
                            </ThemedText>
                            <ThemedText style={[styles.productSupermarket, { color: textColor }]}>
                              {product.supermarket}
                            </ThemedText>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Column>
                  ))}
                </Row>
              </View>
            </Column>

            {/* Sidebar - Nearby Supermarkets */}
            {showSidebar && (
              <Column responsive={{ lg: 4 }}>
                <View style={[styles.sidebar, { backgroundColor: cardColor }]}>
                  <ThemedText style={[styles.sidebarTitle, { color: textColor }]}>
                    Nearby Supermarkets
                  </ThemedText>
                  {mockSupermarkets.map((supermarket) => (
                    <TouchableOpacity
                      key={supermarket.id}
                      style={styles.supermarketCard}
                    >
                      <View style={styles.supermarketInfo}>
                        <ThemedText style={[styles.supermarketName, { color: textColor }]}>
                          {supermarket.name}
                        </ThemedText>
                        <ThemedText style={[styles.supermarketDistance, { color: textColor }]}>
                          {supermarket.distance}
                        </ThemedText>
                        {getRatingStars(supermarket.rating)}
                        <ThemedText style={[styles.supermarketProducts, { color: textColor }]}>
                          {supermarket.productsCount} products
                        </ThemedText>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={tintColor} />
                    </TouchableOpacity>
                  ))}
                </View>
              </Column>
            )}
          </Row>
        </Container>

        {/* Quick Actions */}
        <Container style={styles.quickActionsSection}>
          <Row>
            <Column size={12}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                Quick Actions
              </ThemedText>
            </Column>
          </Row>
          <Row>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <TouchableOpacity style={[styles.actionCard, { backgroundColor: cardColor }]}>
                <Ionicons name="add-circle-outline" size={32} color={tintColor} />
                <ThemedText style={[styles.actionText, { color: textColor }]}>
                  Add Product
                </ThemedText>
              </TouchableOpacity>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <TouchableOpacity style={[styles.actionCard, { backgroundColor: cardColor }]}>
                <Ionicons name="location-outline" size={32} color={tintColor} />
                <ThemedText style={[styles.actionText, { color: textColor }]}>
                  Find Stores
                </ThemedText>
              </TouchableOpacity>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <TouchableOpacity style={[styles.actionCard, { backgroundColor: cardColor }]}>
                <Ionicons name="star-outline" size={32} color={tintColor} />
                <ThemedText style={[styles.actionText, { color: textColor }]}>
                  Rate Product
                </ThemedText>
              </TouchableOpacity>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <TouchableOpacity style={[styles.actionCard, { backgroundColor: cardColor }]}>
                <Ionicons name="people-outline" size={32} color={tintColor} />
                <ThemedText style={[styles.actionText, { color: textColor }]}>
                  Community
                </ThemedText>
              </TouchableOpacity>
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchSection: {
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoriesRow: {
    paddingHorizontal: 16,
  },
  categoryColumn: {
    marginRight: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  productsSection: {
    marginBottom: 30,
  },
  productsGrid: {
    marginTop: 10,
  },
  productColumn: {
    marginBottom: 16,
  },
  productCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productImage: {
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    opacity: 0.7,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productSupermarket: {
    fontSize: 12,
    opacity: 0.7,
  },
  sidebar: {
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  supermarketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  supermarketInfo: {
    flex: 1,
  },
  supermarketName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  supermarketDistance: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  supermarketProducts: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  quickActionsSection: {
    paddingBottom: 100,
  },
  actionCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
