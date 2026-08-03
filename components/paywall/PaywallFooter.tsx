import * as WebBrowser from 'expo-web-browser';
import { Pressable, Text, View } from 'react-native';

import { PRIVACY_URL, TERMS_URL } from '@/constants/legal';

/**
 * Terms · Privacy · Restore.
 *
 * All three are required on a subscription screen: the first two by Guideline 3.1.2, and
 * Restore by 3.1.1 — a user who reinstalls has to be able to get back what they paid for
 * without contacting support.
 */

type PaywallFooterProps = {
  onRestore: () => void;
  restoring?: boolean;
  disabled?: boolean;
};

function FooterLink({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={12} accessibilityRole="link" accessibilityLabel={label}>
      <Text className="text-caption text-ink-muted underline">{label}</Text>
    </Pressable>
  );
}

export function PaywallFooter({ onRestore, restoring = false, disabled = false }: PaywallFooterProps) {
  // An in-app browser rather than `Linking.openURL`: leaving the app to Safari mid-purchase
  // loses the user, and a modal that dismisses back to the paywall does not.
  const open = (url: string) => void WebBrowser.openBrowserAsync(url).catch(() => undefined);

  return (
    <View className="mt-4 flex-row items-center justify-center gap-5">
      <FooterLink label="Terms" onPress={() => open(TERMS_URL)} disabled={disabled} />
      <FooterLink label="Privacy" onPress={() => open(PRIVACY_URL)} disabled={disabled} />
      <FooterLink
        label={restoring ? 'Restoring…' : 'Restore'}
        onPress={onRestore}
        disabled={disabled || restoring}
      />
    </View>
  );
}
