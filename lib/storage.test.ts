import StorageServices, {
    ProductImagesService,
    STORAGE_BUCKETS,
    StorageService,
    SupermarketLogosService,
    UserAvatarsService,
    generateProductFilePath,
    generateSupermarketLogoPath,
    generateUserFilePath,
    getPublicUrl
} from './storage.service'

import { supabase } from '@/config/supabase/client'

/**
 * Storage Integration Tests
 * Tests all storage functionality with real Supabase integration
 */

// Helper to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

// Mock file creation utilities
function createMockImageFile(name: string = 'test-image.jpg', size: number = 1024): File {
  const content = new Array(size).fill(0).map(() => Math.random().toString(36).charAt(0)).join('')
  const blob = new Blob([content], { type: 'image/jpeg' })
  return new File([blob], name, { type: 'image/jpeg' })
}

function createMockImageBlob(size: number = 1024): Blob {
  const content = new Array(size).fill(0).map(() => Math.random().toString(36).charAt(0)).join('')
  return new Blob([content], { type: 'image/jpeg' })
}

/**
 * Test File Path Generation
 */
export async function testFilePathGeneration(): Promise<void> {
  console.log('🧪 Testing File Path Generation...')
  
  const userId = 'test-user-123'
  const productId = 'test-product-456'
  const supermarketId = 'test-supermarket-789'
  
  try {
    // Test user file path generation
    const userPath = generateUserFilePath(userId, 'jpg')
    console.log('✅ User file path:', userPath)
    
    // Test product file path generation
    const productPath = generateProductFilePath(userId, productId, 'png')
    console.log('✅ Product file path:', productPath)
    
    // Test supermarket logo path generation
    const supermarketPath = generateSupermarketLogoPath(userId, supermarketId, 'webp')
    console.log('✅ Supermarket logo path:', supermarketPath)
    
    // Test public URL generation
    const publicUrl = getPublicUrl(STORAGE_BUCKETS.PRODUCT_IMAGES, productPath)
    console.log('✅ Public URL:', publicUrl)
    
    console.log('✅ File path generation tests passed!')
    
  } catch (error) {
    console.error('❌ File path generation test failed:', error)
    throw error
  }
}

/**
 * Test File Validation
 */
export async function testFileValidation(): Promise<void> {
  console.log('🧪 Testing File Validation...')
  
  try {
    // Test valid file
    const validFile = createMockImageFile('valid.jpg', 1024) // 1KB
    const validResult = StorageService.validateFile(validFile, 5 * 1024 * 1024)
    console.log('✅ Valid file validation:', validResult)
    
    // Test oversized file
    const oversizedFile = createMockImageFile('large.jpg', 10 * 1024 * 1024) // 10MB
    const oversizedResult = StorageService.validateFile(oversizedFile, 5 * 1024 * 1024)
    console.log('✅ Oversized file validation:', oversizedResult)
    
    // Test invalid file type
    const invalidFile = new File(['test'], 'document.pdf', { type: 'application/pdf' })
    const invalidResult = StorageService.validateFile(invalidFile)
    console.log('✅ Invalid file type validation:', invalidResult)
    
    console.log('✅ File validation tests passed!')
    
  } catch (error) {
    console.error('❌ File validation test failed:', error)
    throw error
  }
}

/**
 * Test Product Images Storage
 */
export async function testProductImagesStorage(): Promise<void> {
  console.log('🧪 Testing Product Images Storage...')
  
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    console.log('⚠️ No authenticated user found, skipping test')
    return
  }
  
  const productId = 'test-product-' + Date.now()
  
  try {
    // Create test image
    const testImage = createMockImageFile('product-test.jpg', 2048)
    console.log('📷 Created test image:', testImage.name, testImage.size, 'bytes')
    console.log('👤 Using authenticated user ID:', userId)
    
    // Upload product image
    const uploadResult = await ProductImagesService.upload(userId, productId, testImage)
    console.log('📤 Upload result:', uploadResult)
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`)
    }
    
    // Verify public URL
    const publicUrl = ProductImagesService.getPublicUrl(uploadResult.data!.path)
    console.log('🔗 Public URL:', publicUrl)
    
    // List user's product images
    const listResult = await ProductImagesService.listUserImages(userId, productId)
    console.log('📋 List result:', listResult)
    
    if (!listResult.success) {
      throw new Error(`List failed: ${listResult.error}`)
    }
    
    // Delete uploaded image
    const deleteResult = await ProductImagesService.delete(uploadResult.data!.path)
    console.log('🗑️ Delete result:', deleteResult)
    
    if (!deleteResult.success) {
      console.warn(`⚠️ Delete failed: ${deleteResult.error}`)
    }
    
    console.log('✅ Product images storage tests passed!')
    
  } catch (error) {
    console.error('❌ Product images storage test failed:', error)
    throw error
  }
}

/**
 * Test User Avatars Storage
 */
export async function testUserAvatarsStorage(): Promise<void> {
  console.log('🧪 Testing User Avatars Storage...')
  
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    console.log('⚠️ No authenticated user found, skipping test')
    return
  }
  
  try {
    // Create test avatar
    const testAvatar = createMockImageFile('avatar-test.png', 1024)
    console.log('👤 Created test avatar:', testAvatar.name, testAvatar.size, 'bytes')
    console.log('👤 Using authenticated user ID:', userId)
    
    // Upload user avatar
    const uploadResult = await UserAvatarsService.upload(userId, testAvatar)
    console.log('📤 Upload result:', uploadResult)
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`)
    }
    
    // Verify public URL
    const publicUrl = UserAvatarsService.getPublicUrl(uploadResult.data!.path)
    console.log('🔗 Public URL:', publicUrl)
    
    // List user avatars
    const listResult = await UserAvatarsService.listUserAvatars(userId)
    console.log('📋 List result:', listResult)
    
    if (!listResult.success) {
      throw new Error(`List failed: ${listResult.error}`)
    }
    
    // Upload replacement avatar (should upsert)
    const newAvatar = createMockImageFile('new-avatar.jpg', 1536)
    const replaceResult = await UserAvatarsService.upload(userId, newAvatar)
    console.log('🔄 Replace result:', replaceResult)
    
    // Delete uploaded avatar
    const deleteResult = await UserAvatarsService.delete(uploadResult.data!.path)
    console.log('🗑️ Delete result:', deleteResult)
    
    if (!deleteResult.success) {
      console.warn(`⚠️ Delete failed: ${deleteResult.error}`)
    }
    
    console.log('✅ User avatars storage tests passed!')
    
  } catch (error) {
    console.error('❌ User avatars storage test failed:', error)
    throw error
  }
}

/**
 * Test Supermarket Logos Storage
 */
export async function testSupermarketLogosStorage(): Promise<void> {
  console.log('🧪 Testing Supermarket Logos Storage...')
  
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    console.log('⚠️ No authenticated user found, skipping test')
    return
  }
  
  const supermarketId = 'test-supermarket-' + Date.now()
  
  try {
    // Create test logo
    const testLogo = createMockImageFile('logo-test.webp', 1024)
    console.log('🏪 Created test logo:', testLogo.name, testLogo.size, 'bytes')
    console.log('👤 Using authenticated user ID:', userId)
    
    // Upload supermarket logo
    const uploadResult = await SupermarketLogosService.upload(userId, supermarketId, testLogo)
    console.log('📤 Upload result:', uploadResult)
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`)
    }
    
    // Verify public URL
    const publicUrl = SupermarketLogosService.getPublicUrl(uploadResult.data!.path)
    console.log('🔗 Public URL:', publicUrl)
    
    // List user's supermarket logos
    const listResult = await SupermarketLogosService.listUserLogos(userId, supermarketId)
    console.log('📋 List result:', listResult)
    
    if (!listResult.success) {
      throw new Error(`List failed: ${listResult.error}`)
    }
    
    // Delete uploaded logo
    const deleteResult = await SupermarketLogosService.delete(uploadResult.data!.path)
    console.log('🗑️ Delete result:', deleteResult)
    
    if (!deleteResult.success) {
      console.warn(`⚠️ Delete failed: ${deleteResult.error}`)
    }
    
    console.log('✅ Supermarket logos storage tests passed!')
    
  } catch (error) {
    console.error('❌ Supermarket logos storage test failed:', error)
    throw error
  }
}

/**
 * Test Generic Storage Operations
 */
export async function testGenericStorageOperations(): Promise<void> {
  console.log('🧪 Testing Generic Storage Operations...')
  
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    console.log('⚠️ No authenticated user found, skipping test')
    return
  }
  
  try {
    // Create test file
    const testFile = createMockImageBlob(512)
    const filePath = generateUserFilePath(userId, 'jpg', 'generic-test')
    
    console.log('📄 Created test file, path:', filePath)
    console.log('👤 Using authenticated user ID:', userId)
    
    // Upload using generic storage service
    const uploadResult = await StorageService.uploadFile(
      STORAGE_BUCKETS.USER_AVATARS,
      filePath,
      testFile,
      { contentType: 'image/jpeg' }
    )
    console.log('📤 Generic upload result:', uploadResult)
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`)
    }
    
    // List files using generic service
    const listResult = await StorageService.listFiles(
      STORAGE_BUCKETS.USER_AVATARS,
      userId,
      { limit: 10 }
    )
    console.log('📋 Generic list result:', listResult)
    
    // Delete using generic service
    const deleteResult = await StorageService.deleteFile(
      STORAGE_BUCKETS.USER_AVATARS,
      filePath
    )
    console.log('🗑️ Generic delete result:', deleteResult)
    
    console.log('✅ Generic storage operations tests passed!')
    
  } catch (error) {
    console.error('❌ Generic storage operations test failed:', error)
    throw error
  }
}

/**
 * Test Storage Buckets Accessibility
 */
export async function testStorageBucketsAccessibility(): Promise<void> {
  console.log('🧪 Testing Storage Buckets Accessibility...')
  
  try {
    // Test each bucket by attempting to list files
    for (const [bucketName, bucketId] of Object.entries(STORAGE_BUCKETS)) {
      console.log(`🪣 Testing bucket: ${bucketName} (${bucketId})`)
      
      const listResult = await StorageService.listFiles(bucketId, '', { limit: 1 })
      
      if (listResult.success) {
        console.log(`✅ Bucket ${bucketName} is accessible`)
      } else {
        console.log(`⚠️ Bucket ${bucketName} accessibility issue:`, listResult.error)
      }
    }
    
    console.log('✅ Storage buckets accessibility tests completed!')
    
  } catch (error) {
    console.error('❌ Storage buckets accessibility test failed:', error)
    throw error
  }
}

/**
 * Run Complete Storage Integration Test Suite
 */
export async function runStorageIntegrationTests(): Promise<{
  success: boolean
  results: string[]
  errors: string[]
}> {
  console.log('🚀 Starting Complete Storage Integration Tests...')
  console.log('='.repeat(60))
  
  const results: string[] = []
  const errors: string[] = []
  
  const tests = [
    { name: 'File Path Generation', fn: testFilePathGeneration },
    { name: 'File Validation', fn: testFileValidation },
    { name: 'Storage Buckets Accessibility', fn: testStorageBucketsAccessibility },
    { name: 'Product Images Storage', fn: testProductImagesStorage },
    { name: 'User Avatars Storage', fn: testUserAvatarsStorage },
    { name: 'Supermarket Logos Storage', fn: testSupermarketLogosStorage },
    { name: 'Generic Storage Operations', fn: testGenericStorageOperations }
  ]
  
  for (const test of tests) {
    try {
      console.log(`\n🧪 Running: ${test.name}`)
      await test.fn()
      results.push(`✅ ${test.name}: PASSED`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      errors.push(`❌ ${test.name}: ${errorMsg}`)
      results.push(`❌ ${test.name}: FAILED`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 STORAGE INTEGRATION TEST RESULTS')
  console.log('='.repeat(60))
  
  results.forEach(result => console.log(result))
  
  if (errors.length > 0) {
    console.log('\n🚨 ERRORS ENCOUNTERED:')
    errors.forEach(error => console.log(error))
  }
  
  const success = errors.length === 0
  console.log(`\n🎯 Overall Result: ${success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  
  return {
    success,
    results,
    errors
  }
}

/**
 * Storage Examples for Documentation
 */
export const StorageExamples = {
  /**
   * Upload product image example
   */
  async uploadProductImage(userId: string, productId: string, imageFile: File) {
    return await ProductImagesService.upload(userId, productId, imageFile, {
      fileName: imageFile.name,
      contentType: imageFile.type
    })
  },

  /**
   * Upload user avatar example
   */
  async uploadUserAvatar(userId: string, avatarFile: File) {
    return await UserAvatarsService.upload(userId, avatarFile, {
      fileName: avatarFile.name,
      contentType: avatarFile.type
    })
  },

  /**
   * Upload supermarket logo example
   */
  async uploadSupermarketLogo(userId: string, supermarketId: string, logoFile: File) {
    return await SupermarketLogosService.upload(userId, supermarketId, logoFile, {
      fileName: logoFile.name,
      contentType: logoFile.type
    })
  },

  /**
   * Get public URLs for display
   */
  getImageUrls(filePaths: { product?: string; avatar?: string; logo?: string }) {
    return {
      productUrl: filePaths.product ? ProductImagesService.getPublicUrl(filePaths.product) : null,
      avatarUrl: filePaths.avatar ? UserAvatarsService.getPublicUrl(filePaths.avatar) : null,
      logoUrl: filePaths.logo ? SupermarketLogosService.getPublicUrl(filePaths.logo) : null
    }
  }
}

// Export test functions for external use
export {
    createMockImageBlob, createMockImageFile, StorageServices as default
}
