import {
  ImpactFeedbackStyle,
  impactAsync as triggerHaptics,
} from "expo-haptics";
import { Pressable } from "react-native";
import { TouchableProps } from "./Touchable.types";
import { mapHapticStrength } from "./Touchable.utils";

export function Touchable(props: TouchableProps) {
  return (
    <Pressable
      {...props}
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
