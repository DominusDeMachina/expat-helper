import { supabase } from '@/config/supabase/client'

/**
 * Supabase Storage Service
 * Handles file upload, download, and management operations
 */

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  USER_AVATARS: 'user-avatars',
  SUPERMARKET_LOGOS: 'supermarket-logos',
} as const

// File type definitions
export interface FileUploadOptions {
  file: File | Blob
  fileName?: string
  contentType?: string
  upsert?: boolean
}

export interface UploadResult {
  success: boolean
  data?: {
    path: string
    fullPath: string
    publicUrl: string
  }
  error?: string
}

// Supabase FileObject interface
export interface FileMetadata {
  name: string
  id?: string
  updated_at?: string
  created_at?: string
  last_accessed_at?: string
  metadata?: Record<string, any>
}

export interface ListFilesResult {
  success: boolean
  data?: FileMetadata[]
  error?: string
}

/**
 * Generate file path for user-specific uploads
 */
export function generateUserFilePath(
  userId: string,
  fileExtension: string = 'jpg',
  prefix?: string
): string {
  const timestamp = Date.now()
  const basePath = prefix ? `${userId}/${prefix}` : userId
  return `${basePath}/${timestamp}.${fileExtension}`
}

/**
 * Generate file path for product images
 */
export function generateProductFilePath(
  userId: string,
  productId: string,
  fileExtension: string = 'jpg'
): string {
  const timestamp = Date.now()
  return `${userId}/products/${productId}/${timestamp}.${fileExtension}`
}

/**
 * Generate file path for supermarket logos
 */
export function generateSupermarketLogoPath(
  userId: string,
  supermarketId: string,
  fileExtension: string = 'jpg'
): string {
  const timestamp = Date.now()
  return `${userId}/supermarkets/${supermarketId}/${timestamp}.${fileExtension}`
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Extract file extension from filename or mime type
 */
function getFileExtension(fileName?: string, mimeType?: string): string {
  if (fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext) return ext
  }
  
  if (mimeType) {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg', 
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif'
    }
    return mimeToExt[mimeType] || 'jpg'
  }
  
  return 'jpg'
}

/**
 * Validate file type and size
 */
function validateFile(file: File | Blob, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Check file type for File objects
  if (file instanceof File) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      }
    }
  }

  return { valid: true }
}

/**
 * Upload file to specified bucket
 */
async function uploadFile(
  bucket: string,
  filePath: string,
  file: File | Blob,
  options: { contentType?: string; upsert?: boolean } = {}
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: options.contentType,
        upsert: options.upsert || false,
        cacheControl: '3600'
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    const publicUrl = getPublicUrl(bucket, filePath)

    return {
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete file from storage
 */
async function deleteFile(bucket: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * List files in a directory
 */
async function listFiles(
  bucket: string,
  path?: string,
  options: { limit?: number; offset?: number } = {}
): Promise<ListFilesResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: options.limit || 100,
        offset: options.offset || 0
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List files failed'
    }
  }
}

/**
 * Product Images Service
 */
export const ProductImagesService = {
  /**
   * Upload product image
   */
  async upload(
    userId: string,
    productId: string,
    file: File | Blob,
    options: Omit<FileUploadOptions, 'file'> = {}
  ): Promise<UploadResult> {
    // Validate file
    const validation = validateFile(file, 5 * 1024 * 1024) // 5MB limit
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    const fileExtension = getFileExtension(
      options.fileName,
      file instanceof File ? file.type : options.contentType
    )
    
    const filePath = generateProductFilePath(userId, productId, fileExtension)
    
    return uploadFile(STORAGE_BUCKETS.PRODUCT_IMAGES, filePath, file, {
      contentType: options.contentType || (file instanceof File ? file.type : 'image/jpeg'),
      upsert: options.upsert
    })
  },

  /**
   * List product images for a user
   */
  async listUserImages(userId: string, productId?: string): Promise<ListFilesResult> {
    const path = productId ? `${userId}/products/${productId}` : `${userId}/products`
    return listFiles(STORAGE_BUCKETS.PRODUCT_IMAGES, path)
  },

  /**
   * Delete product image
   */
  async delete(filePath: string): Promise<{ success: boolean; error?: string }> {
    return deleteFile(STORAGE_BUCKETS.PRODUCT_IMAGES, filePath)
  },

  /**
   * Get public URL for product image
   */
  getPublicUrl(filePath: string): string {
    return getPublicUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, filePath)
  }
}

/**
 * User Avatars Service
 */
export const UserAvatarsService = {
  /**
   * Upload user avatar
   */
  async upload(
    userId: string,
    file: File | Blob,
    options: Omit<FileUploadOptions, 'file'> = {}
  ): Promise<UploadResult> {
    // Validate file
    const validation = validateFile(file, 2 * 1024 * 1024) // 2MB limit for avatars
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    const fileExtension = getFileExtension(
      options.fileName,
      file instanceof File ? file.type : options.contentType
    )
    
    const filePath = generateUserFilePath(userId, fileExtension)
    
    return uploadFile(STORAGE_BUCKETS.USER_AVATARS, filePath, file, {
      contentType: options.contentType || (file instanceof File ? file.type : 'image/jpeg'),
      upsert: true // Always replace existing avatar
    })
  },

  /**
   * List user avatars
   */
  async listUserAvatars(userId: string): Promise<ListFilesResult> {
    return listFiles(STORAGE_BUCKETS.USER_AVATARS, userId)
  },

  /**
   * Delete user avatar
   */
  async delete(filePath: string): Promise<{ success: boolean; error?: string }> {
    return deleteFile(STORAGE_BUCKETS.USER_AVATARS, filePath)
  },

  /**
   * Get public URL for user avatar
   */
  getPublicUrl(filePath: string): string {
    return getPublicUrl(STORAGE_BUCKETS.USER_AVATARS, filePath)
  }
}

/**
 * Supermarket Logos Service
 */
export const SupermarketLogosService = {
  /**
   * Upload supermarket logo
   */
  async upload(
    userId: string,
    supermarketId: string,
    file: File | Blob,
    options: Omit<FileUploadOptions, 'file'> = {}
  ): Promise<UploadResult> {
    // Validate file
    const validation = validateFile(file, 2 * 1024 * 1024) // 2MB limit for logos
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    const fileExtension = getFileExtension(
      options.fileName,
      file instanceof File ? file.type : options.contentType
    )
    
    const filePath = generateSupermarketLogoPath(userId, supermarketId, fileExtension)
    
    return uploadFile(STORAGE_BUCKETS.SUPERMARKET_LOGOS, filePath, file, {
      contentType: options.contentType || (file instanceof File ? file.type : 'image/jpeg'),
      upsert: options.upsert
    })
  },

  /**
   * List supermarket logos for a user
   */
  async listUserLogos(userId: string, supermarketId?: string): Promise<ListFilesResult> {
    const path = supermarketId ? `${userId}/supermarkets/${supermarketId}` : `${userId}/supermarkets`
    return listFiles(STORAGE_BUCKETS.SUPERMARKET_LOGOS, path)
  },

  /**
   * Delete supermarket logo
   */
  async delete(filePath: string): Promise<{ success: boolean; error?: string }> {
    return deleteFile(STORAGE_BUCKETS.SUPERMARKET_LOGOS, filePath)
  },

  /**
   * Get public URL for supermarket logo
   */
  getPublicUrl(filePath: string): string {
    return getPublicUrl(STORAGE_BUCKETS.SUPERMARKET_LOGOS, filePath)
  }
}

/**
 * Generic Storage Service
 */
export const StorageService = {
  /**
   * Upload file to any bucket
   */
  uploadFile,

  /**
   * Delete file from any bucket
   */
  deleteFile,

  /**
   * List files in any bucket
   */
  listFiles,

  /**
   * Get public URL for any file
   */
  getPublicUrl,

  /**
   * Validate file
   */
  validateFile,

  /**
   * Generate file paths
   */
  generateUserFilePath,
  generateProductFilePath,
  generateSupermarketLogoPath,

  /**
   * Bucket constants
   */
  BUCKETS: STORAGE_BUCKETS
}

// Export all services
export default {
  ProductImages: ProductImagesService,
  UserAvatars: UserAvatarsService,
  SupermarketLogos: SupermarketLogosService,
  Storage: StorageService
} 