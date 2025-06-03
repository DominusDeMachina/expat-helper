# Supabase Setup Guide

This guide will walk you through setting up Supabase as a free alternative to Firebase for the Expat Food app.

## Why Supabase?

- **Generous Free Tier**: 500MB database, 1GB file storage, 50MB file uploads
- **No Credit Card Required**: Start building immediately
- **PostgreSQL**: More powerful than NoSQL for complex queries
- **Real-time**: Built-in real-time subscriptions
- **Authentication**: Multiple providers included
- **File Storage**: Built-in file storage with CDN

## Prerequisites

- Email account for Supabase registration
- Project bundle identifiers:
  - iOS: `com.furduy.expatfood`
  - Android: `com.furduy.expatfood`

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Click "Start your project" and sign up
3. Click "New project"
4. Choose your organization (or create one)
5. Enter project details:
   - **Name**: `expat-food`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project setup (2-3 minutes)

## Step 2: Get Project Configuration

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon (public) key**: `eyJ...` (long string)
   - **Service role key**: `eyJ...` (keep this secret!)

## Step 3: Install Supabase Dependencies

Remove Firebase and install Supabase:

```bash
# Remove Firebase
npm uninstall firebase

# Install Supabase
npm install @supabase/supabase-js
```

## Step 4: Configure Environment Variables

1. Create/update your `.env` file in project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Keep service role key secret (don't use EXPO_PUBLIC prefix)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Create Supabase Client

Create `config/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic session refresh for mobile apps
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

## Step 6: Set Up Authentication

### 6.1 Configure Auth Providers

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Configure providers you want:
   - **Email**: Already enabled
   - **Google**: Add OAuth credentials
   - **Apple**: Add OAuth credentials (for iOS)
   - **Facebook**: Add OAuth credentials (optional)

### 6.2 Configure Auth Settings

1. Go to "Authentication" → "Settings"
2. Set **Site URL**: `https://your-app-domain.com` (or localhost for development)
3. Add **Redirect URLs**:
   - `exp://localhost:8081/--/auth/callback` (Expo development)
   - `expatfood://auth/callback` (production deep link)

## Step 7: Create Database Schema

### 7.1 Users Table (extends auth.users)

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  home_country TEXT,
  current_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 7.2 Restaurants Table

```sql
-- Create restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  website TEXT,
  price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view restaurants" ON restaurants
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create restaurants" ON restaurants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own restaurants" ON restaurants
  FOR UPDATE USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX restaurants_cuisine_type_idx ON restaurants(cuisine_type);
CREATE INDEX restaurants_location_idx ON restaurants(latitude, longitude);
CREATE INDEX restaurants_rating_idx ON restaurants(rating DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 7.3 Reviews Table

```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, user_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX reviews_restaurant_id_idx ON reviews(restaurant_id);
CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX reviews_rating_idx ON reviews(rating DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 8: Set Up Storage

### 8.1 Create Storage Buckets

1. In Supabase dashboard, go to "Storage"
2. Create buckets:
   - **restaurant-images**: For restaurant photos
   - **user-avatars**: For user profile pictures

### 8.2 Configure Storage Policies

```sql
-- Restaurant images bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-images', 'restaurant-images', true);

CREATE POLICY "Anyone can view restaurant images" ON storage.objects
  FOR SELECT USING (bucket_id = 'restaurant-images');

CREATE POLICY "Authenticated users can upload restaurant images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'restaurant-images' AND auth.role() = 'authenticated');

-- User avatars bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);

CREATE POLICY "Anyone can view user avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 9: Test Configuration

Create a simple test file `config/supabase/test.ts`:

```typescript
import { supabase } from './client'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connected successfully!')
    return true
  } catch (error) {
    console.error('Supabase test failed:', error)
    return false
  }
}
```

## Step 10: Authentication Implementation

Create `hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../config/supabase/client'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
```

## Free Tier Limitations

### What's Included (Free)
- **Database**: 500MB PostgreSQL
- **Storage**: 1GB file storage
- **Bandwidth**: 2GB per month
- **API Requests**: 50,000 per month
- **Authentication**: Unlimited users
- **Real-time**: 200 concurrent connections

### What to Monitor
- Database size (500MB limit)
- Monthly bandwidth usage
- API request count
- File storage usage

### Optimization Tips
- Use image compression for uploads
- Implement pagination for large datasets
- Cache frequently accessed data locally
- Use real-time subscriptions efficiently

## Migration Benefits

### Compared to Firebase Free Tier
- **More storage**: 1GB vs Firebase's limited storage
- **Better database**: PostgreSQL vs Firestore limitations
- **No function restrictions**: Edge functions included
- **Real-time included**: No additional cost
- **Better pricing**: More predictable scaling costs

### Development Advantages
- **SQL queries**: More powerful than NoSQL
- **Built-in auth**: No additional setup needed
- **Type safety**: Auto-generated TypeScript types
- **Local development**: Built-in local development tools

## Next Steps

1. Remove Firebase configuration files
2. Update package.json dependencies
3. Implement authentication flows
4. Create data access layer
5. Test all functionality
6. Deploy and monitor usage

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database) 