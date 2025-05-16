import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { Link } from "../Link";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { InfoActionProps } from "./InfoAction.types";

export function InfoAction({ message, action }: InfoActionProps) {
  const { color } = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: color.card }]}>
      <ThemedView
        style={[styles.textContainer, { backgroundColor: color.card }]}
      >
        <ThemedText type="medium">{message}</ThemedText>
      </ThemedView>
      <ThemedView
        style={[styles.linkContainer, { backgroundColor: color.card }]}
      >
        <Link text={action.text} onPress={action.onPress} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
    borderRadius: SPACING.sm,
  },
  textContainer: {
    flex: 0.6,
  },
  linkContainer: {
    alignItems: "flex-end",
    flex: 0.4,
  },
});
