import React, { useEffect } from 'react'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'

import { Colors } from '../../constants/Colors'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth screen if not authenticated
      router.replace('/auth')
    }
  }, [user, loading])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    )
  }

  // Show children only if authenticated
  if (user) {
    return <>{children}</>
  }

  // Show nothing while redirecting (prevent flash of content)
  return null
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
}) 