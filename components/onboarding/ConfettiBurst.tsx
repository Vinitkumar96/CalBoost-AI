import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

/**
 * Fixed, hand-placed positions rather than random ones: the burst is part of the layout, so
 * it must look identical on every render and every device.
 */
type Spark = { top: `${number}%`; left: `${number}%`; size: number; className: string };

const SPARKS: Spark[] = [
  { top: '4%', left: '16%', size: 14, className: 'text-confetti-purple' },
  { top: '2%', left: '38%', size: 11, className: 'text-confetti-blue' },
  { top: '5%', left: '62%', size: 12, className: 'text-confetti-orange' },
  { top: '3%', left: '84%', size: 13, className: 'text-confetti-green' },
  { top: '14%', left: '6%', size: 12, className: 'text-confetti-green' },
  { top: '18%', left: '92%', size: 12, className: 'text-confetti-orange' },
  { top: '24%', left: '13%', size: 11, className: 'text-confetti-orange' },
  { top: '22%', left: '87%', size: 10, className: 'text-confetti-yellow' },
  { top: '38%', left: '3%', size: 13, className: 'text-confetti-orange' },
  { top: '36%', left: '96%', size: 12, className: 'text-confetti-pink' },
  { top: '50%', left: '11%', size: 11, className: 'text-confetti-pink' },
  { top: '52%', left: '89%', size: 11, className: 'text-confetti-orange' },
  { top: '64%', left: '5%', size: 12, className: 'text-confetti-teal' },
  { top: '62%', left: '94%', size: 12, className: 'text-confetti-blue' },
  { top: '76%', left: '13%', size: 13, className: 'text-confetti-pink' },
  { top: '74%', left: '86%', size: 12, className: 'text-confetti-orange' },
];

/** Decorative celebration marks scattered around the plan-reveal illustration. */
export function ConfettiBurst() {
  return (
    <View pointerEvents="none" className="absolute inset-0" accessibilityElementsHidden importantForAccessibility="no">
      {SPARKS.map((spark, index) => (
        <MaterialCommunityIcons
          key={index}
          name="star-four-points"
          size={spark.size}
          className={spark.className}
          style={{ position: 'absolute', top: spark.top, left: spark.left }}
        />
      ))}
    </View>
  );
}
