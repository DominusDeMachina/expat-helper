import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Expat Food Finder!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* User Information Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Your Profile</ThemedText>
        <ThemedText>
          Email: <ThemedText type="defaultSemiBold">{user?.email}</ThemedText>
        </ThemedText>
        {profile?.country_of_origin && (
          <ThemedText>
            Country of Origin: <ThemedText type="defaultSemiBold">{profile.country_of_origin}</ThemedText>
          </ThemedText>
        )}
        {profile?.current_country && (
          <ThemedText>
            Current Country: <ThemedText type="defaultSemiBold">{profile.current_country}</ThemedText>
          </ThemedText>
        )}
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Find Your Home Flavors</ThemedText>
        <ThemedText>
          Discover supermarket products that taste like home. Search for familiar brands and products from your country of origin, now available in local supermarkets.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Explore Products</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to browse products by category, country, or supermarket chain.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Share Your Discoveries</ThemedText>
        <ThemedText>
          Found a product that reminds you of home? Share it with the community to help other expats find their favorite flavors.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  signOutText: {
    color: 'white',
    fontWeight: '600',
  },
});
