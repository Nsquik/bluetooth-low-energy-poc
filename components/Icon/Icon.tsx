// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ICON_MAPPING } from "./Icon.constants";
import { IconPropsAndroid } from "./Icon.types";

export function Icon({ name, size = 24, color, style }: IconPropsAndroid) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={ICON_MAPPING[name]}
      style={style}
    />
  );
}
