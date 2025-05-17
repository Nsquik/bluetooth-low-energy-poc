import { useTheme } from "@/hooks/useTheme";
import {
  Blur,
  Canvas,
  center,
  Fill,
  fitbox,
  Group,
  Path,
} from "@shopify/react-native-skia";
import React, { useCallback, useEffect } from "react";
import {
  Easing,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CENTER_DIMENSIONS,
  heart,
  HEART_CONTAINER_DIMENSIONS,
  HEART_DIMENSIONS,
  MAX_BPM,
  MIN_BPM,
} from "./Heart.constants";
import { HeartProps } from "./Heart.types";
import { easeOutBounce, interpolateBpm } from "./Heart.utils";

export const Heart = ({ bpm }: HeartProps) => {
  const { color } = useTheme();
  const scale = useSharedValue(1);

  const clampedBpm = Math.max(MIN_BPM, Math.min(bpm, MAX_BPM));
  const duration = (60 / clampedBpm) * 1000;

  const animate = useCallback(() => {
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
  }, [duration, scale]);

  useEffect(() => {
    animate();
    const interval = setInterval(animate, duration);
    return () => {
      clearInterval(interval);
    };
  }, [clampedBpm, animate, duration]);

  const transform = useDerivedValue(() => [{ scale: scale.value }]);

  const glowTransform = useDerivedValue(() => {
    return [{ scale: interpolateBpm(clampedBpm, 1, 1.3) }];
  });

  const insideTransform = useDerivedValue(() => {
    return [{ scale: interpolateBpm(clampedBpm, 0.85, 0.95) }];
  });

  const primaryColor = useDerivedValue(() => {
    const t = Math.max(
      0,
      Math.min(1, (clampedBpm - MIN_BPM) / (MAX_BPM - MIN_BPM))
    );
    return interpolateColor(t, [0, 1], [color.primary, color.heartSecondary]);
  });
  const secondaryColor = useDerivedValue(() => {
    const t = Math.max(
      0,
      Math.min(1, (clampedBpm - MIN_BPM) / (MAX_BPM - MIN_BPM))
    );
    return interpolateColor(t, [0, 1], [color.accent, color.heartPrimary]);
  });

  return (
    <Canvas style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <Fill color={color.background} />
      <Group transform={transform} origin={CENTER_DIMENSIONS}>
        <Group
          transform={fitbox(
            "contain",
            HEART_DIMENSIONS,
            HEART_CONTAINER_DIMENSIONS
          )}
        >
          <Group transform={glowTransform} origin={center(HEART_DIMENSIONS)}>
            <Path color={primaryColor} path={heart} />
            <Blur blur={4} />
          </Group>
          <Path color={secondaryColor} path={heart} />
          <Group transform={insideTransform} origin={center(HEART_DIMENSIONS)}>
            <Path color={primaryColor} path={heart} />
            <Blur blur={6} />
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
};
