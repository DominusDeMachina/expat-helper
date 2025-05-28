# Active Context: Expat Food

## Current Status
**Date**: January 2025  
**Phase**: Project Initialization & Memory Bank Setup  
**Focus**: Establishing project foundation and documentation structure  

## Current Work Focus

### Memory Bank Initialization ✅
- **Completed**: Core memory bank structure created
- **Files Created**:
  - `projectbrief.md` - Project foundation and requirements
  - `productContext.md` - Product vision and user experience goals
  - `techContext.md` - Technology stack and technical architecture
  - `systemPatterns.md` - Design patterns and architectural decisions
  - `activeContext.md` - Current status tracking (this file)
  - `progress.md` - Development progress tracking

### Project State Analysis ✅
- **Current Structure**: Standard Expo template with tab navigation
- **Existing Components**: Basic themed components (ThemedText, ThemedView, ParallaxScrollView)
- **Navigation**: File-based routing with two tabs (Home, Explore)
- **Dependencies**: Modern React Native stack with Zustand, React Query, MMKV

## Recent Discoveries

### Project Architecture
- **Framework**: React Native 0.79.2 with Expo SDK 53.0.9
- **Navigation**: Expo Router with typed routes enabled
- **State Management**: Zustand for global state, React Query for server state
- **Storage**: MMKV for high-performance local storage
- **UI**: Custom theming system with light/dark mode support

### Current App Structure
```
app/
├── _layout.tsx           # Root layout
├── (tabs)/              # Tab navigation
│   ├── _layout.tsx      # Tab layout
│   ├── index.tsx        # Home screen (template content)
│   └── explore.tsx      # Explore screen (template content)
└── +not-found.tsx       # 404 page
```

### Existing Components
- **ThemedText**: Typography component with theme support
- **ThemedView**: Container component with theme support
- **ParallaxScrollView**: Advanced scrolling component with parallax effects
- **HelloWave**: Animated wave component (template)
- **Collapsible**: Expandable content component

## Next Immediate Steps

### 1. Project Rules Setup
- [ ] Create `.cursor/rules/project.mdc` file
- [ ] Document project-specific patterns and preferences
- [ ] Establish coding standards and conventions

### 2. Clean Template Content
- [ ] Remove template content from home screen
- [ ] Remove template content from explore screen
- [ ] Remove template components (HelloWave, etc.)
- [ ] Clean up placeholder assets

### 3. Core App Structure
- [ ] Design main navigation structure
- [ ] Create core screen layouts
- [ ] Implement basic theming system
- [ ] Set up global state management

### 4. Essential Features Foundation
- [ ] User onboarding flow
- [ ] Location services integration
- [ ] Basic restaurant listing structure
- [ ] Search and filter foundation

## Active Decisions & Considerations

### Architecture Decisions Made
1. **File-based Routing**: Using Expo Router for automatic route generation
2. **State Management**: Zustand for global state, React Query for server state
3. **Storage**: MMKV for local storage (performance-focused)
4. **UI Framework**: Custom themed components (no external UI library)
5. **Navigation**: Tab-based primary navigation with stack navigation for details

### Pending Decisions
1. **Backend Strategy**: API design and data modeling approach
2. **Authentication**: Auth provider selection (Expo Auth Session, Supabase, etc.)
3. **Maps Integration**: Google Maps vs Apple Maps vs Mapbox
4. **Image Storage**: Cloudinary, AWS S3, or other image hosting solution
5. **Push Notifications**: Expo Notifications vs native implementation

### Technical Considerations
- **Performance**: Large restaurant lists require optimization (FlashList implemented)
- **Offline Support**: Need to design offline-first data strategy
- **Internationalization**: Multi-language support for global expat community
- **Accessibility**: Full accessibility compliance required

## Current Challenges

### Template Cleanup
- Need to remove Expo template content while preserving useful components
- Maintain theming system while building custom UI
- Preserve navigation structure while customizing for app needs

### Feature Prioritization
- Balance between MVP features and user experience quality
- Determine which features are essential for initial launch
- Plan phased rollout of advanced features

### Technical Setup
- Backend API design and implementation planning
- Data modeling for restaurants, users, and reviews
- Integration planning for location services and maps

## Development Environment Status

### Setup Complete ✅
- Node.js and npm installed
- Expo CLI available
- iOS and Android development environments configured
- Project dependencies installed

### Ready for Development ✅
- Memory bank documentation complete
- Project structure understood
- Technology stack documented
- Development patterns established

## Communication Notes

### User Preferences Identified
- Focus on clean, modern UI design
- Emphasis on performance and user experience
- Community-driven features important
- Cross-platform consistency required

### Project Goals Clarified
- Help expats find authentic food from home countries
- Build community around food discovery and reviews
- Provide location-based recommendations
- Support multiple languages and cultures

## Next Session Priorities

1. **Immediate**: Create project rules file and clean template content
2. **Short-term**: Design core app navigation and basic screens
3. **Medium-term**: Implement user onboarding and location services
4. **Long-term**: Build restaurant discovery and review features

## Context for Future Sessions

When resuming work on this project:
1. **Read all memory bank files** to understand project scope and decisions
2. **Check progress.md** for latest development status
3. **Review activeContext.md** for current focus and next steps
4. **Understand the expat food discovery problem** we're solving
5. **Follow established patterns** documented in systemPatterns.md 