-- Expat Food Finder Database Schema
-- Focus: Supermarket product discovery for expats
-- This schema supports finding food products in supermarkets that taste like home

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- USER PROFILES TABLE
-- =============================================
-- Extends auth.users with expat-specific information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  home_country TEXT NOT NULL, -- Required: Country of origin for cultural context
  current_country TEXT, -- Where they currently live
  current_city TEXT, -- Current city for local supermarket recommendations
  dietary_preferences TEXT[], -- Array of dietary preferences (vegetarian, halal, etc.)
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

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SUPERMARKETS TABLE
-- =============================================
-- Grocery stores and supermarket chains
CREATE TABLE supermarkets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "Tesco", "Carrefour", "Whole Foods"
  chain_name TEXT, -- Parent company if different from name
  description TEXT,
  country TEXT NOT NULL, -- Country where this supermarket operates
  city TEXT, -- City location
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  website TEXT,
  logo_url TEXT,
  is_chain BOOLEAN DEFAULT false, -- True if this represents a chain, false for individual store
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE supermarkets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view supermarkets" ON supermarkets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create supermarkets" ON supermarkets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own supermarkets" ON supermarkets
  FOR UPDATE USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX supermarkets_country_idx ON supermarkets(country);
CREATE INDEX supermarkets_city_idx ON supermarkets(city);
CREATE INDEX supermarkets_chain_idx ON supermarkets(chain_name);
CREATE INDEX supermarkets_location_idx ON supermarkets(latitude, longitude);

-- Create trigger for updated_at
CREATE TRIGGER update_supermarkets_updated_at
  BEFORE UPDATE ON supermarkets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRODUCTS TABLE
-- =============================================
-- Food products available in supermarkets
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- Product name
  brand TEXT, -- Brand name (e.g., "Heinz", "Barilla")
  description TEXT,
  category TEXT NOT NULL, -- e.g., "bread", "dairy", "snacks", "beverages"
  subcategory TEXT, -- More specific category
  ingredients TEXT[], -- Array of ingredients
  allergens TEXT[], -- Array of allergens
  nutritional_info JSONB, -- Flexible nutritional information
  barcode TEXT, -- Product barcode for identification
  image_urls TEXT[], -- Array of product image URLs
  average_rating DECIMAL(3, 2) DEFAULT 0, -- Overall average rating
  rating_count INTEGER DEFAULT 0, -- Total number of ratings
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_brand_idx ON products(brand);
CREATE INDEX products_rating_idx ON products(average_rating DESC);
CREATE INDEX products_name_search_idx ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(brand, '')));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRODUCT AVAILABILITY TABLE
-- =============================================
-- Which products are available at which supermarkets
CREATE TABLE product_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  supermarket_id UUID REFERENCES supermarkets(id) ON DELETE CASCADE,
  price DECIMAL(10, 2), -- Price in local currency
  currency TEXT DEFAULT 'EUR', -- Currency code
  is_available BOOLEAN DEFAULT true, -- Current availability
  last_seen_date DATE DEFAULT CURRENT_DATE, -- When product was last confirmed available
  aisle_location TEXT, -- Where in store (e.g., "Aisle 5", "Dairy Section")
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, supermarket_id) -- One record per product per supermarket
);

-- Enable RLS
ALTER TABLE product_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view product availability" ON product_availability
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create availability" ON product_availability
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own availability records" ON product_availability
  FOR UPDATE USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX product_availability_product_idx ON product_availability(product_id);
CREATE INDEX product_availability_supermarket_idx ON product_availability(supermarket_id);
CREATE INDEX product_availability_price_idx ON product_availability(price);

-- Create trigger for updated_at
CREATE TRIGGER update_product_availability_updated_at
  BEFORE UPDATE ON product_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PRODUCT RATINGS TABLE
-- =============================================
-- Cultural ratings for products (3-tier system with cultural context)
CREATE TABLE product_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 3), -- 1=inedible, 2=ordinary, 3=delicious
  comment TEXT, -- Detailed review with cultural context
  home_country_comparison TEXT, -- How it compares to similar products from home
  would_buy_again BOOLEAN, -- Would they purchase this product again
  helpful_votes INTEGER DEFAULT 0, -- How many users found this review helpful
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- One rating per user per product
);

-- Enable RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view product ratings" ON product_ratings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings" ON product_ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON product_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON product_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX product_ratings_product_idx ON product_ratings(product_id);
CREATE INDEX product_ratings_user_idx ON product_ratings(user_id);
CREATE INDEX product_ratings_rating_idx ON product_ratings(rating DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_product_ratings_updated_at
  BEFORE UPDATE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- USER LISTS TABLE
-- =============================================
-- Shopping lists and favorite products
CREATE TABLE user_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Weekly Shopping", "Comfort Foods", "Try Next"
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Can other users see this list
  list_type TEXT DEFAULT 'shopping', -- 'shopping', 'favorites', 'wishlist'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_lists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own lists" ON user_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public lists" ON user_lists
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own lists" ON user_lists
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX user_lists_user_idx ON user_lists(user_id);
CREATE INDEX user_lists_type_idx ON user_lists(list_type);

-- Create trigger for updated_at
CREATE TRIGGER update_user_lists_updated_at
  BEFORE UPDATE ON user_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- LIST ITEMS TABLE
-- =============================================
-- Products in user lists
CREATE TABLE list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES user_lists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  notes TEXT, -- Personal notes about this product
  is_purchased BOOLEAN DEFAULT false, -- For shopping lists
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, product_id) -- One product per list
);

-- Enable RLS
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view items in own lists" ON list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_lists 
      WHERE user_lists.id = list_items.list_id 
      AND user_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view items in public lists" ON list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_lists 
      WHERE user_lists.id = list_items.list_id 
      AND user_lists.is_public = true
    )
  );

CREATE POLICY "Users can manage items in own lists" ON list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_lists 
      WHERE user_lists.id = list_items.list_id 
      AND user_lists.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX list_items_list_idx ON list_items(list_id);
CREATE INDEX list_items_product_idx ON list_items(product_id);

-- =============================================
-- HELPFUL VOTES TABLE
-- =============================================
-- Track which users found reviews helpful
CREATE TABLE helpful_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rating_id UUID REFERENCES product_ratings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL, -- true for helpful, false for not helpful
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rating_id, user_id) -- One vote per user per rating
);

-- Enable RLS
ALTER TABLE helpful_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view helpful votes" ON helpful_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON helpful_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON helpful_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX helpful_votes_rating_idx ON helpful_votes(rating_id);
CREATE INDEX helpful_votes_user_idx ON helpful_votes(user_id);

-- =============================================
-- FUNCTIONS FOR UPDATING AGGREGATED DATA
-- =============================================

-- Function to update product average rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating::DECIMAL), 2) 
      FROM product_ratings 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM product_ratings 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update product ratings
CREATE TRIGGER update_product_rating_on_insert
  AFTER INSERT ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_update
  AFTER UPDATE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_delete
  AFTER DELETE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Function to update helpful votes count
CREATE OR REPLACE FUNCTION update_helpful_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_ratings 
  SET helpful_votes = (
    SELECT COUNT(*) 
    FROM helpful_votes 
    WHERE rating_id = COALESCE(NEW.rating_id, OLD.rating_id) 
    AND is_helpful = true
  )
  WHERE id = COALESCE(NEW.rating_id, OLD.rating_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update helpful votes count
CREATE TRIGGER update_helpful_votes_on_insert
  AFTER INSERT ON helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_helpful_votes_count();

CREATE TRIGGER update_helpful_votes_on_update
  AFTER UPDATE ON helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_helpful_votes_count();

CREATE TRIGGER update_helpful_votes_on_delete
  AFTER DELETE ON helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_helpful_votes_count();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample supermarket chains
INSERT INTO supermarkets (name, chain_name, country, is_chain, description) VALUES
('Tesco', 'Tesco PLC', 'United Kingdom', true, 'British multinational groceries and general merchandise retailer'),
('Carrefour', 'Carrefour Group', 'France', true, 'French multinational retail corporation'),
('Lidl', 'Lidl Stiftung & Co. KG', 'Germany', true, 'German global discount supermarket chain'),
('Aldi', 'Aldi Group', 'Germany', true, 'German family-owned discount supermarket chain'),
('Whole Foods', 'Amazon', 'United States', true, 'American multinational supermarket chain specializing in organic products');

-- Insert sample product categories
INSERT INTO products (name, brand, category, subcategory, description) VALUES
('Sourdough Bread', 'Artisan Bakery', 'bread', 'sourdough', 'Traditional sourdough bread with tangy flavor'),
('Whole Milk', 'Local Dairy', 'dairy', 'milk', 'Fresh whole milk from local farms'),
('Dark Chocolate', 'Lindt', 'snacks', 'chocolate', 'Premium dark chocolate 70% cocoa'),
('Pasta Sauce', 'Barilla', 'condiments', 'pasta_sauce', 'Traditional Italian tomato pasta sauce'),
('Green Tea', 'Twinings', 'beverages', 'tea', 'Premium green tea blend');

-- Note: In a real application, you would populate these tables through the app interface
-- This sample data is just for testing the schema structure 