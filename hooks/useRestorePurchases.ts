import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { restore } from '@/lib/revenuecat';

/**
 * "Restore purchases", shared by all three paywall screens.
 *
 * Required by Guideline 3.1.1 and genuinely needed: a user who reinstalls, or signs in on a
 * second device, has already paid and must be able to prove it without contacting anyone.
 * Both outcomes get an explicit message — a silent no-op reads as a broken button.
 */
export function useRestorePurchases() {
  const router = useRouter();
  const [restoring, setRestoring] = useState(false);

  const run = useCallback(async () => {
    if (restoring) return;
    setRestoring(true);

    try {
      if (await restore()) {
        router.replace('/');
        return;
      }

      Alert.alert('Nothing to restore', "We couldn't find a previous purchase on this Apple ID.");
    } catch (error) {
      if (__DEV__) console.error('Restore failed:', error);
      Alert.alert('Restore failed', 'Please check your connection and try again.');
    } finally {
      setRestoring(false);
    }
  }, [restoring, router]);

  return { restore: useCallback(() => void run(), [run]), restoring };
}
