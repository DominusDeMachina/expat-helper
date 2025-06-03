# Project Brief: Expat Food Finder

## Project Overview

**Name:** expat-food  
**Type:** React Native mobile application built with Expo  
**Target Platforms:** iOS, Android, Web  
**Current Status:** Initial setup with Expo template structure

## Core Purpose

A mobile application designed to help expatriates discover, rate, and share **food products** in foreign **supermarkets**. The platform allows users to find products that match their taste expectations from their home country, share experiences through ratings and reviews, and build community with other expats facing similar grocery shopping challenges.

## Key Problem Statement

When expatriates arrive in a new country, they face significant challenges in **grocery shopping**:
- **Unfamiliar products**: Even familiar-looking products may taste completely different from expectations
- **Cultural taste differences**: Local popular products may be unpalatable to people from different culinary backgrounds  
- **Difficulty finding comfort foods**: Products that taste similar to home can be hard to locate
- **Language barriers**: Packaging may be in unfamiliar language, making it difficult to understand ingredients

## Key Requirements

### Functional Requirements

- **Product Discovery**: Help users find **food products** in **supermarkets** that match their home country taste preferences
- **Supermarket Integration**: Browse products by specific **grocery stores** and **supermarket chains**
- **Product Rating System**: 3-tier rating system (inedible, ordinary, delicious) with cultural context
- **User Profiles**: Allow users to specify their **country of origin** for culturally-relevant recommendations
- **Product Addition**: Users can add new products with photos, descriptions, and supermarket locations
- **Search & Filtering**: Find products by name, category, supermarket, or country of origin of reviewers
- **Community Reviews**: Detailed comments explaining taste differences or similarities to home country products

### Technical Requirements

- **Cross-Platform**: Native iOS and Android apps with web support
- **Offline Capability**: Basic functionality when internet is limited
- **Performance**: Fast loading times and smooth navigation
- **Accessibility**: Full accessibility support for all users
- **Internationalization**: Support for multiple languages

## Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time)
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack React Query
- **Storage**: React Native MMKV for local storage
- **UI Components**: Custom themed components with Expo Vector Icons
- **Animations**: React Native Reanimated
- **Forms**: React Hook Form

## Core Data Models

### Product
- Product information (name, description, photos, category)
- Supermarket availability
- Ratings aggregated by user's country of origin
- User reviews and comments

### User
- Profile with country of origin (required)
- Current country of residence
- Followed users and personal product lists
- Rating and review history

### Supermarket
- Store information and location
- Available products
- Chain/brand information

### Rating
- 3-tier rating system with cultural context
- Detailed comments about taste comparisons
- Helpful voting system

## Success Criteria

1. **User Engagement**: High user retention and daily active usage for grocery shopping
2. **Content Quality**: Comprehensive database of **food products** in **supermarkets**
3. **Community Growth**: Active user-generated **product reviews** and ratings
4. **Technical Performance**: App store ratings above 4.5 stars
5. **Market Penetration**: Adoption in major expat communities worldwide

## Constraints

- **Budget**: Development resources are limited
- **Timeline**: MVP needs to be delivered efficiently
- **Platform Requirements**: Must meet App Store and Google Play guidelines
- **Data Privacy**: Compliance with GDPR and other privacy regulations

## Next Steps

1. Correct all tasks and documentation to focus on **supermarket product discovery**
2. Design data models for **products**, **supermarkets**, and **product ratings**
3. Set up backend infrastructure for **product database**
4. Implement core features starting with **product search** and **supermarket selection**
5. Build community features around **product reviews** and **expat recommendations**
