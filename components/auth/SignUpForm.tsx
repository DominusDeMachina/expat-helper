import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'

import { Colors } from '../../constants/Colors'
import { useAuth } from '../../contexts/AuthContext'

// Common countries for expats - can be expanded
const COUNTRIES = [
  'Ukraine',
  'Bulgaria',
  'Romania',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Slovakia',
  'Croatia',
  'Serbia',
  'Montenegro',
  'Bosnia and Herzegovina',
  'Albania',
  'Macedonia',
  'Kosovo',
  'United States',
  'United Kingdom', 
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Australia',
  'Canada',
  'Japan',
  'South Korea',
  'Singapore',
  'Brazil',
  'Argentina',
  'Mexico',
  'India',
  'China',
  'Russia',
  'Other'
].sort()

interface SignUpFormProps {
  onSignInPress?: () => void
  onSuccess?: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSignInPress, onSuccess }) => {
  const { signUp, loading, error, clearError } = useAuth()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    countryOfOrigin: '',
    currentCountry: '',
  })

  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [showCurrentCountryPicker, setShowCurrentCountryPicker] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Country of origin validation - required
    if (!formData.countryOfOrigin) {
      errors.countryOfOrigin = 'Country of origin is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) {
      return
    }

    clearError()

    const { error } = await signUp({
      email: formData.email.trim(),
      password: formData.password,
      countryOfOrigin: formData.countryOfOrigin,
      currentCountry: formData.currentCountry || undefined,
    })

    if (error) {
      Alert.alert('Sign Up Failed', error.message)
    } else {
      Alert.alert(
        'Sign Up Successful!',
        'Please check your email for a confirmation link before signing in.',
        [{ text: 'OK', onPress: onSuccess }]
      )
    }
  }

  const CountryPicker = ({ 
    visible, 
    onSelect, 
    onCancel, 
    selectedCountry 
  }: { 
    visible: boolean
    onSelect: (country: string) => void
    onCancel: () => void
    selectedCountry: string
  }) => {
    if (!visible) return null

    return (
      <View style={styles.overlay}>
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Country</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={[styles.cancelButton, { color: colors.tint }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countriesList}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country}
                style={[
                  styles.countryItem,
                  selectedCountry === country && { backgroundColor: colors.tint + '20' }
                ]}
                onPress={() => onSelect(country)}
              >
                <Text style={[styles.countryText, { color: colors.text }]}>{country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Join the expat community and discover food products that taste like home
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
          />
          {formErrors.password && (
            <Text style={[styles.errorText, { color: colors.notification }]}>{formErrors.password}</Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              formErrors.confirmPassword && { borderColor: colors.notification }
            ]}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirm your password"
            placeholderTextColor={colors.text + '80'}
            secureTextEntry
          />
          {formErrors.confirmPassword && (
            <Text style={[styles.errorText, { color: colors.notification }]}>{formErrors.confirmPassword}</Text>
          )}
        </View>

        {/* Country of Origin - Required */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Country of Origin <Text style={{ color: colors.notification }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.pickerInput,
              { backgroundColor: colors.card, borderColor: colors.border },
              formErrors.countryOfOrigin && { borderColor: colors.notification }
            ]}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={[
              styles.pickerText,
              { color: formData.countryOfOrigin ? colors.text : colors.text + '80' }
            ]}>
              {formData.countryOfOrigin || 'Select your country of origin'}
            </Text>
          </TouchableOpacity>
          {formErrors.countryOfOrigin && (
            <Text style={[styles.errorText, { color: colors.notification }]}>{formErrors.countryOfOrigin}</Text>
          )}
          <Text style={[styles.helpText, { color: colors.text + '80' }]}>
            This helps us show you reviews from people with similar taste preferences
          </Text>
        </View>

        {/* Current Country - Optional */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Current Country (Optional)</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.pickerInput,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            onPress={() => setShowCurrentCountryPicker(true)}
          >
            <Text style={[
              styles.pickerText,
              { color: formData.currentCountry ? colors.text : colors.text + '80' }
            ]}>
              {formData.currentCountry || 'Select where you currently live'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.helpText, { color: colors.text + '80' }]}>
            This helps us show you local supermarkets and available products
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, { backgroundColor: colors.tint }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={[styles.signUpButtonText, { color: '#FFFFFF' }]}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: colors.text }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={onSignInPress}>
            <Text style={[styles.signInLink, { color: colors.tint }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country Pickers */}
      <CountryPicker
        visible={showCountryPicker}
        selectedCountry={formData.countryOfOrigin}
        onSelect={(country) => {
          setFormData(prev => ({ ...prev, countryOfOrigin: country }))
          setShowCountryPicker(false)
        }}
        onCancel={() => setShowCountryPicker(false)}
      />

      <CountryPicker
        visible={showCurrentCountryPicker}
        selectedCountry={formData.currentCountry}
        onSelect={(country) => {
          setFormData(prev => ({ ...prev, currentCountry: country }))
          setShowCurrentCountryPicker(false)
        }}
        onCancel={() => setShowCurrentCountryPicker(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  pickerInput: {
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
  },
  helpText: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  signUpButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
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
  pickerContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  countriesList: {
    maxHeight: 400,
  },
  countryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryText: {
    fontSize: 16,
  },
}) 