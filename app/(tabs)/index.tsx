import { DatabaseExamples, testDatabaseIntegration } from '@/lib/database.test';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { useState } from 'react';

export default function HomeScreen() {
  const { user, profile, signOut } = useAuth();
  const [isTestingDatabase, setIsTestingDatabase] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isCreatingData, setIsCreatingData] = useState(false);

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

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const runDatabaseTests = async () => {
    setIsTestingDatabase(true);
    setTestResults([]);
    addTestResult('🧪 Starting database integration tests...');
    
    try {
      const result = await testDatabaseIntegration();
      if (result) {
        addTestResult('✅ All database tests completed successfully!');
      } else {
        addTestResult('❌ Some database tests failed. Check console for details.');
      }
    } catch (error) {
      addTestResult(`❌ Database test error: ${error}`);
    } finally {
      setIsTestingDatabase(false);
    }
  };

  const createSampleData = async () => {
    setIsCreatingData(true);
    addTestResult('🏪 Creating sample supermarket...');
    
    try {
      // Create supermarket
      const supermarket = await DatabaseExamples.createSupermarket();
      if (supermarket) {
        addTestResult(`✅ Created supermarket: ${supermarket.name}`);
        
        // Create product
        addTestResult('🍞 Creating sample product...');
        const product = await DatabaseExamples.createProduct();
        if (product) {
          addTestResult(`✅ Created product: ${product.name}`);
          
          // Add availability
          addTestResult('📍 Adding product availability...');
          const availability = await DatabaseExamples.addProductAvailability(product.id, supermarket.id);
          if (availability) {
            addTestResult(`✅ Added availability: €${availability.price}`);
            
            // Add rating (if user is available)
            if (user?.id) {
              addTestResult('⭐ Adding product rating...');
              const rating = await DatabaseExamples.rateProduct(product.id, user.id);
              if (rating) {
                addTestResult(`✅ Added rating: ${rating.rating}/3 stars`);
              }
            }
          }
        }
      }
    } catch (error) {
      addTestResult(`❌ Sample data creation error: ${error}`);
    } finally {
      setIsCreatingData(false);
    }
  };

  const searchSampleProducts = async () => {
    addTestResult('🔍 Searching for bread products...');
    try {
      const results = await DatabaseExamples.searchProductsAdvanced();
      if (results.length > 0) {
        addTestResult(`✅ Found ${results.length} bread products`);
        results.slice(0, 3).forEach(product => {
          addTestResult(`  • ${product.name} - Rating: ${product.average_rating}/3`);
        });
      } else {
        addTestResult('ℹ️ No bread products found. Try creating sample data first.');
      }
    } catch (error) {
      addTestResult(`❌ Search error: ${error}`);
    }
  };

  const createShoppingList = async () => {
    if (!user?.id) {
      addTestResult('❌ Must be logged in to create shopping lists');
      return;
    }
    
    addTestResult('📝 Creating shopping list...');
    try {
      const list = await DatabaseExamples.createShoppingList(user.id);
      if (list) {
        addTestResult(`✅ Created list: ${list.name}`);
      }
    } catch (error) {
      addTestResult(`❌ List creation error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Expat Food Finder!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* User Information Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Your Profile</ThemedText>
        <ThemedText>
          Email: <ThemedText type="defaultSemiBold">{user?.email}</ThemedText>
        </ThemedText>
        {profile?.country_of_origin && (
          <ThemedText>
            Country of Origin: <ThemedText type="defaultSemiBold">{profile.country_of_origin}</ThemedText>
          </ThemedText>
        )}
        {profile?.current_country && (
          <ThemedText>
            Current Country: <ThemedText type="defaultSemiBold">{profile.current_country}</ThemedText>
          </ThemedText>
        )}
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Database Testing Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🧪 Database Testing</ThemedText>
        <ThemedText style={styles.description}>
          Test the database functionality to ensure everything is working correctly.
        </ThemedText>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.testButton, styles.primaryButton]} 
            onPress={runDatabaseTests}
            disabled={isTestingDatabase}
          >
            {isTestingDatabase ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemedText style={styles.buttonText}>Run Integration Tests</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.secondaryButton]} 
            onPress={createSampleData}
            disabled={isCreatingData}
          >
            {isCreatingData ? (
              <ActivityIndicator color="#007AFF" size="small" />
            ) : (
              <ThemedText style={styles.secondaryButtonText}>Create Sample Data</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.secondaryButton]} 
            onPress={searchSampleProducts}
          >
            <ThemedText style={styles.secondaryButtonText}>Search Products</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.secondaryButton]} 
            onPress={createShoppingList}
          >
            <ThemedText style={styles.secondaryButtonText}>Create Shopping List</ThemedText>
          </TouchableOpacity>

          {testResults.length > 0 && (
            <TouchableOpacity 
              style={[styles.testButton, styles.dangerButton]} 
              onPress={clearResults}
            >
              <ThemedText style={styles.buttonText}>Clear Results</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Test Results Display */}
        {testResults.length > 0 && (
          <ThemedView style={styles.resultsContainer}>
            <ThemedText type="defaultSemiBold" style={styles.resultsTitle}>Test Results:</ThemedText>
            <ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={true}>
              {testResults.map((result, index) => (
                <ThemedText key={index} style={styles.resultText}>
                  {result}
                </ThemedText>
              ))}
            </ScrollView>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Find Your Home Flavors</ThemedText>
        <ThemedText>
          Discover supermarket products that taste like home. Search for familiar brands and products from your country of origin, now available in local supermarkets.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Explore Products</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to browse products by category, country, or supermarket chain.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Share Your Discoveries</ThemedText>
        <ThemedText>
          Found a product that reminds you of home? Share it with the community to help other expats find their favorite flavors.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  signOutText: {
    color: 'white',
    fontWeight: '600',
  },
  description: {
    marginBottom: 10,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultsTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  resultsScroll: {
    maxHeight: 200,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    padding: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
