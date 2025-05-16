import { Loader } from "@/components/Loader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHeartRateMonitor } from "@/hooks/useHeartRateMonitor";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function HeartRateScreen() {
  const { isInitializing, startMonitoring, heartRateLatest } =
    useHeartRateMonitor();

  useEffect(() => {
    startMonitoring();
  }, [startMonitoring]);

  return (
    <ThemedView style={styles.container}>
      {isInitializing ? <Loader size={"large"} /> : null}
      <ThemedText type="title" style={{ textAlign: "center" }}>
        {heartRateLatest}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
});
