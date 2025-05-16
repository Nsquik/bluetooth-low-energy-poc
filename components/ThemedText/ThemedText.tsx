import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, Text } from "react-native";
import { ThemedTextProps } from "./ThemedText.types";

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  textTransform,
  ...rest
}: ThemedTextProps) {
  const {
    color: { text, accent },
  } = useTheme();

  return (
    <Text
      style={[
        { textTransform },
        { color: text },
        type === "default" ? styles.default : undefined,
        type === "small" ? styles.small : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? { ...styles.link, color: accent } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  small: {
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 24,
  },
  medium: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 24,
    fontSize: 16,
  },
});
