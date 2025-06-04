// Database Hooks for React Components
// Provides convenient hooks for database operations with loading states and error handling

import { useCallback, useEffect, useState } from 'react'
import type {
    DatabaseResponse,
    PaginatedResponse,
    Product,
    ProductAvailability,
    ProductRating,
    ProductSearchResult,
    ProductWithDetails,
    Supermarket,
    SupermarketWithProducts,
    TablesInsert,
    TablesUpdate,
    UserListWithItems
} from '../lib/database.types'

import { DatabaseService } from '../lib/database.service'

// Generic hook for database operations
export function useDatabaseOperation<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (operation: () => Promise<DatabaseResponse<T>>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || 'Operation failed')
        setData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}

// Hook for paginated data
export function usePaginatedData<T>() {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const execute = useCallback(async (operation: () => Promise<PaginatedResponse<T>>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      if (result.success && result.data) {
        if (page === 1) {
          setData(result.data)
        } else {
          setData(prev => [...prev, ...result.data!])
        }
        setHasMore(result.hasMore)
      } else {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  const refresh = useCallback(() => {
    setPage(1)
    setData([])
    setHasMore(true)
  }, [])

  return { data, loading, error, hasMore, loadMore, refresh, execute }
}

// =========================
// PRODUCTS HOOKS
// =========================

export function useProducts(params?: {
  category?: string
  searchTerm?: string
  minRating?: number
  limit?: number
}) {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchProducts = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.products.getProducts({
        ...params,
        offset: (pageNum - 1) * (params?.limit || 20),
      })

      if (result.success && result.data) {
        if (pageNum === 1) {
          setData(result.data)
        } else {
          setData(prev => [...prev, ...result.data!])
        }
        setHasMore(result.hasMore)
      } else {
        setError(result.error || 'Failed to fetch products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    setPage(1)
    setData([])
    setHasMore(true)
    fetchProducts(1)
  }, [fetchProducts])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage)
    }
  }, [loading, hasMore, page, fetchProducts])

  const refresh = useCallback(() => {
    setPage(1)
    setData([])
    setHasMore(true)
    fetchProducts(1)
  }, [fetchProducts])

  return { data, loading, error, hasMore, loadMore, refresh }
}

export function useProduct(id: string | null) {
  const { data, loading, error, execute } = useDatabaseOperation<ProductWithDetails>()

  useEffect(() => {
    if (id) {
      execute(() => DatabaseService.products.getProductById(id))
    }
  }, [id, execute])

  return { product: data, loading, error }
}

export function useProductSearch(searchTerm: string, params?: {
  category?: string
  country?: string
  limit?: number
}) {
  const [results, setResults] = useState<ProductSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.products.searchProducts(searchTerm, params)
      if (result.success && result.data) {
        setResults(result.data)
      } else {
        setError(result.error || 'Search failed')
        setResults([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, params])

  useEffect(() => {
    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [search])

  return { results, loading, error, search }
}

// =========================
// SUPERMARKETS HOOKS
// =========================

export function useSupermarkets(params?: {
  country?: string
  city?: string
  limit?: number
}) {
  const { data, loading, error, hasMore, loadMore, refresh, execute } = usePaginatedData<Supermarket>()

  const fetchSupermarkets = useCallback((page: number) => {
    return execute(() => DatabaseService.supermarkets.getSupermarkets({
      ...params,
      offset: (page - 1) * (params?.limit || 20),
    }))
  }, [params, execute])

  useEffect(() => {
    refresh()
    fetchSupermarkets(1)
  }, [fetchSupermarkets, refresh])

  return { data, loading, error, hasMore, loadMore, refresh }
}

export function useSupermarket(id: string | null) {
  const { data, loading, error, execute } = useDatabaseOperation<SupermarketWithProducts>()

  useEffect(() => {
    if (id) {
      execute(() => DatabaseService.supermarkets.getSupermarketById(id))
    }
  }, [id, execute])

  return { supermarket: data, loading, error }
}

// =========================
// RATINGS HOOKS
// =========================

export function useProductRatings(productId: string | null) {
  const [ratings, setRatings] = useState<ProductRating[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRatings = useCallback(async () => {
    if (!productId) return

    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.ratings.getProductRatings(productId)
      if (result.success && result.data) {
        setRatings(result.data)
      } else {
        setError(result.error || 'Failed to fetch ratings')
        setRatings([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setRatings([])
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  // Set up real-time subscription
  useEffect(() => {
    if (!productId) return

    const unsubscribe = DatabaseService.realtime.subscribeToProductRatings(
      productId,
      (updatedRating) => {
        setRatings(prev => {
          const index = prev.findIndex(r => r.id === updatedRating.id)
          if (index >= 0) {
            const newRatings = [...prev]
            newRatings[index] = updatedRating
            return newRatings
          } else {
            return [updatedRating, ...prev]
          }
        })
      },
      (deletedRatingId) => {
        setRatings(prev => prev.filter(r => r.id !== deletedRatingId))
      }
    )

    return unsubscribe
  }, [productId])

  return { ratings, loading, error, refresh: fetchRatings }
}

export function useUserRating(productId: string | null) {
  const { data, loading, error, execute } = useDatabaseOperation<ProductRating>()

  useEffect(() => {
    if (productId) {
      execute(() => DatabaseService.ratings.getUserRating(productId))
    }
  }, [productId, execute])

  const submitRating = useCallback(async (rating: TablesInsert<'product_ratings'>) => {
    return execute(() => DatabaseService.ratings.upsertRating(rating))
  }, [execute])

  return { userRating: data, loading, error, submitRating }
}

// =========================
// AVAILABILITY HOOKS
// =========================

export function useProductAvailability(productId: string | null) {
  const [availability, setAvailability] = useState<ProductAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAvailability = useCallback(async () => {
    if (!productId) return

    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.availability.getProductAvailability(productId)
      if (result.success && result.data) {
        setAvailability(result.data)
      } else {
        setError(result.error || 'Failed to fetch availability')
        setAvailability([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setAvailability([])
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  // Set up real-time subscription
  useEffect(() => {
    if (!productId) return

    const unsubscribe = DatabaseService.realtime.subscribeToProductAvailability(
      productId,
      (updatedAvailability) => {
        setAvailability(prev => {
          const index = prev.findIndex(a => a.id === updatedAvailability.id)
          if (index >= 0) {
            const newAvailability = [...prev]
            newAvailability[index] = updatedAvailability
            return newAvailability
          } else {
            return [...prev, updatedAvailability]
          }
        })
      }
    )

    return unsubscribe
  }, [productId])

  return { availability, loading, error, refresh: fetchAvailability }
}

// =========================
// USER LISTS HOOKS
// =========================

export function useUserLists() {
  const [lists, setLists] = useState<UserListWithItems[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await DatabaseService.lists.getUserLists()
      if (result.success && result.data) {
        setLists(result.data)
      } else {
        setError(result.error || 'Failed to fetch lists')
        setLists([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLists([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const createList = useCallback(async (list: TablesInsert<'user_lists'>) => {
    try {
      const result = await DatabaseService.lists.createList(list)
      if (result.success && result.data) {
        fetchLists() // Refresh lists
        return result.data
      } else {
        setError(result.error || 'Failed to create list')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }, [fetchLists])

  const addItemToList = useCallback(async (listId: string, productId: string, quantity = 1, notes?: string) => {
    try {
      const result = await DatabaseService.lists.addItemToList({
        list_id: listId,
        product_id: productId,
        quantity,
        notes,
      })
      if (result.success) {
        fetchLists() // Refresh lists
        return result.data
      } else {
        setError(result.error || 'Failed to add item to list')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }, [fetchLists])

  const removeItemFromList = useCallback(async (listId: string, productId: string) => {
    try {
      const result = await DatabaseService.lists.removeItemFromList(listId, productId)
      if (result.success) {
        fetchLists() // Refresh lists
        return true
      } else {
        setError(result.error || 'Failed to remove item from list')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }, [fetchLists])

  return {
    lists,
    loading,
    error,
    refresh: fetchLists,
    createList,
    addItemToList,
    removeItemFromList,
  }
}

// =========================
// PROFILE HOOKS
// =========================

export function useProfile() {
  const { data, loading, error, execute } = useDatabaseOperation<any>()

  useEffect(() => {
    execute(() => DatabaseService.profiles.getCurrentProfile())
  }, [execute])

  const updateProfile = useCallback(async (updates: TablesUpdate<'profiles'>) => {
    return execute(() => DatabaseService.profiles.updateProfile(updates))
  }, [execute])

  return { profile: data, loading, error, updateProfile }
} 