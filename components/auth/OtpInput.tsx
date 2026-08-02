import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';

import { cn } from '@/lib/cn';

const CELL_COUNT = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Fired once the last digit lands, so the screen can auto-submit. */
  onComplete: (value: string) => void;
  /** Shakes the cells when this flips to true. */
  invalid?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
};

/**
 * Six-cell code entry backed by a single hidden input — keeps paste, autofill and
 * hardware keyboards working, which per-cell inputs break.
 */
export function OtpInput({ value, onChange, onComplete, invalid = false, editable = true, autoFocus = true }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!invalid) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [invalid, shake]);

  const handleChange = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, CELL_COUNT);
    onChange(digits);
    if (digits.length === CELL_COUNT) onComplete(digits);
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} accessibilityRole="none">
      {/* The shake is a driven animated value, so the transform stays on `style`. */}
      <Animated.View className="flex-row justify-between gap-2" style={{ transform: [{ translateX: shake }] }}>
        {Array.from({ length: CELL_COUNT }).map((_, index) => {
          const char = value[index] ?? '';
          const focused = editable && index === Math.min(value.length, CELL_COUNT - 1);
          return (
            <View
              key={index}
              className={cn(
                'h-[60px] flex-1 items-center justify-center rounded-md border',
                char ? 'bg-bg' : 'bg-surface',
                invalid ? 'border-danger' : focused ? 'border-ink' : 'border-border',
              )}
            >
              <Text className="text-h2 font-semibold text-ink">{char}</Text>
            </View>
          );
        })}
      </Animated.View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        editable={editable}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CELL_COUNT}
        className="absolute h-px w-px opacity-0"
        accessibilityLabel="Verification code"
      />
    </Pressable>
  );
}
