import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Bottom-docked content — the primary CTA and any switch links. */
  footer?: React.ReactNode;
  onBack?: () => void;
};

export function AuthScreen({ title, subtitle, children, footer, onBack }: AuthScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(auth)/welcome')));

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerClassName="grow"
        // Insets are runtime device measurements, so they stay on `style`; the design's own
        // padding lives on the inner view to avoid fighting these values.
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="grow px-5 pb-6 pt-3">
          <Pressable
            onPress={back}
            className="mb-6 h-10 w-10 items-center justify-center rounded-pill bg-surface"
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} className="text-ink" />
          </Pressable>

          <Text className="text-h1 font-bold text-ink">{title}</Text>
          {subtitle ? <Text className="mt-2 text-body text-ink-muted">{subtitle}</Text> : null}

          <View className="mt-6 gap-3">{children}</View>

          {footer ? <View className="mt-auto items-center gap-4 pt-6">{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
