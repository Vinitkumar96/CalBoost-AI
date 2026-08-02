import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  /** Rendered to the left of the label — e.g. a provider logo. */
  icon?: React.ReactNode;
  className?: string;
  accessibilityHint?: string;
};

const container: Record<Variant, string> = {
  primary: 'min-h-14 bg-primary',
  secondary: 'min-h-14 bg-bg border border-border',
  ghost: 'min-h-11 bg-transparent',
};

const labelTone: Record<Variant, string> = {
  primary: 'text-ink-inverse',
  secondary: 'text-ink',
  ghost: 'text-ink',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  className,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'items-center justify-center rounded-pill px-5',
        container[variant],
        isDisabled ? 'opacity-40' : 'active:opacity-85',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator className={labelTone[variant]} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={cn('text-h3 font-semibold', labelTone[variant])} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
