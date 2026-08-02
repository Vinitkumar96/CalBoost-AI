import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * NativeWind only maps React Native's core components out of the box. Everything below
 * forwards `style` to a core component — Ionicons renders a `<Text>` (so `text-*` colors
 * apply), expo-image a view, and `Animated.View` is a distinct type from `View` — so a
 * plain `className` → `style` mapping is enough.
 *
 * Imported for its side effect from the root layout, before any screen renders.
 */
cssInterop(Ionicons, { className: 'style' });
cssInterop(Image, { className: 'style' });
cssInterop(Animated.View, { className: 'style' });
cssInterop(GestureHandlerRootView, { className: 'style' });
