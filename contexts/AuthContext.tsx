import { AuthError, Session, User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '../config/supabase/client'

// Types for our authentication context
export interface UserProfile {
  id: string
  email: string
  country_of_origin: string
  current_country?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

interface SignUpData {
  email: string
  password: string
  countryOfOrigin: string
  currentCountry?: string
}

interface SignInData {
  email: string
  password: string
}

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: AuthError | null }>
  signIn: (data: SignInData) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithFacebook: () => Promise<{ error: AuthError | null }>
  signInWithMicrosoft: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  // Create user profile in database after successful signup
  const createUserProfile = async (userId: string, email: string, countryOfOrigin: string, currentCountry?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            country_of_origin: countryOfOrigin,
            current_country: currentCountry,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return { error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Unexpected error creating user profile:', err)
      return { error: err as Error }
    }
  }

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err)
      return null
    }
  }

  // Sign up with email and password
  const signUp = async (data: SignUpData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setAuthState(prev => ({ ...prev, loading: false, error: authError.message }))
        return { error: authError }
      }

      // Create user profile if user was created successfully
      if (authData.user) {
        const { error: profileError } = await createUserProfile(
          authData.user.id,
          data.email,
          data.countryOfOrigin,
          data.currentCountry
        )

        if (profileError) {
          setAuthState(prev => ({ ...prev, loading: false, error: 'Failed to create user profile' }))
          return { error: { message: 'Failed to create user profile' } as AuthError }
        }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Sign in with email and password
  const signIn = async (data: SignInData) => {
    try {
      console.log('🔐 Starting sign in process...')
      console.log('Supabase client config:', {
        url: process.env.EXPO_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
      })
      
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('❌ Supabase auth error:', error)
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      console.log('✅ Sign in successful')
      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (err) {
      console.error('🚨 Network/connection error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      
      // Specific network error handling
      if (errorMessage.includes('Network request failed') || errorMessage.includes('network')) {
        const detailedError = 'Network connection failed. Please check your internet connection and try again.'
        setAuthState(prev => ({ ...prev, loading: false, error: detailedError }))
        return { error: { message: detailedError } as AuthError }
      }
      
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      setAuthState({
        session: null,
        user: null,
        profile: null,
        loading: false,
        error: null,
      })

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Sign in with Microsoft
  const signInWithMicrosoft = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      return { error: { message: errorMessage } as AuthError }
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        return { error: new Error('No authenticated user') }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single()

      if (error) {
        return { error: new Error(error.message) }
      }

      // Update local profile state
      setAuthState(prev => ({
        ...prev,
        profile: data as UserProfile,
      }))

      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('An unexpected error occurred') }
    }
  }

  // Clear error state
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (session?.user) {
        // Fetch user profile when signed in
        const profile = await fetchUserProfile(session.user.id)
        setAuthState({
          session,
          user: session.user,
          profile,
          loading: false,
          error: null,
        })
      } else {
        // Clear state when signed out
        setAuthState({
          session: null,
          user: null,
          profile: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setAuthState({
            session,
            user: session.user,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to initialize authentication',
        }))
      }
    }

    initializeAuth()
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    resetPassword,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
} 