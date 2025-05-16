import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { Loader } from "../Loader";
import { ThemedText } from "../ThemedText";
import { Touchable } from "../Touchable";
import { ButtonProps } from "./Button.types";

export function Button({
  size = "default",
  text,
  onPress,
  style,
  loading,
  disabled,
  ...touchableProps
}: ButtonProps) {
  const { color } = useTheme();
  return (
    <Touchable
      style={[
        { backgroundColor: disabled ? color.card : color.primary },
        styles.container,
        style,
      ]}
      onPress={onPress}
      {...touchableProps}
    >
      <ThemedText>{text}</ThemedText>
      {loading ? <Loader style={styles.loader} size={"small"} /> : null}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.md,
    justifyContent: "center",
    flexDirection: "row",
  },
  loader: {
    position: "absolute",
    right: SPACING.xl,
    top: "50%",
    bottom: "50%",
    marginLeft: SPACING.sm,
  },
});
