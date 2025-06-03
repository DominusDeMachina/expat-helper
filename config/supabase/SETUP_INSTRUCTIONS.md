# Supabase Project Setup Instructions

## 🎯 Overview

This guide will help you set up a Supabase project for the **Expat Food Finder** app. The setup focuses on **supermarket product discovery** for expats, not restaurants.

## 📋 Prerequisites

- Email account for Supabase registration
- Project bundle identifiers:
  - iOS: `com.furduy.expatfood`
  - Android: `com.furduy.expatfood`

## 🚀 Step 1: Create Supabase Project

1. **Go to Supabase**
   - Visit [supabase.com](https://supabase.com/)
   - Click "Start your project"
   - Sign up with your email

2. **Create New Project**
   - Click "New project"
   - Choose your organization (or create one)
   - Enter project details:
     - **Name**: `expat-food`
     - **Database Password**: Generate a strong password (save it!)
     - **Region**: Choose closest to your target users
   - Click "Create new project"
   - Wait for project setup (2-3 minutes)

## 🔑 Step 2: Get Project Configuration

1. **Navigate to API Settings**
   - In your Supabase dashboard, go to "Settings" → "API"

2. **Copy These Values** (you'll need them for the .env file):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon (public) key**: `eyJ...` (long string starting with eyJ)
   - **Service role key**: `eyJ...` (keep this secret!)

## 📝 Step 3: Configure Environment Variables

1. **Create .env file** in your project root:
   ```bash
   # Copy the template
   cp config/supabase/env.example .env
   ```

2. **Edit .env file** with your actual values:
   ```env
   # Replace with your actual Supabase project URL
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   
   # Replace with your actual anon key
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_anon_key_here
   
   # Replace with your actual service role key (keep secret!)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_service_role_key_here
   ```

## 🗄️ Step 4: Set Up Database Schema

1. **Open SQL Editor**
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run Database Schema**
   - Copy the contents of `config/supabase/schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute
   - This creates all tables for products, supermarkets, ratings, etc.

## 📁 Step 5: Set Up Storage Buckets

1. **Run Storage Configuration**
   - In SQL Editor, create another new query
   - Copy the contents of `config/supabase/storage.sql`
   - Paste and run to create storage buckets and policies

2. **Verify Storage Setup**
   - Go to "Storage" in Supabase dashboard
   - You should see 3 buckets:
     - `product-images`
     - `user-avatars`
     - `supermarket-logos`

## 🔐 Step 6: Configure Authentication

1. **Set Up Auth Providers**
   - Go to "Authentication" → "Providers"
   - **Email**: Already enabled by default
   - **Google** (optional): Add OAuth credentials
   - **Apple** (optional): Add OAuth credentials for iOS
   - **Facebook** (optional): Add OAuth credentials

2. **Configure Auth Settings**
   - Go to "Authentication" → "Settings"
   - **Site URL**: Set to your app's domain (or `http://localhost:8081` for development)
   - **Redirect URLs**: Add these URLs:
     - `exp://localhost:8081/--/auth/callback` (Expo development)
     - `expatfood://auth/callback` (production deep link)

## ✅ Step 7: Test Your Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Test Connection**:
   ```bash
   # In your project directory, run:
   npx expo start
   ```

3. **Run Test Function** (optional):
   - Import the test function in your app:
   ```typescript
   import { testSupabaseConnection } from './config/supabase/test'
   
   // Call this in your app to test
   testSupabaseConnection()
   ```

## 🎯 Step 8: Verify Everything Works

### ✅ Checklist

- [ ] Supabase project created
- [ ] Environment variables configured in `.env`
- [ ] Database schema executed successfully
- [ ] Storage buckets created
- [ ] Authentication providers configured
- [ ] App can connect to Supabase (no errors in console)

### 🧪 Test Database

Run this query in SQL Editor to verify tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- `helpful_votes`
- `list_items`
- `product_availability`
- `product_ratings`
- `products`
- `profiles`
- `supermarkets`
- `user_lists`

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Double-check your `.env` file values
   - Make sure you copied the full keys (they're very long)
   - Restart your Expo development server

2. **"Table doesn't exist" error**
   - Make sure you ran the `schema.sql` file completely
   - Check for any SQL errors in the Supabase SQL Editor

3. **Storage upload fails**
   - Verify storage buckets were created
   - Check that `storage.sql` was executed successfully

4. **Authentication not working**
   - Verify redirect URLs are configured correctly
   - Check that auth providers are enabled

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- Look at our test file: `config/supabase/test.ts`

## 🎉 Next Steps

Once your Supabase setup is complete:

1. **Test the connection** using the test functions
2. **Start building** the product discovery features
3. **Add sample data** through the app interface
4. **Configure real-time subscriptions** for live updates
5. **Set up analytics** to monitor usage

## 💡 Free Tier Limits

Keep these limits in mind:
- **Database**: 500MB PostgreSQL
- **Storage**: 1GB file storage
- **Bandwidth**: 2GB per month
- **API Requests**: 50,000 per month

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your service role key secret
- Use the anon key for client-side operations
- The database has Row Level Security (RLS) enabled for data protection

---

**🎯 Focus**: This setup is specifically designed for **supermarket product discovery**, not restaurants. The database schema supports finding food products in grocery stores that taste like home for expats. 