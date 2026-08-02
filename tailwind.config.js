/**
 * Design tokens extracted from `design/design-system.png`.
 *
 * This file is the single source of truth for styling — screens consume the tokens as
 * utility classes and never hard-code color, radius or type literals.
 *
 * Spacing is deliberately left on Tailwind's default scale, which already covers the
 * spec's 4px scale exactly: 0/1/2/3/4/5/6 map 1:1, and the larger steps land on
 * 8 (32px), 10 (40px), 12 (48px) and 16 (64px).
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: '#FFFFFF',
        surface: '#F3F4F6',
        border: '#E5E7EB',
        overlay: 'rgba(17,17,17,0.45)',

        // Ink
        ink: {
          DEFAULT: '#111111',
          muted: '#6B7280',
          inverse: '#FFFFFF',
        },

        // Brand / semantic
        primary: {
          DEFAULT: '#111111',
          press: '#2A2A2A',
        },
        green: '#16A34A',
        accent: '#FFD9A8',
        danger: '#DC2626',

        /** Third-party brand colors, only ever used for provider marks. */
        google: '#4285F4',
      },

      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '28px',
        pill: '9999px',
      },

      fontSize: {
        display: ['32px', { lineHeight: '38px' }],
        h1: ['28px', { lineHeight: '34px' }],
        h2: ['22px', { lineHeight: '28px' }],
        h3: ['18px', { lineHeight: '24px' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['12px', { lineHeight: '16px' }],
      },

      /**
       * NativeWind compiles `shadow-*` to RN's shadow props with `shadowOpacity: 1`, so the
       * spec's opacity lives in the color. `elevation` supplies the Android counterpart.
       */
      boxShadow: {
        card: '0px 2px 12px rgba(17,17,17,0.04)',
        float: '0px 6px 20px rgba(17,17,17,0.1)',
      },
      elevation: {
        card: 2,
        float: 6,
      },
    },
  },
  plugins: [],
};
