import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { cn } from '@/lib/cn';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  /** Leading glyph name from Ionicons — matches the design system's input fields. */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Inline error copy, already mapped to human language. */
  error?: string | null;
  /** Renders a reveal toggle and masks input by default. */
  secure?: boolean;
  className?: string;
};

export function TextField({ icon, error, secure = false, className, ...inputProps }: TextFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View>
      <View
        className={cn(
          'min-h-14 flex-row items-center rounded-md border bg-bg px-4',
          error ? 'border-danger' : 'border-border',
        )}
      >
        {icon ? <Ionicons name={icon} size={20} className="mr-3 text-ink-muted" /> : null}
        <TextInput
          {...inputProps}
          className={cn('min-h-11 flex-1 text-body text-ink placeholder:text-ink-muted', className)}
          secureTextEntry={secure && !revealed}
          accessibilityLabel={inputProps.accessibilityLabel ?? inputProps.placeholder}
        />
        {secure ? (
          <Pressable
            onPress={() => setRevealed((value) => !value)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
          >
            <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={20} className="text-ink-muted" />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="ml-1 mt-2 text-caption text-danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
