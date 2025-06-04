// Database Types for Expat Food Finder
// Auto-generated and manual types for Supabase PostgreSQL database

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          country_of_origin: string
          current_country: string | null
          current_city: string | null
          dietary_preferences: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          country_of_origin: string
          current_country?: string | null
          current_city?: string | null
          dietary_preferences?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          country_of_origin?: string
          current_country?: string | null
          current_city?: string | null
          dietary_preferences?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      supermarkets: {
        Row: {
          id: string
          name: string
          chain_name: string | null
          description: string | null
          country: string
          city: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          website: string | null
          logo_url: string | null
          is_chain: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          chain_name?: string | null
          description?: string | null
          country: string
          city?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          logo_url?: string | null
          is_chain?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          chain_name?: string | null
          description?: string | null
          country?: string
          city?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          logo_url?: string | null
          is_chain?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          brand: string | null
          description: string | null
          category: string
          subcategory: string | null
          ingredients: string[] | null
          allergens: string[] | null
          nutritional_info: Record<string, any> | null
          barcode: string | null
          image_urls: string[] | null
          average_rating: number
          rating_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand?: string | null
          description?: string | null
          category: string
          subcategory?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          nutritional_info?: Record<string, any> | null
          barcode?: string | null
          image_urls?: string[] | null
          average_rating?: number
          rating_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string | null
          description?: string | null
          category?: string
          subcategory?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          nutritional_info?: Record<string, any> | null
          barcode?: string | null
          image_urls?: string[] | null
          average_rating?: number
          rating_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_availability: {
        Row: {
          id: string
          product_id: string
          supermarket_id: string
          price: number | null
          currency: string
          is_available: boolean
          last_seen_date: string
          aisle_location: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          supermarket_id: string
          price?: number | null
          currency?: string
          is_available?: boolean
          last_seen_date?: string
          aisle_location?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          supermarket_id?: string
          price?: number | null
          currency?: string
          is_available?: boolean
          last_seen_date?: string
          aisle_location?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_ratings: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number // 1=inedible, 2=ordinary, 3=delicious
          comment: string | null
          home_country_comparison: string | null
          would_buy_again: boolean | null
          helpful_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          home_country_comparison?: string | null
          would_buy_again?: boolean | null
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          home_country_comparison?: string | null
          would_buy_again?: boolean | null
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          list_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          list_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          list_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      list_items: {
        Row: {
          id: string
          list_id: string
          product_id: string
          quantity: number
          notes: string | null
          is_purchased: boolean
          added_at: string
        }
        Insert: {
          id?: string
          list_id: string
          product_id: string
          quantity?: number
          notes?: string | null
          is_purchased?: boolean
          added_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          product_id?: string
          quantity?: number
          notes?: string | null
          is_purchased?: boolean
          added_at?: string
        }
      }
      helpful_votes: {
        Row: {
          id: string
          rating_id: string
          user_id: string
          is_helpful: boolean
          created_at: string
        }
        Insert: {
          id?: string
          rating_id: string
          user_id: string
          is_helpful: boolean
          created_at?: string
        }
        Update: {
          id?: string
          rating_id?: string
          user_id?: string
          is_helpful?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenient aliases
export type Profile = Tables<'profiles'>
export type Supermarket = Tables<'supermarkets'>
export type Product = Tables<'products'>
export type ProductAvailability = Tables<'product_availability'>
export type ProductRating = Tables<'product_ratings'>
export type UserList = Tables<'user_lists'>
export type ListItem = Tables<'list_items'>
export type HelpfulVote = Tables<'helpful_votes'>

// Extended types with relationships
export interface ProductWithAvailability extends Product {
  product_availability: ProductAvailability[]
}

export interface ProductWithRatings extends Product {
  product_ratings: ProductRating[]
}

export interface ProductWithDetails extends Product {
  product_availability: (ProductAvailability & {
    supermarkets: Supermarket
  })[]
  product_ratings: (ProductRating & {
    profiles: Pick<Profile, 'id' | 'full_name' | 'country_of_origin'>
  })[]
}

export interface SupermarketWithProducts extends Supermarket {
  product_availability: (ProductAvailability & {
    products: Product
  })[]
}

export interface UserListWithItems extends UserList {
  list_items: (ListItem & {
    products: Product
  })[]
}

// Query result types
export interface ProductSearchResult extends Product {
  availability_count: number
  supermarket_names: string[]
  average_price: number | null
}

export interface SupermarketSearchResult extends Supermarket {
  product_count: number
  average_price_range: [number, number] | null
}

// Enum-like constants
export const RATING_VALUES = {
  INEDIBLE: 1,
  ORDINARY: 2,
  DELICIOUS: 3,
} as const

export const LIST_TYPES = {
  SHOPPING: 'shopping',
  FAVORITES: 'favorites',
  WISHLIST: 'wishlist',
} as const

export const PRODUCT_CATEGORIES = [
  'bread',
  'dairy',
  'meat',
  'seafood',
  'fruits',
  'vegetables',
  'snacks',
  'beverages',
  'condiments',
  'spices',
  'grains',
  'frozen',
  'canned',
  'desserts',
  'baby_food',
  'organic',
  'international',
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// API response types
export interface DatabaseResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> extends DatabaseResponse<T[]> {
  count: number | null
  hasMore: boolean
  page: number
  limit: number
} 