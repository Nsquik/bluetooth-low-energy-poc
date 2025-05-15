import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { Touchable } from "../Touchable";
import { ButtonProps } from "./Button.types";

export function Button({
  size = "default",
  onPress,
  ...touchableProps
}: ButtonProps) {
  const { color } = useTheme();
  return (
    <Touchable
      style={[{ backgroundColor: color.background }, styles.container]}
      onPress={onPress}
      {...touchableProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.lg,
  },
});
