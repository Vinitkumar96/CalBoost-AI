import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { NoPaymentDue } from '@/components/paywall/NoPaymentDue';
import { PaywallFooter } from '@/components/paywall/PaywallFooter';
import { PaywallScreen } from '@/components/paywall/PaywallScreen';
import { Button } from '@/components/ui/Button';
import { annualPerMonth, useOfferings } from '@/hooks/useSubscription';
import { useRestorePurchases } from '@/hooks/useRestorePurchases';
import { TRIAL_DAYS } from '@/lib/trial';

/**
 * The first of three. Its whole job is to establish that nothing is being taken today, so the
 * user reaches the plan cards already past the objection that stops most purchases.
 *
 * Deliberately makes no store call beyond reading the price — the purchase happens two
 * screens later, and asking for money here would waste the momentum from the plan reveal.
 */
export default function PaywallIntro() {
  const router = useRouter();
  const { annual, trialEligible } = useOfferings();
  const { restore, restoring } = useRestorePurchases();

  const perMonth = annualPerMonth(annual);

  return (
    <PaywallScreen
      escape="close"
      title={
        <>
          We want you to{'\n'}try <Text className="text-green">CalBoost</Text> AI for free
        </>
      }
      subtitle={
        trialEligible
          ? `Experience the full power of AI nutrition coaching — free for ${TRIAL_DAYS} days.`
          : 'Experience the full power of AI nutrition coaching.'
      }
      actions={
        <>
          {trialEligible ? <NoPaymentDue /> : null}

          <Button
            label={trialEligible ? 'Try CalBoost AI Now' : 'Choose your plan'}
            onPress={() => router.push('/(paywall)/reminder')}
            accessibilityHint="Continues to the plan options"
          />

          {/* The price is stated before the user commits to another screen, not after. */}
          {annual ? (
            <Text className="mt-4 text-center text-small text-ink-muted">
              Just {annual.priceString} per year{perMonth ? ` (${perMonth}/mo)` : ''}
            </Text>
          ) : null}

          <PaywallFooter onRestore={restore} restoring={restoring} />
        </>
      }
    >
      <View className="mt-8 flex-1 items-center justify-center">
        <Image
          source={require('@/assets/images/paywall-mobile.png')}
          className="h-96 w-full"
          contentFit="contain"
          accessibilityLabel="The CalBoost nutrition screen showing a scanned meal with its calories and macros"
        />
      </View>
    </PaywallScreen>
  );
}
