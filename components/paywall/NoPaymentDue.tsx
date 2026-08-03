import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

/**
 * "✓ No Payment Due Now", directly above every CTA.
 *
 * The one line that does the most conversion work on the whole screen: it answers the
 * question the user is actually asking at the moment their thumb hovers over the button.
 */
export function NoPaymentDue() {
  return (
    <View className="mb-4 flex-row items-center justify-center gap-2">
      <Ionicons name="checkmark" size={18} className="text-ink" />
      <Text className="text-body font-semibold text-ink">No Payment Due Now</Text>
    </View>
  );
}
