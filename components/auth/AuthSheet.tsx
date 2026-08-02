import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useSocialAuth } from '@/hooks/useSocialAuth';

type AuthSheetProps = {
  visible: boolean;
  /** Drives the title and where "Continue with email" lands. */
  mode: 'sign-in' | 'sign-up';
  onClose: () => void;
  onContinueWithEmail: () => void;
};

export function AuthSheet({ visible, mode, onClose, onContinueWithEmail }: AuthSheetProps) {
  const insets = useSafeAreaInsets();
  const { signInWithApple, signInWithGoogle, pending, error } = useSocialAuth();

  const title = mode === 'sign-up' ? 'Get Started' : 'Sign In';
  const verb = mode === 'sign-up' ? 'Sign up' : 'Sign in';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Transparent by design — the sheet's shadow separates it from the screen behind,
          so this layer only exists to catch taps outside the sheet. */}
      <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close" />

      {/* Inset from every edge so the sheet reads as a floating card rather than a panel
          welded to the bottom of the screen. The bottom inset is a runtime device
          measurement, so it stays on `style` and stacks on top of the design's own gap. */}
      <View
        className="mx-3 rounded-xxl border border-border bg-bg shadow-float"
        style={{ marginBottom: insets.bottom + 12 }}
      >
        <View className="px-5 pb-6 pt-6">
          <View className="flex-row items-center justify-center">
            <Text className="text-h2 font-semibold text-ink">{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="absolute right-0 h-9 w-9 items-center justify-center rounded-pill bg-surface"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={20} className="text-ink" />
            </Pressable>
          </View>

          {error ? (
            <Text className="mt-4 text-center text-caption text-danger" accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}

          <View className="mt-6 gap-3">
            <Button
              label={`${verb} with Apple`}
              onPress={signInWithApple}
              loading={pending === 'apple'}
              disabled={pending !== null && pending !== 'apple'}
              icon={<Ionicons name="logo-apple" size={20} className="text-ink-inverse" />}
            />
            <Button
              label={`${verb} with Google`}
              onPress={signInWithGoogle}
              variant="secondary"
              loading={pending === 'google'}
              disabled={pending !== null && pending !== 'google'}
              icon={<Ionicons name="logo-google" size={20} className="text-google" />}
            />
            <Button
              label="Continue with email"
              onPress={onContinueWithEmail}
              variant="secondary"
              disabled={pending !== null}
              icon={<Ionicons name="mail-outline" size={20} className="text-ink" />}
            />
          </View>

          <Text className="mt-5 px-2 text-center text-caption text-ink-muted">
            We will collect personal information from and about you and use it for various purposes, including to
            customize your experience. Read more in our Privacy Policy.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
