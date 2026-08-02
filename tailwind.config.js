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

        /** The only place color carries meaning on its own — one hue per macro. */
        macro: {
          protein: '#F0453A',
          carbs: '#F5A524',
          fat: '#FBC02D',
        },

        /** The single tinted callout in the app: the plan-reveal teaser. */
        info: {
          DEFAULT: '#EDEAFB',
          ink: '#6C5CE7',
        },

        /** Purely decorative — the celebration burst behind the plan-reveal illustration. */
        confetti: {
          purple: '#8B5CF6',
          blue: '#38BDF8',
          green: '#22C55E',
          orange: '#FB923C',
          pink: '#EC4899',
          yellow: '#FACC15',
          teal: '#2DD4BF',
          red: '#EF4444',
        },

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
        /** The single hero number on a ruler screen — deliberately larger than `display`. */
        metric: ['56px', { lineHeight: '62px' }],
        display: ['32px', { lineHeight: '38px' }],
        h1: ['28px', { lineHeight: '34px' }],
        h2: ['22px', { lineHeight: '28px' }],
        h3: ['18px', { lineHeight: '24px' }],
        body: ['16px', { lineHeight: '24px' }],
        /** The supporting line under a card title — smaller than body, larger than caption. */
        small: ['14px', { lineHeight: '20px' }],
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
