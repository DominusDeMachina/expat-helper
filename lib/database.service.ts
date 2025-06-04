// Database Service for Expat Food Finder
// Provides CRUD operations and real-time subscriptions for all database entities

import type {
    DatabaseResponse,
    HelpfulVote,
    ListItem,
    PaginatedResponse,
    Product,
    ProductAvailability,
    ProductRating,
    ProductSearchResult,
    ProductWithDetails,
    Profile,
    Supermarket,
    SupermarketSearchResult,
    SupermarketWithProducts,
    TablesInsert,
    TablesUpdate,
    UserList,
    UserListWithItems
} from './database.types'

import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../config/supabase/client'

// =========================
// PROFILES SERVICE
// =========================

export class ProfilesService {
  /**
   * Get current user's profile
   */
  static async getCurrentProfile(): Promise<DatabaseResponse<Profile>> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return { data: null, error: 'User not authenticated', success: false }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(updates: TablesUpdate<'profiles'>): Promise<DatabaseResponse<Profile>> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return { data: null, error: 'User not authenticated', success: false }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.user.id)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Get profile by ID
   */
  static async getProfileById(id: string): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// SUPERMARKETS SERVICE
// =========================

export class SupermarketsService {
  /**
   * Get all supermarkets with optional filtering
   */
  static async getSupermarkets(params?: {
    country?: string
    city?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedResponse<Supermarket>> {
    try {
      let query = supabase.from('supermarkets').select('*', { count: 'exact' })

      if (params?.country) {
        query = query.eq('country', params.country)
      }
      if (params?.city) {
        query = query.eq('city', params.city)
      }

      const limit = params?.limit || 50
      const offset = params?.offset || 0

      query = query.range(offset, offset + limit - 1).order('name')

      const { data, error, count } = await query

      return {
        data: data || [],
        error: error?.message || null,
        success: !error,
        count: count || 0,
        hasMore: (count || 0) > offset + limit,
        page: Math.floor(offset / limit) + 1,
        limit,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
        count: 0,
        hasMore: false,
        page: 1,
        limit: params?.limit || 50,
      }
    }
  }

  /**
   * Get supermarket by ID with products
   */
  static async getSupermarketById(id: string): Promise<DatabaseResponse<SupermarketWithProducts>> {
    try {
      const { data, error } = await supabase
        .from('supermarkets')
        .select(`
          *,
          product_availability(
            *,
            products(*)
          )
        `)
        .eq('id', id)
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Create a new supermarket
   */
  static async createSupermarket(supermarket: TablesInsert<'supermarkets'>): Promise<DatabaseResponse<Supermarket>> {
    try {
      const { data, error } = await supabase
        .from('supermarkets')
        .insert(supermarket)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Update supermarket
   */
  static async updateSupermarket(id: string, updates: TablesUpdate<'supermarkets'>): Promise<DatabaseResponse<Supermarket>> {
    try {
      const { data, error } = await supabase
        .from('supermarkets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Search supermarkets by name
   */
  static async searchSupermarkets(searchTerm: string, limit = 20): Promise<DatabaseResponse<SupermarketSearchResult[]>> {
    try {
      const { data, error } = await supabase
        .from('supermarkets')
        .select(`
          *,
          product_availability(count)
        `)
        .or(`name.ilike.%${searchTerm}%,chain_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(limit)
        .order('name')

      const searchResults: SupermarketSearchResult[] = (data || []).map(item => ({
        ...item,
        product_count: item.product_availability?.[0]?.count || 0,
        average_price_range: null, // Could be calculated with more complex query
      }))

      return {
        data: searchResults,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// PRODUCTS SERVICE
// =========================

export class ProductsService {
  /**
   * Get products with optional filtering and pagination
   */
  static async getProducts(params?: {
    category?: string
    searchTerm?: string
    limit?: number
    offset?: number
    minRating?: number
  }): Promise<PaginatedResponse<Product>> {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' })

      if (params?.category) {
        query = query.eq('category', params.category)
      }

      if (params?.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,brand.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%`)
      }

      if (params?.minRating) {
        query = query.gte('average_rating', params.minRating)
      }

      const limit = params?.limit || 50
      const offset = params?.offset || 0

      query = query.range(offset, offset + limit - 1).order('average_rating', { ascending: false })

      const { data, error, count } = await query

      return {
        data: data || [],
        error: error?.message || null,
        success: !error,
        count: count || 0,
        hasMore: (count || 0) > offset + limit,
        page: Math.floor(offset / limit) + 1,
        limit,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
        count: 0,
        hasMore: false,
        page: 1,
        limit: params?.limit || 50,
      }
    }
  }

  /**
   * Get product by ID with full details (availability and ratings)
   */
  static async getProductById(id: string): Promise<DatabaseResponse<ProductWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_availability(
            *,
            supermarkets(*)
          ),
          product_ratings(
            *,
            profiles(id, full_name, country_of_origin)
          )
        `)
        .eq('id', id)
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Create a new product
   */
  static async createProduct(product: TablesInsert<'products'>): Promise<DatabaseResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id: string, updates: TablesUpdate<'products'>): Promise<DatabaseResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Search products with availability info
   */
  static async searchProducts(searchTerm: string, params?: {
    category?: string
    country?: string
    limit?: number
  }): Promise<DatabaseResponse<ProductSearchResult[]>> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_availability(
            supermarket_id,
            price,
            supermarkets(name, country)
          )
        `)
        .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)

      if (params?.category) {
        query = query.eq('category', params.category)
      }

      const limit = params?.limit || 20
      query = query.limit(limit).order('average_rating', { ascending: false })

      const { data, error } = await query

      const searchResults: ProductSearchResult[] = (data || []).map(item => {
        const availabilities = item.product_availability || []
        const filteredAvailabilities = params?.country 
          ? availabilities.filter((a: any) => a.supermarkets?.country === params.country)
          : availabilities

        return {
          ...item,
          availability_count: filteredAvailabilities.length,
          supermarket_names: filteredAvailabilities.map((a: any) => a.supermarkets?.name || 'Unknown').slice(0, 3),
          average_price: filteredAvailabilities.length > 0 
            ? filteredAvailabilities.reduce((sum: number, a: any) => sum + (a.price || 0), 0) / filteredAvailabilities.length
            : null,
        }
      })

      return {
        data: searchResults,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// PRODUCT AVAILABILITY SERVICE
// =========================

export class ProductAvailabilityService {
  /**
   * Add or update product availability at a supermarket
   */
  static async upsertAvailability(availability: TablesInsert<'product_availability'>): Promise<DatabaseResponse<ProductAvailability>> {
    try {
      const { data, error } = await supabase
        .from('product_availability')
        .upsert(availability, { 
          onConflict: 'product_id,supermarket_id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Get availability for a specific product
   */
  static async getProductAvailability(productId: string): Promise<DatabaseResponse<ProductAvailability[]>> {
    try {
      const { data, error } = await supabase
        .from('product_availability')
        .select(`
          *,
          supermarkets(*)
        `)
        .eq('product_id', productId)
        .eq('is_available', true)
        .order('price', { ascending: true })

      return {
        data: data || [],
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Mark product as unavailable
   */
  static async markUnavailable(id: string): Promise<DatabaseResponse<ProductAvailability>> {
    try {
      const { data, error } = await supabase
        .from('product_availability')
        .update({ is_available: false })
        .eq('id', id)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// PRODUCT RATINGS SERVICE
// =========================

export class ProductRatingsService {
  /**
   * Add or update a product rating
   */
  static async upsertRating(rating: TablesInsert<'product_ratings'>): Promise<DatabaseResponse<ProductRating>> {
    try {
      const { data, error } = await supabase
        .from('product_ratings')
        .upsert(rating, { 
          onConflict: 'product_id,user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Get ratings for a product
   */
  static async getProductRatings(productId: string, limit = 50): Promise<DatabaseResponse<ProductRating[]>> {
    try {
      const { data, error } = await supabase
        .from('product_ratings')
        .select(`
          *,
          profiles(id, full_name, country_of_origin)
        `)
        .eq('product_id', productId)
        .order('helpful_votes', { ascending: false })
        .limit(limit)

      return {
        data: data || [],
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Get current user's rating for a product
   */
  static async getUserRating(productId: string): Promise<DatabaseResponse<ProductRating>> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return { data: null, error: 'User not authenticated', success: false }
      }

      const { data, error } = await supabase
        .from('product_ratings')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.user.id)
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Delete a rating
   */
  static async deleteRating(id: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from('product_ratings')
        .delete()
        .eq('id', id)

      return {
        data: null,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// USER LISTS SERVICE
// =========================

export class UserListsService {
  /**
   * Get user's lists
   */
  static async getUserLists(): Promise<DatabaseResponse<UserListWithItems[]>> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return { data: [], error: 'User not authenticated', success: false }
      }

      const { data, error } = await supabase
        .from('user_lists')
        .select(`
          *,
          list_items(
            *,
            products(*)
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })

      return {
        data: data || [],
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Create a new list
   */
  static async createList(list: TablesInsert<'user_lists'>): Promise<DatabaseResponse<UserList>> {
    try {
      const { data, error } = await supabase
        .from('user_lists')
        .insert(list)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Add item to list
   */
  static async addItemToList(item: TablesInsert<'list_items'>): Promise<DatabaseResponse<ListItem>> {
    try {
      const { data, error } = await supabase
        .from('list_items')
        .upsert(item, { 
          onConflict: 'list_id,product_id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Remove item from list
   */
  static async removeItemFromList(listId: string, productId: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('list_id', listId)
        .eq('product_id', productId)

      return {
        data: null,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Update list item (quantity, notes, purchased status)
   */
  static async updateListItem(id: string, updates: TablesUpdate<'list_items'>): Promise<DatabaseResponse<ListItem>> {
    try {
      const { data, error } = await supabase
        .from('list_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// HELPFUL VOTES SERVICE
// =========================

export class HelpfulVotesService {
  /**
   * Vote on rating helpfulness
   */
  static async voteOnRating(vote: TablesInsert<'helpful_votes'>): Promise<DatabaseResponse<HelpfulVote>> {
    try {
      const { data, error } = await supabase
        .from('helpful_votes')
        .upsert(vote, { 
          onConflict: 'rating_id,user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single()

      return {
        data,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }

  /**
   * Remove vote
   */
  static async removeVote(ratingId: string, userId: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from('helpful_votes')
        .delete()
        .eq('rating_id', ratingId)
        .eq('user_id', userId)

      return {
        data: null,
        error: error?.message || null,
        success: !error,
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false,
      }
    }
  }
}

// =========================
// REAL-TIME SUBSCRIPTIONS
// =========================

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map()

  /**
   * Subscribe to product rating changes
   */
  static subscribeToProductRatings(
    productId: string,
    onUpdate: (rating: ProductRating) => void,
    onDelete: (ratingId: string) => void
  ): () => void {
    const channelName = `product-ratings-${productId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_ratings',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            onUpdate(payload.new as ProductRating)
          } else if (payload.eventType === 'DELETE') {
            onDelete(payload.old.id)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  /**
   * Subscribe to product availability changes
   */
  static subscribeToProductAvailability(
    productId: string,
    onUpdate: (availability: ProductAvailability) => void
  ): () => void {
    const channelName = `product-availability-${productId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_availability',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            onUpdate(payload.new as ProductAvailability)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  /**
   * Subscribe to user's list changes
   */
  static subscribeToUserLists(
    userId: string,
    onUpdate: (list: UserList) => void,
    onDelete: (listId: string) => void
  ): () => void {
    const channelName = `user-lists-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_lists',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            onUpdate(payload.new as UserList)
          } else if (payload.eventType === 'DELETE') {
            onDelete(payload.old.id)
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  /**
   * Unsubscribe from all channels
   */
  static unsubscribeAll(): void {
    this.channels.forEach(channel => channel.unsubscribe())
    this.channels.clear()
  }
}

// =========================
// COMBINED DATABASE SERVICE
// =========================

export const DatabaseService = {
  profiles: ProfilesService,
  supermarkets: SupermarketsService,
  products: ProductsService,
  availability: ProductAvailabilityService,
  ratings: ProductRatingsService,
  lists: UserListsService,
  votes: HelpfulVotesService,
  realtime: RealtimeService,
} 