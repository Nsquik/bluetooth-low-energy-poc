import { ImpactFeedbackStyle } from "expo-haptics";
import { TouchableOpacityProps } from "react-native";

export type TouchableProps = TouchableOpacityProps & {
  haptic?: "soft" | "medium" | "heavy";
};

export type MapHapticStrength = Record<
  NonNullable<TouchableProps["haptic"]>,
  ImpactFeedbackStyle
>;
