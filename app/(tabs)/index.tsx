import { Button } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SPACING } from "@/constants/Token";
import { useHeartRateMonitor } from "@/hooks/useHeartRateMonitor";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function HeartRateScreen() {
  const { navigate } = useRouter();
  const { color } = useTheme();
  const { isInitializing, isConnected, startMonitoring, heartRateLatest } =
    useHeartRateMonitor();

  useEffect(() => {
    startMonitoring();
  }, [startMonitoring]);

  if (!isConnected) {
    return (
      <ThemedView style={styles.disconnectedContainer}>
        <ThemedText type="title" style={[styles.title, styles.text]}>
          Heart rate sensor not connected
        </ThemedText>

        <Icon name="applewatch.slash" color={color.text} size={200} />

        <ThemedView style={styles.infoContainer}>
          <ThemedText type="medium" style={styles.text}>
            To start monitoring your heart rate, please connect your device in
            the settings.
          </ThemedText>
          <Button
            onPress={() => {
              navigate("/device");
            }}
            text="Connect device"
            style={styles.devicesButton}
          />
        </ThemedView>
      </ThemedView>
    );
  }

  const loader = isInitializing ? <Loader size="small" /> : null;

  const heart = heartRateLatest ? <Heart bpm={heartRateLatest} /> : null;

  return (
    <ThemedView style={styles.container}>
      {loader}
      <ThemedText>{heartRateLatest}</ThemedText>
      {heart}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  disconnectedContainer: {
    padding: SPACING.md,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hrText: {
    margin: SPACING.xl,
  },
  text: {
    textAlign: "center",
  },
  title: {
    marginTop: SPACING.lg,
  },
  infoContainer: {
    gap: SPACING.md,
  },
  devicesButton: {
    alignSelf: "stretch",
    marginVertical: SPACING.lg,
  },
});
