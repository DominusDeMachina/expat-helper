// Database Integration Test and Usage Examples
// Run this to test database operations and see examples of how to use the service

import { DatabaseService } from './database.service'
import type { TablesInsert } from './database.types'

/**
 * Test basic database operations
 * Make sure your Supabase configuration is set up first
 */
export async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration...\n')

  try {
    // Test 1: Fetch supermarkets (should work even without data)
    console.log('1. Testing supermarkets fetch...')
    const supermarketsResult = await DatabaseService.supermarkets.getSupermarkets({ limit: 5 })
    if (supermarketsResult.success && supermarketsResult.data) {
      console.log(`✅ Supermarkets: Found ${supermarketsResult.data.length} records`)
      console.log(`   Total count: ${supermarketsResult.count}`)
    } else {
      console.log(`❌ Supermarkets error: ${supermarketsResult.error}`)
    }

    // Test 2: Fetch products
    console.log('\n2. Testing products fetch...')
    const productsResult = await DatabaseService.products.getProducts({ limit: 5 })
    if (productsResult.success && productsResult.data) {
      console.log(`✅ Products: Found ${productsResult.data.length} records`)
      console.log(`   Total count: ${productsResult.count}`)
    } else {
      console.log(`❌ Products error: ${productsResult.error}`)
    }

    // Test 3: Get current profile (requires authentication)
    console.log('\n3. Testing current user profile...')
    const profileResult = await DatabaseService.profiles.getCurrentProfile()
    if (profileResult.success) {
      console.log(`✅ Profile: ${profileResult.data?.full_name || 'No name'} from ${profileResult.data?.country_of_origin}`)
    } else {
      console.log(`⚠️  Profile: ${profileResult.error} (expected if not authenticated)`)
    }

    // Test 4: Search products
    console.log('\n4. Testing product search...')
    const searchResult = await DatabaseService.products.searchProducts('bread', { limit: 3 })
    if (searchResult.success && searchResult.data) {
      console.log(`✅ Search: Found ${searchResult.data.length} bread products`)
      searchResult.data.forEach(product => {
        console.log(`   - ${product.name} (${product.brand || 'No brand'}) - Rating: ${product.average_rating}`)
      })
    } else {
      console.log(`❌ Search error: ${searchResult.error}`)
    }

    // Test 5: Test real-time setup (doesn't send data, just tests subscription)
    console.log('\n5. Testing real-time subscription setup...')
    const unsubscribe = DatabaseService.realtime.subscribeToProductRatings(
      'test-product-id',
      (rating) => console.log('Rating update:', rating.rating),
      (id) => console.log('Rating deleted:', id)
    )
    console.log('✅ Real-time subscription created (will unsubscribe immediately)')
    unsubscribe() // Clean up

    console.log('\n🎉 Database integration test completed!')
    return true

  } catch (error) {
    console.error('\n❌ Database integration test failed:', error)
    return false
  }
}

/**
 * Example usage of database operations
 */
export const DatabaseExamples = {
  /**
   * Example: Create a new supermarket
   */
  async createSupermarket() {
    const newSupermarket: TablesInsert<'supermarkets'> = {
      name: 'Example Supermarket',
      country: 'Germany',
      city: 'Berlin',
      description: 'A test supermarket for demonstration',
      address: '123 Test Street, Berlin',
      is_chain: false,
    }

    const result = await DatabaseService.supermarkets.createSupermarket(newSupermarket)
    if (result.success) {
      console.log('Created supermarket:', result.data?.name)
      return result.data
    } else {
      console.error('Failed to create supermarket:', result.error)
      return null
    }
  },

  /**
   * Example: Create a new product
   */
  async createProduct() {
    const newProduct: TablesInsert<'products'> = {
      name: 'German Sourdough Bread',
      brand: 'Local Bakery',
      category: 'bread',
      subcategory: 'sourdough',
      description: 'Traditional German sourdough bread with a crispy crust',
      ingredients: ['flour', 'water', 'sourdough starter', 'salt'],
      allergens: ['gluten'],
    }

    const result = await DatabaseService.products.createProduct(newProduct)
    if (result.success) {
      console.log('Created product:', result.data?.name)
      return result.data
    } else {
      console.error('Failed to create product:', result.error)
      return null
    }
  },

  /**
   * Example: Add product availability
   */
  async addProductAvailability(productId: string, supermarketId: string) {
    const availability: TablesInsert<'product_availability'> = {
      product_id: productId,
      supermarket_id: supermarketId,
      price: 2.49,
      currency: 'EUR',
      is_available: true,
      aisle_location: 'Bakery Section',
    }

    const result = await DatabaseService.availability.upsertAvailability(availability)
    if (result.success) {
      console.log('Added product availability:', result.data?.price, result.data?.currency)
      return result.data
    } else {
      console.error('Failed to add availability:', result.error)
      return null
    }
  },

  /**
   * Example: Rate a product
   */
  async rateProduct(productId: string, userId: string) {
    const rating: TablesInsert<'product_ratings'> = {
      product_id: productId,
      user_id: userId,
      rating: 3, // Delicious!
      comment: 'This bread tastes exactly like the one from my hometown bakery in Munich!',
      home_country_comparison: 'Very similar to traditional German bread',
      would_buy_again: true,
    }

    const result = await DatabaseService.ratings.upsertRating(rating)
    if (result.success) {
      console.log('Added rating:', result.data?.rating, '/3')
      return result.data
    } else {
      console.error('Failed to add rating:', result.error)
      return null
    }
  },

  /**
   * Example: Create a shopping list
   */
  async createShoppingList(userId: string) {
    const list: TablesInsert<'user_lists'> = {
      user_id: userId,
      name: 'Weekly Groceries',
      description: 'My regular grocery shopping list',
      list_type: 'shopping',
      is_public: false,
    }

    const result = await DatabaseService.lists.createList(list)
    if (result.success) {
      console.log('Created list:', result.data?.name)
      return result.data
    } else {
      console.error('Failed to create list:', result.error)
      return null
    }
  },

  /**
   * Example: Complex product search with filtering
   */
  async searchProductsAdvanced() {
    console.log('Searching for bread products in Germany...')
    
    const result = await DatabaseService.products.searchProducts('bread', {
      category: 'bread',
      country: 'Germany',
      limit: 10,
    })

    if (result.success && result.data) {
      console.log(`Found ${result.data.length} bread products:`)
      result.data.forEach(product => {
        console.log(`- ${product.name} by ${product.brand || 'Unknown'}`)
        console.log(`  Available at: ${product.supermarket_names.join(', ')}`)
        console.log(`  Avg price: €${product.average_price?.toFixed(2) || 'N/A'}`)
        console.log(`  Rating: ${product.average_rating}/3`)
        console.log()
      })
      return result.data
    } else {
      console.error('Search failed:', result.error)
      return []
    }
  },

  /**
   * Example: Get product with full details
   */
  async getProductDetails(productId: string) {
    const result = await DatabaseService.products.getProductById(productId)
    
    if (result.success && result.data) {
      const product = result.data
      console.log(`Product: ${product.name} by ${product.brand}`)
      console.log(`Category: ${product.category}${product.subcategory ? ` > ${product.subcategory}` : ''}`)
      console.log(`Rating: ${product.average_rating}/3 (${product.rating_count} reviews)`)
      console.log(`Ingredients: ${product.ingredients?.join(', ') || 'Not specified'}`)
      
      if (product.product_availability.length > 0) {
        console.log('\nAvailable at:')
        product.product_availability.forEach(avail => {
          console.log(`- ${avail.supermarkets.name}: €${avail.price} (${avail.aisle_location || 'Location unknown'})`)
        })
      }

      if (product.product_ratings.length > 0) {
        console.log('\nRecent reviews:')
        product.product_ratings.slice(0, 3).forEach(rating => {
          console.log(`- ${rating.profiles.country_of_origin} expat: ${rating.rating}/3 - "${rating.comment}"`)
        })
      }

      return product
    } else {
      console.error('Failed to get product details:', result.error)
      return null
    }
  },
}

/**
 * Usage examples for React hooks
 */
export const HookExamples = `
// Example: Using database hooks in React components

import { useProducts, useProduct, useProductSearch } from '../hooks/useDatabase'

// 1. Load products with pagination
function ProductList() {
  const { data: products, loading, error, hasMore, loadMore } = useProducts({
    category: 'bread',
    limit: 20
  })

  if (loading && products.length === 0) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error}</Text>

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
    />
  )
}

// 2. Product details with real-time updates
function ProductDetails({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId)
  
  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error}</Text>
  if (!product) return <Text>Product not found</Text>

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>Rating: {product.average_rating}/3</Text>
      <Text>Available at {product.product_availability.length} stores</Text>
    </View>
  )
}

// 3. Search with debouncing
function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { results, loading, error } = useProductSearch(searchTerm, {
    country: 'Germany'
  })

  return (
    <View>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search products..."
      />
      {loading && <Text>Searching...</Text>}
      {results.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </View>
  )
}

// 4. User lists management
function ShoppingLists() {
  const { lists, loading, createList, addItemToList } = useUserLists()

  const handleCreateList = async () => {
    await createList({
      name: 'New List',
      list_type: 'shopping'
    })
  }

  return (
    <View>
      <Button title="Create List" onPress={handleCreateList} />
      {lists.map(list => (
        <View key={list.id}>
          <Text>{list.name} ({list.list_items.length} items)</Text>
        </View>
      ))}
    </View>
  )
}
`

/**
 * Run a comprehensive test suite
 */
export async function runDatabaseTests() {
  console.log('🚀 Starting comprehensive database tests...\n')
  
  // Basic integration test
  const basicTest = await testDatabaseIntegration()
  
  if (basicTest) {
    console.log('\n📚 Additional examples available in DatabaseExamples')
    console.log('📱 React hooks usage examples available in HookExamples')
    
    // Show some examples if data exists
    console.log('\n🎯 Testing search functionality...')
    await DatabaseExamples.searchProductsAdvanced()
  }
  
  console.log('\n✨ Database testing complete!')
  return basicTest
}

// Export everything for external use
export { DatabaseService } from './database.service'
export * from './database.types'

