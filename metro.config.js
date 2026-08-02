const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// NativeWind defaults `rem` to 14 on native, which would silently shrink every rem-based
// utility by 12.5% (`gap-4` → 14px, `min-h-14` → 49px). The design tokens are specified in
// px against Tailwind's documented scale, so pin rem to 16 to make the two line up.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
