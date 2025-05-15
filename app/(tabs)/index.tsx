import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from "react-native-ble-manager";

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = ["0x180D"];
const ALLOW_DUPLICATES = false;

export default function HeartRateScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral["id"], Peripheral>()
  );
  console.log("peripherals", peripherals);

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

  const renderItem = ({
    item,
  }: {
    item: Peripheral & { connected?: boolean; connecting?: boolean };
  }) => {
    const backgroundColor = item?.connected ? "#069400" : Colors.dark.icon;
    return (
      <TouchableHighlight underlayColor="#0082FC" onPress={() => null}>
        <ThemedView style={[styles.row, { backgroundColor }]}>
          <ThemedText>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && " - Connecting..."}
          </ThemedText>
          <ThemedText>RSSI: {item.rssi}</ThemedText>
          <ThemedText>{item.id}</ThemedText>
        </ThemedView>
      </TouchableHighlight>
    );
  };

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <Pressable onPress={startScan}>
          <ThemedText>
            {isScanning ? "Scanning..." : "Scan Bluetooth"}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <FlatList
        data={Array.from(peripherals.values())}
        contentContainerStyle={{ rowGap: 12 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}

const boxShadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  row: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  rssi: {
    fontSize: 12,
    textAlign: "center",
    padding: 2,
  },
  peripheralName: {
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: "center",
    padding: 2,
    paddingBottom: 20,
  },
});
