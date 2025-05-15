import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Touchable } from "../Touchable";
import { ButtonProps } from "./Button.types";

export function Button({
  size = "default",
  text,
  onPress,
  ...touchableProps
}: ButtonProps) {
  const { color } = useTheme();
  return (
    <Touchable
      style={[{ backgroundColor: color.primary }, styles.container]}
      onPress={onPress}
      {...touchableProps}
    >
      <ThemedText>{text}</ThemedText>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: "center",
  },
});
