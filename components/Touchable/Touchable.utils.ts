import { ImpactFeedbackStyle } from "expo-haptics";
import { MapHapticStrength } from "./Touchable.types";

export const mapHapticStrength: MapHapticStrength = {
  soft: ImpactFeedbackStyle.Light,
  medium: ImpactFeedbackStyle.Medium,
  heavy: ImpactFeedbackStyle.Heavy,
};
