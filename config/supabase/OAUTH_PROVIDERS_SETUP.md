# OAuth Providers Setup Guide for Supabase

This guide explains how to configure Google, Facebook, and Microsoft OAuth providers in your Supabase project for the Expat Food app.

## Prerequisites

- Active Supabase project (see `SETUP_GUIDE.md`)
- Developer accounts with Google, Facebook, and/or Microsoft
- Your app's bundle identifiers:
  - iOS: `com.furduy.expatfood`
  - Android: `com.furduy.expatfood`
  - Expo scheme: `expatfood`

## Important: Redirect URLs

Before setting up providers, you'll need these redirect URLs for your Supabase project:

**For Development (Expo):**
```
https://[your-project-id].supabase.co/auth/v1/callback
```

**For Production (when published):**
```
https://[your-project-id].supabase.co/auth/v1/callback
```

Replace `[your-project-id]` with your actual Supabase project ID.

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it something like "Expat Food App"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen first:
   - **Application type**: External
   - **Application name**: "Expat Food"
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **Authorized domains**: Add your domain if you have one
4. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: "Expat Food Web Client"
   - **Authorized redirect URIs**: Add your Supabase callback URL:
     ```
     https://[your-project-id].supabase.co/auth/v1/callback
     ```

### Step 4: Configure in Supabase

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Google" and toggle it ON
3. Enter your credentials:
   - **Client ID**: Copy from Google Cloud Console
   - **Client Secret**: Copy from Google Cloud Console
4. Click "Save"

### Step 5: Configure Mobile App (Optional for Native)

If you want to use native Google Sign-In (better UX):

1. In Google Cloud Console, create additional OAuth clients:
   - **Android OAuth Client**:
     - Application type: Android
     - Package name: `com.furduy.expatfood`
     - SHA-1 certificate fingerprint: (get from your keystore)
   - **iOS OAuth Client**:
     - Application type: iOS
     - Bundle ID: `com.furduy.expatfood`

---

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" or "Business" (Consumer is fine for most cases)
4. Fill in app details:
   - **App Name**: "Expat Food"
   - **Contact Email**: Your email

### Step 2: Configure Facebook Login

1. In your Facebook app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Enter your Site URL: `https://[your-project-id].supabase.co`

### Step 3: Configure OAuth Redirect

1. Go to "Facebook Login" → "Settings"
2. Add Valid OAuth Redirect URIs:
   ```
   https://[your-project-id].supabase.co/auth/v1/callback
   ```

### Step 4: Get App Credentials

1. Go to "Settings" → "Basic"
2. Copy your **App ID** and **App Secret**

### Step 5: Configure in Supabase

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Facebook" and toggle it ON
3. Enter your credentials:
   - **Client ID**: Your Facebook App ID
   - **Client Secret**: Your Facebook App Secret
4. Click "Save"

### Step 6: Make App Live (Production)

1. In Facebook app dashboard, go to "App Review"
2. Make your app live to allow any Facebook user to sign in
3. Before going live, you may need to add privacy policy URL and terms of service

---

## 3. Microsoft (Azure) OAuth Setup

### Step 1: Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Fill in details:
   - **Name**: "Expat Food App"
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: 
     - Platform: Web
     - URI: `https://[your-project-id].supabase.co/auth/v1/callback`

### Step 2: Configure Authentication

1. In your app registration, go to "Authentication"
2. Under "Platform configurations", ensure Web is configured with your redirect URI
3. Under "Implicit grant and hybrid flows", enable:
   - ✅ Access tokens
   - ✅ ID tokens

### Step 3: Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description: "Supabase OAuth"
4. Choose expiration (24 months recommended)
5. Copy the **Value** (this is your client secret)

### Step 4: Get Application ID

1. Go to "Overview"
2. Copy the **Application (client) ID**

### Step 5: Configure in Supabase

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Azure" and toggle it ON
3. Enter your credentials:
   - **Client ID**: Your Application (client) ID
   - **Client Secret**: The client secret value you copied
4. Click "Save"

---

## 4. Configure Supabase Auth Settings

### Required Settings

1. In Supabase dashboard, go to "Authentication" → "Settings"
2. Configure the following:

**Site URL:**
```
https://your-domain.com
```
*For development, you can use `http://localhost:3000` or your Expo development URL*

**Redirect URLs (add all that apply):**
```
https://your-domain.com/**
http://localhost:3000/**
exp://localhost:8081/--/**
expatfood://**
```

### Email Templates (Optional)

1. Go to "Authentication" → "Email Templates"
2. Customize the confirmation and password reset emails if desired

---

## 5. Testing OAuth Providers

### Test in Development

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app and navigate to the sign-in screen

3. Try each OAuth provider button:
   - Should open a browser/webview
   - Complete authentication on the provider's site
   - Should redirect back to your app
   - User should be signed in

### Common Issues & Solutions

**"Redirect URI mismatch" errors:**
- Ensure all redirect URIs are exactly the same in your provider settings and Supabase
- Check for trailing slashes or protocol differences

**"App not verified" warnings (Google):**
- This is normal during development
- Submit for verification when ready for production

**"App not live" errors (Facebook):**
- Make sure your Facebook app is live in production
- During development, add test users in Facebook app dashboard

**"Consent required" (Microsoft):**
- This is normal for Microsoft OAuth
- Users will see a consent screen the first time

---

## 6. Production Considerations

### Security Best Practices

1. **Rotate secrets regularly** (every 6-12 months)
2. **Monitor OAuth usage** in each provider's console
3. **Set up rate limiting** if needed
4. **Review app permissions** periodically

### App Store Requirements

**iOS (Apple App Store):**
- If using social login, you must also offer "Sign in with Apple"
- Consider adding Apple OAuth as well

**Android (Google Play):**
- Ensure your OAuth setup matches your Play Console app

### Privacy & Legal

1. **Update Privacy Policy** to mention third-party authentication
2. **Terms of Service** should cover OAuth usage
3. **GDPR/CCPA compliance** if applicable
4. **Data retention policies** for OAuth user data

---

## 7. Troubleshooting

### Enable Debug Logging

Add this to your app to see OAuth debug info:

```typescript
// In your AuthContext or main app file
if (__DEV__) {
  console.log('OAuth Debug Info:', {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    redirectUrl: AuthSession.makeRedirectUri(),
  })
}
```

### Common Error Codes

- **`invalid_request`**: Check your client ID and redirect URI
- **`access_denied`**: User cancelled or app not approved
- **`server_error`**: Provider issue, try again later
- **`temporarily_unavailable`**: Provider maintenance

### Testing Checklist

- [ ] Google OAuth opens browser and completes flow
- [ ] Facebook OAuth opens browser and completes flow  
- [ ] Microsoft OAuth opens browser and completes flow
- [ ] User profile is created in Supabase after first login
- [ ] Subsequent logins work without re-consent
- [ ] Error handling works (user cancels, network issues)

---

## Support & Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

---

*Last updated: December 2024* 