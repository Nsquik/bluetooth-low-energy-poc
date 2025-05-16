import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import { ThemedViewProps } from "./ThemedView.types";

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useTheme().color.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
