import { useSSO } from '@clerk/expo';
import { useSignInWithApple } from '@clerk/expo/apple';
import { useSignInWithGoogle } from '@clerk/expo/google';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { AFTER_AUTH_ROUTE } from '@/lib/authNavigation';

export type SocialProvider = 'apple' | 'google';

const IS_NATIVE = Platform.OS === 'ios' || Platform.OS === 'android';

/** Expo Go ships no third-party native modules, so the native sheets can't run there. */
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * Native Google also needs the Google Cloud client IDs the Clerk instance was configured
 * with. Without them the native module throws before it ever shows a sheet.
 */
function canUseNativeGoogle(): boolean {
  if (!IS_NATIVE || IS_EXPO_GO) return false;
  if (!process.env.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID) return false;
  if (Platform.OS === 'ios' && !process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID) return false;
  return true;
}

function canUseNativeApple(): boolean {
  return Platform.OS === 'ios' && !IS_EXPO_GO;
}

/**
 * Sign in with Apple / Google.
 *
 * Uses the fully native sheets where the build and configuration support them (iOS for
 * Apple, iOS + Android for Google in a development build) and falls back to Clerk's
 * browser SSO flow everywhere else — Expo Go, web, and before the Google client IDs are
 * configured. Both paths reach the same Clerk session.
 *
 * Unlike the email flows, SSO completes with `setActive()` rather than `finalize()`.
 */
export function useSocialAuth() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();

  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (provider: SocialProvider) => {
      if (pending) return;
      setPending(provider);
      setError(null);

      try {
        const useNative = provider === 'apple' ? canUseNativeApple() : canUseNativeGoogle();

        const result = useNative
          ? provider === 'apple'
            ? await startAppleAuthenticationFlow()
            : await startGoogleAuthenticationFlow()
          : await startSSOFlow({ strategy: provider === 'apple' ? 'oauth_apple' : 'oauth_google' });

        // No session and no throw means the user backed out of the sheet. Not an error.
        if (!result.createdSessionId || !result.setActive) return;

        await result.setActive({ session: result.createdSessionId });
        router.replace(AFTER_AUTH_ROUTE);
      } catch (err) {
        if (__DEV__) console.error(`${provider} sign-in failed:`, JSON.stringify(err, null, 2));
        setError("That didn't work. Try again, or continue with email.");
      } finally {
        setPending(null);
      }
    },
    [pending, router, startAppleAuthenticationFlow, startGoogleAuthenticationFlow, startSSOFlow],
  );

  return {
    signInWithApple: useCallback(() => start('apple'), [start]),
    signInWithGoogle: useCallback(() => start('google'), [start]),
    pending,
    error,
  };
}
