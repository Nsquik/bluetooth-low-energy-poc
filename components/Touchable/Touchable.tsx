import {
  ImpactFeedbackStyle,
  impactAsync as triggerHaptics,
} from "expo-haptics";
import { TouchableOpacity } from "react-native";
import { TouchableProps } from "./Touchable.types";
import { mapHapticStrength } from "./Touchable.utils";

export function Touchable(props: TouchableProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      onPressIn={(ev) => {
        if (props.haptic) {
          const hapticStrength =
            mapHapticStrength[props.haptic] ?? ImpactFeedbackStyle.Light;
          triggerHaptics(hapticStrength);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
