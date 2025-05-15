import { ImpactFeedbackStyle } from "expo-haptics";
import { PressableProps } from "react-native";

export type TouchableProps = PressableProps & {
  haptic?: "soft" | "medium" | "heavy";
};

export type MapHapticStrength = Record<
  NonNullable<TouchableProps["haptic"]>,
  ImpactFeedbackStyle
>;
