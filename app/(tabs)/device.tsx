import { Button } from "@/components/Button";
import { InfoAction } from "@/components/InfoAction";
import { PeripheralList } from "@/components/PeripheralList";
import { ThemedView } from "@/components/ThemedView";
import { HEART_RATE_SERVICES } from "@/constants/Services";
import { SPACING } from "@/constants/Token";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

const SERVICE_UUIDS: string[] = [HEART_RATE_SERVICES.Monitor];

export default function DeviceScreen() {
  const {
    isAvailable,
    isScanning,
    hasScanned,
    permissionStatus,
    connectedPeripheral,
    availablePeripherals,
    enableBluetooth,
    requestPermissions,
    connectPeripheral,
    scanPeripherals,
  } = useBluetooth({
    serviceUUIDs: SERVICE_UUIDS,
    allowDuplicates: false,
    scanSeconds: 3,
  });

  useEffect(() => {
    scanPeripherals();
  }, [scanPeripherals]);

  return (
    <ThemedView style={styles.container}>
      {connectedPeripheral ? (
        <PeripheralList
          hasFetched={hasScanned}
          title="Connected Sensors"
          loading={isScanning}
          data={[connectedPeripheral]}
          style={{ flexGrow: 0 }}
        />
      ) : null}

      <PeripheralList
        hasFetched={hasScanned}
        title="Available Sensors"
        loading={isScanning}
        data={Array.from(availablePeripherals.values())}
        onPress={connectPeripheral}
      />
      {!isAvailable ? (
        <ThemedView style={styles.infoActionContainer}>
          <InfoAction
            message="Bluetooth connection is required in order to pair sensor"
            action={{ text: "Connect", onPress: enableBluetooth }}
          />
        </ThemedView>
      ) : null}
      {permissionStatus === false ? (
        <ThemedView style={styles.infoActionContainer}>
          <InfoAction
            message="Bluetooth permissions are required in order to pair sensor"
            action={{
              text: "Accept",
              onPress: () => requestPermissions({ showAlert: true }),
            }}
          />
        </ThemedView>
      ) : null}
      {hasScanned ? (
        <Button
          style={styles.scanButton}
          text={"Scan"}
          onPress={scanPeripherals}
          loading={isScanning}
          disabled={isScanning || !isAvailable || !permissionStatus}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    alignContent: "space-between",
    justifyContent: "space-between",
  },
  availableSensorsContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  availableSensorsText: {
    marginRight: SPACING.md,
  },
  scanButton: {
    margin: SPACING.md,
    marginBottom: SPACING.xl,
  },
  infoActionContainer: {
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.md,
  },
});
