import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet } from "react-native";

export default function DeviceScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Device</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
