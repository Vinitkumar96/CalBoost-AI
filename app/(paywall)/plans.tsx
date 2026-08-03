import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { NoPaymentDue } from '@/components/paywall/NoPaymentDue';
import { PaywallFooter } from '@/components/paywall/PaywallFooter';
import { PaywallScreen } from '@/components/paywall/PaywallScreen';
import { PlanCard } from '@/components/paywall/PlanCard';
import { TrialTimeline } from '@/components/paywall/TrialTimeline';
import { Button } from '@/components/ui/Button';
import { AUTO_RENEW_DISCLOSURE } from '@/constants/legal';
import { annualSavingPercent, useOfferings } from '@/hooks/useSubscription';
import { useRestorePurchases } from '@/hooks/useRestorePurchases';
import { purchase } from '@/lib/revenuecat';
import { TRIAL_DAYS, TRIAL_REMINDER_DAY, trialChargeDate } from '@/lib/trial';

/** Two shimmerless placeholders — the shape of the answer while StoreKit resolves. */
function PlanCardSkeleton() {
  return (
    <View className="flex-1 rounded-xl border-2 border-border px-4 py-4">
      <View className="h-5 w-20 rounded-sm bg-surface" />
      <View className="mt-4 h-7 w-24 rounded-sm bg-surface" />
      <View className="mt-4 h-6 w-28 rounded-pill bg-surface" />
    </View>
  );
}

export default function PaywallPlans() {
  const router = useRouter();
  const { monthly, annual, loading, error, trialEligible, retry } = useOfferings();
  const { restore, restoring } = useRestorePurchases();

  // Annual is pre-selected and stays pre-selected: it is the plan the business needs and the
  // better deal for the user, so making it the default costs nobody anything.
  const [selected, setSelected] = useState<'monthly' | 'annual'>('annual');
  const [purchasing, setPurchasing] = useState(false);

  const savings = annualSavingPercent(monthly, annual);
  const selectedPackage = selected === 'annual' ? annual : monthly;

  const onPurchase = async () => {
    if (!selectedPackage || purchasing) return;
    setPurchasing(true);

    try {
      const outcome = await purchase(selectedPackage);

      // Backing out of the sheet is a normal thing to do, not a failure. Anything shown here
      // would read as scolding someone for changing their mind.
      if (outcome === 'cancelled') return;

      router.replace('/');
    } catch (err) {
      if (__DEV__) console.error('Purchase failed:', err);
      Alert.alert('Purchase failed', 'Something went wrong with the App Store. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  // StoreKit unreachable. The escape hatch matters as much as the retry: a user stuck on a
  // screen that can't load and can't be left will delete the app, not email support.
  if (error !== null) {
    return (
      <PaywallScreen
        escape="back"
        title="We can’t reach the App Store"
        subtitle={error}
        actions={
          <>
            <Button label="Try again" onPress={retry} />
            <Button
              label="Continue with limited access"
              onPress={() => router.replace('/')}
              variant="ghost"
              className="mt-2"
            />
            <PaywallFooter onRestore={restore} restoring={restoring} />
          </>
        }
      >
        <View />
      </PaywallScreen>
    );
  }

  return (
    <PaywallScreen
      escape="back"
      title={trialEligible ? `Start your ${TRIAL_DAYS}-day\nFREE trial to continue` : 'Choose your plan'}
      subtitle={trialEligible ? 'Cancel anytime. You’re in control.' : 'Cancel anytime in the App Store.'}
      actions={
        <>
          {trialEligible ? <NoPaymentDue /> : null}

          <Button
            label={trialEligible ? `Start My ${TRIAL_DAYS}-Day Free Trial` : 'Subscribe'}
            onPress={() => void onPurchase()}
            loading={purchasing}
            disabled={loading || selectedPackage === null}
          />

          {/* Price, period, trial length, and auto-renewal all visible without scrolling —
              the combination App Review checks for on any subscription screen. */}
          <Text className="mt-4 text-center text-caption text-ink-muted">
            {selectedPackage
              ? `${
                  trialEligible ? `${TRIAL_DAYS} days free, then ` : ''
                }${selectedPackage.priceString} per ${selected === 'annual' ? 'year' : 'month'}. ${AUTO_RENEW_DISCLOSURE}`
              : AUTO_RENEW_DISCLOSURE}
          </Text>

          <PaywallFooter onRestore={restore} restoring={restoring} disabled={purchasing} />
        </>
      }
    >
      {trialEligible ? (
        <TrialTimeline
          steps={[
            { icon: 'lock-open-outline', title: 'Today', description: 'You get full access to all premium features.' },
            {
              icon: 'bell-outline',
              title: `In ${TRIAL_REMINDER_DAY} Days – Reminder`,
              description: 'We’ll notify you before your trial ends.',
            },
            {
              icon: 'crown-outline',
              title: `In ${TRIAL_DAYS} Days – Billing Starts`,
              description: `You’ll be charged on ${trialChargeDate()} unless you cancel.`,
            },
          ]}
        />
      ) : null}

      <View className="mt-8 flex-row gap-3">
        {loading ? (
          <>
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </>
        ) : (
          <>
            {monthly ? (
              <PlanCard
                title="Monthly"
                price={monthly.priceString}
                unit="/mo"
                selected={selected === 'monthly'}
                onPress={() => setSelected('monthly')}
                disabled={purchasing}
              />
            ) : null}

            {annual ? (
              <PlanCard
                title="Yearly"
                price={annual.priceString}
                unit="/yr"
                selected={selected === 'annual'}
                onPress={() => setSelected('annual')}
                disabled={purchasing}
                badge={trialEligible ? `${TRIAL_DAYS} DAYS FREE` : undefined}
                note={savings === null ? 'Best Value' : `Best Value · Save ${savings}%`}
              />
            ) : null}
          </>
        )}
      </View>
    </PaywallScreen>
  );
}
