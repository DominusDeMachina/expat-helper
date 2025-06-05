import { KeyboardAvoidingView, Platform, StyleSheet, View, useColorScheme } from 'react-native'
import React, { useState } from 'react'

import { Colors } from '../constants/Colors'
import { SignInForm } from '../components/auth/SignInForm'
import { SignUpForm } from '../components/auth/SignUpForm'
import { router } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const { user } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  // Redirect to main app if already authenticated
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)')
    }
  }, [user])

  const handleAuthSuccess = () => {
    // Navigate to main app after successful authentication
    router.replace('/(tabs)')
  }

  const switchToSignIn = () => {
    setIsSignUp(false)
  }

  const switchToSignUp = () => {
    setIsSignUp(true)
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.formContainer}>
          {isSignUp ? (
            <SignUpForm
              onSignInPress={switchToSignIn}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <SignInForm
              onSignUpPress={switchToSignUp}
              onSuccess={handleAuthSuccess}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
}) 