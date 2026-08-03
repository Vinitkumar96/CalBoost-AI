import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { NoPaymentDue } from '@/components/paywall/NoPaymentDue';
import { PaywallFooter } from '@/components/paywall/PaywallFooter';
import { PaywallScreen } from '@/components/paywall/PaywallScreen';
import { TimelineRow } from '@/components/paywall/TimelineRow';
import { Button } from '@/components/ui/Button';
import { annualPerMonth, useOfferings } from '@/hooks/useSubscription';
import { useRestorePurchases } from '@/hooks/useRestorePurchases';
import { TRIAL_DAYS, TRIAL_REMINDER_DAY, trialChargeDate } from '@/lib/trial';

/**
 * The trust screen. It gives away the ending — the exact date money moves — because being
 * the one to say it first is what makes the rest of the screen believable.
 */
export default function PaywallReminder() {
  const router = useRouter();
  const { annual, trialEligible } = useOfferings();
  const { restore, restoring } = useRestorePurchases();

  // Nothing on this screen is true without a trial, so an ineligible user goes straight to
  // the prices rather than reading a promise the store will refuse.
  if (!trialEligible) return <Redirect href="/(paywall)/plans" />;

  const perMonth = annualPerMonth(annual);

  return (
    <PaywallScreen
      escape="back"
      title={`We’ll send you a\nreminder before your\nfree trial ends`}
      actions={
        <>
          <NoPaymentDue />

          <Button
            label="Continue for FREE"
            onPress={() => router.push('/(paywall)/plans')}
            accessibilityHint="Continues to the plan options"
          />

          <Text className="mt-4 text-center text-caption text-ink-muted">
            Billing starts at the end of the free trial unless you cancel. Plan auto-renews.
          </Text>

          {annual ? (
            <Text className="mt-2 text-center text-small text-ink-muted">
              Just {annual.priceString} per year{perMonth ? ` (${perMonth}/mo)` : ''}
            </Text>
          ) : null}

          <PaywallFooter onRestore={restore} restoring={restoring} />
        </>
      }
    >
      <View className="mt-6 items-center">
        <Image
          source={require('@/assets/images/paywall-bell.png')}
          className="h-44 w-44"
          contentFit="contain"
          accessibilityLabel="A notification bell with one pending alert"
        />
      </View>

      <View className="mt-4">
        <TimelineRow
          icon="calendar-check"
          title="Today"
          description="Unlock all app features and start your transformation."
        />
        <TimelineRow
          icon="bell-outline"
          title={`In ${TRIAL_REMINDER_DAY} Days – Reminder`}
          description="We’ll remind you that your free trial is ending soon."
        />
        <TimelineRow
          icon="credit-card-outline"
          title={`In ${TRIAL_DAYS} Days – Billing Starts`}
          description={`You’ll be charged on ${trialChargeDate()} unless you cancel anytime.`}
          last
        />
      </View>
    </PaywallScreen>
  );
}
