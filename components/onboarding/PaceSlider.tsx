import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';

import { cn } from '@/lib/cn';

const KNOB_SIZE = 26;
const STOP_SIZE = 14;

type PaceSliderProps = {
  /** Number of discrete stops, laid out evenly from left to right. */
  stops: number;
  /** 0-based index of the selected stop. */
  index: number;
  onChange: (index: number) => void;
  accessibilityLabel: string;
};

/**
 * A discrete slider: the knob snaps between evenly spaced stops, and the whole track is
 * draggable rather than just the knob, so a rough swipe still lands on a value.
 */
export function PaceSlider({ stops, index, onChange, accessibilityLabel }: PaceSliderProps) {
  const [width, setWidth] = useState(0);

  // The pan handlers are created once, so they'd otherwise close over the first render's
  // width and index forever. Refs keep them reading current values.
  const widthRef = useRef(0);
  const indexRef = useRef(index);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const panResponder = useMemo(() => {
    const selectFrom = (x: number) => {
      const trackWidth = widthRef.current;
      if (trackWidth <= 0) return;

      const nearest = Math.round((x / trackWidth) * (stops - 1));
      const clamped = Math.min(stops - 1, Math.max(0, nearest));

      if (clamped !== indexRef.current) onChangeRef.current(clamped);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => selectFrom(event.nativeEvent.locationX),
      onPanResponderMove: (event) => selectFrom(event.nativeEvent.locationX),
    });
  }, [stops]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.width;
    widthRef.current = measured;
    setWidth(measured);
  };

  const fraction = stops > 1 ? index / (stops - 1) : 0;
  const knobX = fraction * width;

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={handleLayout}
      // The track is thin but the gesture target is a comfortable thumb height.
      className="h-10 justify-center"
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: stops - 1, now: index }}
    >
      <View className="h-1 rounded-pill bg-border" />
      <View className="absolute h-1 rounded-pill bg-ink" style={{ width: knobX }} />

      {Array.from({ length: stops }, (_, stop) => (
        <View
          key={stop}
          className={cn(
            'absolute rounded-pill border-2 bg-bg',
            // Stops behind the knob sit on the filled part of the track and take its colour.
            stop <= index ? 'border-ink' : 'border-border',
          )}
          style={{
            height: STOP_SIZE,
            width: STOP_SIZE,
            left: (stop / (stops - 1)) * width - STOP_SIZE / 2,
          }}
        />
      ))}

      {/* Drawn last so it sits above the stop it covers. The `border-bg` ring is the halo
          that separates the knob from the track behind it. */}
      <View
        className="absolute rounded-pill border-4 border-bg bg-ink shadow-card"
        style={{ height: KNOB_SIZE, width: KNOB_SIZE, left: knobX - KNOB_SIZE / 2 }}
      />
    </View>
  );
}
