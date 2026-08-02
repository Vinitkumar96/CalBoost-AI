import { View } from 'react-native';

/**
 * The warm-to-cool ramp the progress fill runs through. These are raw hex values rather than
 * theme classes because the bar interpolates *between* them, which utility classes can't do.
 */
const RAMP = ['#F0453A', '#C2569E', '#7C7BDC', '#4C93F0'];

/** Enough slices to read as a gradient without banding, few enough to stay cheap. */
const SLICES = 32;

const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

/** Colour at position `t` (0–1) along the ramp. */
function rampColor(t: number) {
  const scaled = Math.min(RAMP.length - 1.0001, Math.max(0, t) * (RAMP.length - 1));
  const index = Math.floor(scaled);
  const blend = scaled - index;

  const from = hexToRgb(RAMP[index]);
  const to = hexToRgb(RAMP[index + 1]);

  const channel = (a: number, b: number) => Math.round(a + (b - a) * blend);

  return `rgb(${channel(from.r, to.r)}, ${channel(from.g, to.g)}, ${channel(from.b, to.b)})`;
}

type GradientBarProps = {
  /** 0–100. */
  progress: number;
};

/**
 * A progress bar whose fill is a gradient. Built from slices rather than
 * `expo-linear-gradient` so it needs no native module — and so no dev-client rebuild.
 */
export function GradientBar({ progress }: GradientBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View
      className="h-2.5 w-full overflow-hidden rounded-pill bg-border"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
    >
      {/* The ramp spans the *filled* width, so the leading edge is always the cool end. */}
      <View className="h-full flex-row overflow-hidden rounded-pill" style={{ width: `${clamped}%` }}>
        {Array.from({ length: SLICES }, (_, index) => (
          <View key={index} className="h-full flex-1" style={{ backgroundColor: rampColor(index / (SLICES - 1)) }} />
        ))}
      </View>
    </View>
  );
}
