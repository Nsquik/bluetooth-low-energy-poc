import { Button } from "@/components/Button";
import { PeripheralList } from "@/components/PeripheralList/PeripheralList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SPACING } from "@/constants/Token";
import { Peripheral } from "@/types/Peripheral.types";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  PeripheralInfo,
} from "react-native-ble-manager";

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = ["0x180D"];
const ALLOW_DUPLICATES = false;

export default function DeviceScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral["id"], Peripheral>()
  );
  const [values, setValues] = useState<{value: number, timestamp: Date}[]>();

  const [connectedPeripherals, setConnectedPeripherals] = useState(
    new Map<Peripheral["id"], Peripheral>()
  );

  const startScan = async () => {
    if (!isScanning) {
      setPeripherals(new Map<Peripheral["id"], Peripheral>());
      setConnectedPeripherals(new Map<Peripheral["id"], Peripheral>());

      try {
        setIsScanning(true);
        const connectedPeripherals = await BleManager.getConnectedPeripherals();
        if (connectedPeripherals.length > 0) {
          setConnectedPeripherals((map) => {
            return new Map(
              map.set(connectedPeripherals[0].id, {
                ...connectedPeripherals[0],
                connecting: false,
                connected: true,
              })
            );
          });
        }
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        });
      } catch (error) {
        console.error("[startScan] ble scan error thrown", error);
      }
    }
  };

  const handleStopScan = () => {
    setIsInitialized(true);
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
  const handleUpdateChar = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: true })
        .then(() => {
          startScan();
        })
        .catch((error: any) =>
          console.error("BeManager could not be started.", error)
        );
    } catch (error) {
      console.error("unexpected error starting BleManager.", error);
      return;
    }

    const listeners: any[] = [
      
      BleManager.onDidUpdateValueForCharacteristic((e: any) =>{
        console.log("value", e);
      setValues((values) => ([...values ?? [], {value: e.value[1], timestamp: new Date()}]))
      }
      ),
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

  const retrieveServices = async () => {
    const peripheralInfos: PeripheralInfo[] = [];
    for (const [peripheralId, peripheral] of connectedPeripherals) {
      if (peripheral.connected) {
        const newPeripheralInfo = await BleManager.retrieveServices(
          peripheralId
        );

        peripheralInfos.push(newPeripheralInfo);
      }
    }

    return peripheralInfos;
  };

  const readCharacteristics = async () => {
    const services = await retrieveServices();

    for (const peripheralInfo of services) {
      peripheralInfo.characteristics?.forEach(async (c) => {
        if (c.properties.Notify && c.characteristic === "2a37") {
          console.log(peripheralInfo.id, c.characteristic, c.service);
          BleManager.startNotification(
            peripheralInfo.id,
            c.service,
            c.characteristic
          ).then(() => {
            console.log("started notifying");
          });
        }
      });
    }
  };

  const handlePressPeripheral = async (peripheral: Peripheral) => {
    if (peripheral.connected) {
      await BleManager.disconnect(peripheral.id);
      peripheral.connected = false;
      setPeripherals((map) => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    }
    try {
      await BleManager.connect(peripheral.id);
      peripheral.connected = true;
      setPeripherals((map) => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    } catch (error) {
      console.error("Error connecting to peripheral", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <PeripheralList
        title="Connected Sensors"
        loading={isScanning}
        data={Array.from(connectedPeripherals.values())}
        onPress={handlePressPeripheral}
      />

      <PeripheralList
        title="Available Sensors"
        loading={isScanning}
        data={Array.from(peripherals.values())}
        onPress={handlePressPeripheral}
      />
      {isInitialized ? (
        <Button
          style={styles.scanButton}
          text={"Refresh"}
          onPress={startScan}
          loading={isScanning}
        />
      ) : null}

      <FlatList data={values} renderItem={({item}) => {
        return <ThemedText>{item.value} - {item.timestamp.getMinutes()} : {item.timestamp.getSeconds()} : {item.timestamp.getMilliseconds()}}</ThemedText>
      }}/>

      <Button
        style={styles.scanButton}
        text={"Read char"}
        onPress={readCharacteristics}
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
