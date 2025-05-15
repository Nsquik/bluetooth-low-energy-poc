import { Button } from "@/components/Button";
import { PeripheralList } from "@/components/PeripheralList/PeripheralList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SPACING } from "@/constants/Token";
import { Peripheral } from "@/types/Peripheral.types";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from "react-native-ble-manager";

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = ["0x180D"];
const ALLOW_DUPLICATES = false;

export default function DeviceScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral["id"], Peripheral>()
  );

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral["id"], Peripheral>());

      try {
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        }).catch((err: any) => {
          console.error("[startScan] ble scan returned in error", err);
        });
      } catch (error) {
        console.error("[startScan] ble scan error thrown", error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (!peripheral.name) {
      peripheral.name = "NO NAME";
    }
    setPeripherals((map) => {
      return new Map(map.set(peripheral.id, peripheral));
    });
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: true })
        .then(() => console.debug("BleManager started."))
        .catch((error: any) =>
          console.error("BeManager could not be started.", error)
        );
    } catch (error) {
      console.error("unexpected error starting BleManager.", error);
      return;
    }

    const listeners: any[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    return () => {
      console.debug("[app] main component unmounting. Removing listeners...");
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const availableSensorsLoading = isScanning ? (
    <ActivityIndicator size="small" />
  ) : null;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.availableSensorsContainer}>
        <ThemedText
          type="small"
          textTransform="uppercase"
          style={styles.availableSensorsText}
        >
          Available Sensors
        </ThemedText>
        {availableSensorsLoading}
      </ThemedView>
      <PeripheralList
        data={Array.from(peripherals.values())}
        onPress={() => null}
      />
      <Button
        style={styles.scanButton}
        text={isScanning ? "Scanning..." : "Refresh"}
        onPress={startScan}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginVertical: SPACING.xl,
  },
});
