import { Button } from "@/components/Button";
import { PeripheralList } from "@/components/PeripheralList";
import { ThemedView } from "@/components/ThemedView";
import { SPACING } from "@/constants/Token";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

const SERVICE_UUIDS: string[] = ["180D"];

export default function DeviceScreen() {
  const {
    isScanning,
    connectedPeripheral,
    availablePeripherals,
    connectPeripheral,
    scanPeripherals,
  } = useBluetooth({ serviceUUIDs: SERVICE_UUIDS });

  useEffect(() => {
    scanPeripherals();
  }, [scanPeripherals]);

  // const retrieveServices = async () => {
  //   const peripheralInfos: PeripheralInfo[] = [];
  //   for (const [peripheralId, peripheral] of connectedPeripherals) {
  //     if (peripheral.connected) {
  //       const newPeripheralInfo = await BleManager.retrieveServices(
  //         peripheralId
  //       );

  //       peripheralInfos.push(newPeripheralInfo);
  //     }
  //   }

  //   return peripheralInfos;
  // };

  // const readCharacteristics = async () => {
  //   const services = await retrieveServices();

  //   for (const peripheralInfo of services) {
  //     peripheralInfo.characteristics?.forEach(async (c) => {
  //       if (c.properties.Notify && c.characteristic === "2a37") {
  //         console.log(peripheralInfo.id, c.characteristic, c.service);
  //         BleManager.startNotification(
  //           peripheralInfo.id,
  //           c.service,
  //           c.characteristic
  //         ).then(() => {
  //           console.log("started notifying");
  //         });
  //       }
  //     });
  //   }
  // };

  return (
    <ThemedView style={styles.container}>
      {connectedPeripheral ? (
        <PeripheralList
          title="Connected Sensors"
          loading={isScanning}
          data={[connectedPeripheral]}
          style={{ flexGrow: 0 }}
        />
      ) : null}

      <PeripheralList
        title="Available Sensors"
        loading={isScanning}
        data={Array.from(availablePeripherals.values())}
        onPress={connectPeripheral}
      />
      <Button
        style={styles.scanButton}
        text={"Scan"}
        onPress={scanPeripherals}
        loading={isScanning}
        disabled={isScanning}
      />
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
    marginVertical: SPACING.xl,
  },
});
