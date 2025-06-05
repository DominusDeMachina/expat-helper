/**
 * Home Screen - Product Discovery Dashboard
 * Showcasing responsive layout with product discovery features
 */

import { Column, Container, Row } from '@/components/ui/Layout';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    IconButton,
    Searchbar,
    Surface,
    Text,
    TouchableRipple,
    useTheme
} from 'react-native-paper';

import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
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
  const { isUp, getResponsiveValue } = useResponsive();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Responsive values
  const headerSize = getResponsiveValue({
    xs: 24,
    sm: 28,
    md: 32,
  });

  const showSidebar = isUp('lg');

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
        <Text variant="bodySmall" style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
          ({rating.toFixed(1)})
        </Text>
      </View>
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Container style={styles.header}>
        <Row align="center" justify="space-between">
          <Column auto>
            <View>
              <Text variant="bodyMedium" style={[styles.greeting, { color: theme.colors.onSurfaceVariant }]}>
                Welcome back!
              </Text>
              <Text variant="headlineSmall" style={[styles.userName, { fontSize: headerSize, color: theme.colors.onBackground }]}>
                {profile?.email || user?.email || 'Explorer'}
              </Text>
            </View>
          </Column>
          <Column auto>
            <IconButton
              icon="account-outline"
              size={24}
              mode="contained-tonal"
              onPress={handleSignOut}
            />
          </Column>
        </Row>
      </Container>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <Container style={styles.searchSection}>
          <Row>
            <Column size={12}>
              <Searchbar
                placeholder="Search for products that taste like home..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={{ color: theme.colors.onSurface }}
              />
            </Column>
          </Row>
        </Container>

        {/* Categories */}
        <Container style={styles.categoriesSection}>
          <Row>
            <Column size={12}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                Categories
              </Text>
            </Column>
          </Row>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <Row noGutters style={styles.categoriesRow}>
              {categories.map((category) => (
                <Column key={category.id} auto style={styles.categoryColumn}>
                  <Button
                    mode={selectedCategory === category.id ? "contained" : "outlined"}
                    onPress={() => setSelectedCategory(category.id)}
                    contentStyle={styles.categoryButton}
                    style={styles.categoryButtonStyle}
                    icon={({ color }) => <Ionicons name={category.icon as any} size={20} color={color} />}
                  >
                    {category.name}
                  </Button>
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
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                  Recommended Products ({filteredProducts.length})
                </Text>
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
                      <Card mode="elevated" style={styles.productCard}>
                        <TouchableRipple onPress={() => {}}>
                          <View>
                            <Surface style={[styles.productImage, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
                              <Ionicons name="nutrition-outline" size={40} color={theme.colors.primary} />
                            </Surface>
                            <Card.Content style={styles.productInfo}>
                              <Text variant="titleSmall" style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                                {product.name}
                              </Text>
                              {getRatingStars(product.rating)}
                              <View style={styles.productDetails}>
                                <Text variant="titleMedium" style={[styles.productPrice, { color: theme.colors.primary }]}>
                                  {product.price}
                                </Text>
                                <Text variant="bodySmall" style={[styles.productSupermarket, { color: theme.colors.onSurfaceVariant }]}>
                                  {product.supermarket}
                                </Text>
                              </View>
                            </Card.Content>
                          </View>
                        </TouchableRipple>
                      </Card>
                    </Column>
                  ))}
                </Row>
              </View>
            </Column>

            {/* Sidebar - Nearby Supermarkets */}
            {showSidebar && (
              <Column responsive={{ lg: 4 }}>
                <Card mode="elevated" style={styles.sidebar}>
                  <Card.Content>
                    <Text variant="titleMedium" style={[styles.sidebarTitle, { color: theme.colors.onSurface }]}>
                      Nearby Supermarkets
                    </Text>
                    {mockSupermarkets.map((supermarket) => (
                      <TouchableRipple
                        key={supermarket.id}
                        style={styles.supermarketCard}
                        onPress={() => {}}
                      >
                        <View style={styles.supermarketContent}>
                          <View style={styles.supermarketInfo}>
                            <Text variant="titleSmall" style={[styles.supermarketName, { color: theme.colors.onSurface }]}>
                              {supermarket.name}
                            </Text>
                            <Text variant="bodySmall" style={[styles.supermarketDistance, { color: theme.colors.onSurfaceVariant }]}>
                              {supermarket.distance}
                            </Text>
                            {getRatingStars(supermarket.rating)}
                            <Text variant="bodySmall" style={[styles.supermarketProducts, { color: theme.colors.onSurfaceVariant }]}>
                              {supermarket.productsCount} products
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                        </View>
                      </TouchableRipple>
                    ))}
                  </Card.Content>
                </Card>
              </Column>
            )}
          </Row>
        </Container>

        {/* Quick Actions */}
        <Container style={styles.quickActionsSection}>
          <Row>
            <Column size={12}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                Quick Actions
              </Text>
            </Column>
          </Row>
          <Row>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <Card mode="outlined" style={styles.actionCard}>
                <TouchableRipple onPress={() => {}}>
                  <Card.Content style={styles.actionCardContent}>
                    <Ionicons name="add-circle-outline" size={32} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.actionText, { color: theme.colors.onSurface }]}>
                      Add Product
                    </Text>
                  </Card.Content>
                </TouchableRipple>
              </Card>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <Card mode="outlined" style={styles.actionCard}>
                <TouchableRipple onPress={() => {}}>
                  <Card.Content style={styles.actionCardContent}>
                    <Ionicons name="location-outline" size={32} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.actionText, { color: theme.colors.onSurface }]}>
                      Find Stores
                    </Text>
                  </Card.Content>
                </TouchableRipple>
              </Card>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <Card mode="outlined" style={styles.actionCard}>
                <TouchableRipple onPress={() => {}}>
                  <Card.Content style={styles.actionCardContent}>
                    <Ionicons name="star-outline" size={32} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.actionText, { color: theme.colors.onSurface }]}>
                      Rate Product
                    </Text>
                  </Card.Content>
                </TouchableRipple>
              </Card>
            </Column>
            <Column responsive={{ xs: 6, sm: 3 }}>
              <Card mode="outlined" style={styles.actionCard}>
                <TouchableRipple onPress={() => {}}>
                  <Card.Content style={styles.actionCardContent}>
                    <Ionicons name="people-outline" size={32} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.actionText, { color: theme.colors.onSurface }]}>
                      Community
                    </Text>
                  </Card.Content>
                </TouchableRipple>
              </Card>
            </Column>
          </Row>
        </Container>
      </ScrollView>
    </View>
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
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
  },
  searchSection: {
    paddingVertical: 20,
  },
  searchBar: {
    elevation: 2,
  },
  categoriesSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
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
  categoryButton: {
    paddingHorizontal: 8,
  },
  categoryButtonStyle: {
    borderRadius: 20,
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
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  productInfo: {
    paddingTop: 0,
  },
  productName: {
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
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontWeight: 'bold',
  },
  productSupermarket: {
    fontSize: 12,
  },
  sidebar: {
    marginLeft: 16,
  },
  sidebarTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  supermarketCard: {
    borderRadius: 8,
    marginBottom: 8,
  },
  supermarketContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  supermarketInfo: {
    flex: 1,
  },
  supermarketName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  supermarketDistance: {
    marginBottom: 4,
  },
  supermarketProducts: {
    marginTop: 4,
  },
  quickActionsSection: {
    paddingBottom: 100,
  },
  actionCard: {
    marginBottom: 16,
  },
  actionCardContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
});
