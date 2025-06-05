import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState } from 'react'

import { Colors } from '../../constants/Colors'
import { useAuth } from '../../contexts/AuthContext'

interface SignInFormProps {
  onSignUpPress?: () => void
  onSuccess?: () => void
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSignUpPress, onSuccess }) => {
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithMicrosoft, resetPassword, loading, error, clearError } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignIn = async () => {
    if (!validateForm()) {
      return
    }

    clearError()

    const { error } = await signIn({
      email: formData.email.trim(),
      password: formData.password,
    })

    if (error) {
      Alert.alert('Sign In Failed', error.message)
    } else {
      onSuccess?.()
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      Alert.alert('Email Required', 'Please enter your email address first')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }

    const { error } = await resetPassword(formData.email.trim())

    if (error) {
      Alert.alert('Reset Failed', error.message)
    } else {
      Alert.alert(
        'Password Reset Sent',
        'Check your email for password reset instructions.',
        [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
      )
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'microsoft') => {
    clearError()

    let signInFunction
    switch (provider) {
      case 'google':
        signInFunction = signInWithGoogle
        break
      case 'facebook':
        signInFunction = signInWithFacebook
        break
      case 'microsoft':
        signInFunction = signInWithMicrosoft
        break
    }

    const { error } = await signInFunction()

    if (error) {
      Alert.alert('Sign In Failed', error.message)
    }
    // Note: OAuth success will be handled by the auth state change listener
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Sign in to discover food products that taste like home
      </Text>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.notification + '20' }]}>
          <Text style={[styles.errorText, { color: colors.notification }]}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              formErrors.email && { borderColor: colors.notification }
            ]}
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Enter your email"
            placeholderTextColor={colors.text + '80'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          {formErrors.email && (
            <Text style={[styles.errorText, { color: colors.notification }]}>{formErrors.email}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              formErrors.password && { borderColor: colors.notification }
            ]}
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Enter your password"
            placeholderTextColor={colors.text + '80'}
            secureTextEntry
            autoComplete="password"
          />
          {formErrors.password && (
            <Text style={[styles.errorText, { color: colors.notification }]}>{formErrors.password}</Text>
          )}
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => setShowForgotPassword(true)}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
            Forgot your password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: colors.tint }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={[styles.signInButtonText, { color: '#FFFFFF' }]}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.text }]}>or continue with</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* OAuth Buttons */}
        <View style={styles.oauthContainer}>
          <TouchableOpacity
            style={[styles.oauthButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleOAuthSignIn('google')}
            disabled={loading}
          >
            <Text style={[styles.oauthButtonText, { color: colors.text }]}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleOAuthSignIn('facebook')}
            disabled={loading}
          >
            <Text style={[styles.oauthButtonText, { color: colors.text }]}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleOAuthSignIn('microsoft')}
            disabled={loading}
          >
            <Text style={[styles.oauthButtonText, { color: colors.text }]}>Microsoft</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: colors.text }]}>
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={[styles.signUpLink, { color: colors.tint }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <View style={styles.overlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Password</Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
            
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
              ]}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              placeholderTextColor={colors.text + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowForgotPassword(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.resetButton, { backgroundColor: colors.tint }]}
                onPress={handleForgotPassword}
              >
                <Text style={[styles.resetButtonText, { color: '#FFFFFF' }]}>Send Reset Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.8,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  oauthButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    // backgroundColor set dynamically
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}) 