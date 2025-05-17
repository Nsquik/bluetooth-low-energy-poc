import { useTheme } from "@/hooks/useTheme";
import {
  Blur,
  Canvas,
  center,
  Fill,
  fitbox,
  Group,
  Path,
  rect,
  Skia,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import {
  Easing,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { HeartProps } from "./Heart.types";

export const heart = Skia.Path.MakeFromSVGString(
  "M 32 60 C -29.2 19.6 13.2 -12 31.2 4.4 C 31.6 4.8 31.6 5.2 32 5.2 A 12.4 12.4 90 0 1 32.8 4.4 C 50.8 -12 93.2 19.6 32 60 Z"
)!;

const { width, height } = { width: 300, height: 300 };
const c = { x: width / 2, y: height / 2 };
const src = heart.computeTightBounds();
const pad = 64;
const dst1 = rect(pad, pad, width - 2 * pad, height - pad * 2);

const MAX_BPM = 170;
const MIN_BPM = 55;

function easeOutBounce(x: number): number {
  "worklet";
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

export const Heart = ({ bpm }: HeartProps) => {
  const clampedBpm = Math.max(MIN_BPM, Math.min(bpm, MAX_BPM));
  const { color } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    const duration = (60 / clampedBpm) * 1000;
    const animate = () => {
      scale.value = withSequence(
        withTiming(1.2, {
          duration: duration / 2,
          easing: Easing.in(Easing.ease),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: easeOutBounce,
        })
      );
    };

    animate();
    const interval = setInterval(animate, duration);
    return () => {
      clearInterval(interval);
    };
  }, [clampedBpm, scale]);

  const transform = useDerivedValue(() => [{ scale: scale.value }]);

  const interpolateBpm = (
    value: number,
    minOutput: number,
    maxOutput: number
  ) => {
    "worklet";
    const clamped = Math.max(MIN_BPM, Math.min(value, MAX_BPM));
    const t = (clamped - MIN_BPM) / (MAX_BPM - MIN_BPM);
    return minOutput + t * (maxOutput - minOutput);
  };

  const glowTransform = useDerivedValue(() => {
    return [{ scale: interpolateBpm(clampedBpm, 1, 1.3) }];
  });

  const insideTransform = useDerivedValue(() => {
    return [{ scale: interpolateBpm(clampedBpm, 0.85, 0.95) }];
  });

  const animatedPrimaryColor = useDerivedValue(() => {
    const t = Math.max(
      0,
      Math.min(1, (clampedBpm - MIN_BPM) / (MAX_BPM - MIN_BPM))
    );
    return interpolateColor(t, [0, 1], [color.primary, color.heartSecondary]);
  });
  const animatedSecondaryColor = useDerivedValue(() => {
    const t = Math.max(
      0,
      Math.min(1, (clampedBpm - MIN_BPM) / (MAX_BPM - MIN_BPM))
    );
    return interpolateColor(t, [0, 1], [color.accent, color.heartPrimary]);
  });

  return (
    <Canvas style={{ width, height }}>
      <Fill color={color.background} />
      <Group transform={transform} origin={c}>
        <Group transform={fitbox("contain", src, dst1)}>
          <Group transform={glowTransform} origin={center(src)}>
            <Path color={animatedPrimaryColor} path={heart} />
            <Blur blur={4} />
          </Group>
          <Path color={animatedSecondaryColor} path={heart} />
          <Group transform={insideTransform} origin={center(src)}>
            <Path color={animatedPrimaryColor} path={heart} />
            <Blur blur={6} />
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
};

Heart.displayName = "Heart";
