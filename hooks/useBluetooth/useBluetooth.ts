import { Peripheral } from "@/types/Peripheral.types";
import { useCallback, useEffect, useState } from "react";
import { EventSubscription, Linking, Platform } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  BleState,
  Characteristic,
} from "react-native-ble-manager";
import { useBluetoothPermissions } from "../useBluetoothPermissions";
import { UseBluetooth, UseBluetoothProps } from "./useBluetooth.types";
import { mapPeripheral } from "./useBluetooth.utils";

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = false;

export function useBluetooth({
  scanSeconds = SECONDS_TO_SCAN_FOR,
  serviceUUIDs = SERVICE_UUIDS,
  allowDuplicates = ALLOW_DUPLICATES,
  onCharacteristicUpdate,
}: UseBluetoothProps = {}): UseBluetooth {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [state, setState] = useState<BleState>(BleState.Unknown);
  const [availablePeripherals, setAvailablePeripherals] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedPeripheral, setConnectedPeripheral] = useState<Peripheral>();
  const { requestPermissions, status: permissionStatus } =
    useBluetoothPermissions();
  const disabledStateList = [
    BleState.Off,
    BleState.Unauthorized,
    BleState.Unsupported,
    BleState.TurningOff,
  ];
  const isAvailable = !disabledStateList.includes(state);

  const initBluetoothManager = useCallback(async () => {
    try {
      await BleManager.start({ showAlert: true });
      await BleManager.checkState();
      await requestPermissions();
    } catch (e) {
      console.log("Couldn't start bluetooth manager", e);
    }
  }, [requestPermissions]);

  const addConnectedPeripheral = useCallback((peripheral: Peripheral) => {
    const connectedPeripheral = mapPeripheral(peripheral, { connected: true });

    setConnectedPeripheral(connectedPeripheral);
  }, []);

  const resetConnectedPeripheral = useCallback(() => {
    setConnectedPeripheral(undefined);
  }, []);

  const addAvailablePeripheral = useCallback((peripheral: Peripheral) => {
    const name = peripheral.name ?? "NO NAME";

    const mappedPeripheral = mapPeripheral(peripheral, { name });

    setAvailablePeripherals((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(peripheral.id, mappedPeripheral);
      return newMap;
    });
  }, []);

  const removeAvailablePeripheral = (peripheral: Peripheral) => {
    setAvailablePeripherals((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(peripheral.id);
      return newMap;
    });
  };

  const resetAvailablePeripheral = () => {
    const newMap = new Map();
    setAvailablePeripherals(newMap);
  };

  const setAvailablePeripheralConnecting = (
    peripheral: Peripheral,
    connecting: boolean
  ) => {
    const connectingPeripheral = mapPeripheral(peripheral, { connecting });

    setAvailablePeripherals((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(peripheral.id, connectingPeripheral);
      return newMap;
    });
  };

  const scanPeripherals = useCallback(async () => {
    resetAvailablePeripheral();

    await requestPermissions();
    const isReady = state === BleState.On && permissionStatus;
    if (isReady) {
      setIsScanning(true);
      const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
      setConnectedPeripheral(undefined);

      if (connectedPeripherals.length) {
        addConnectedPeripheral(connectedPeripherals[0] as Peripheral);
      }
      await BleManager.scan(serviceUUIDs, scanSeconds, allowDuplicates, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      });
    }
  }, [
    requestPermissions,
    state,
    permissionStatus,
    serviceUUIDs,
    scanSeconds,
    allowDuplicates,
    addConnectedPeripheral,
  ]);

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      setAvailablePeripheralConnecting(peripheral, true);
      await BleManager.connect(peripheral.id);
      removeAvailablePeripheral(peripheral);
      addConnectedPeripheral(peripheral);
    } catch {
      setAvailablePeripheralConnecting(peripheral, false);
    }
  };

  const getCharacteristic = async (
    peripheral: Peripheral,
    find: (characteristic: Characteristic) => boolean
  ): Promise<Characteristic | undefined> => {
    if (peripheral.connected) {
      const services = await BleManager.retrieveServices(
        peripheral.id,
        serviceUUIDs
      );

      return services.characteristics?.find(find);
    }
  };

  const subscribeCharacteristic = async (
    peripheralId: string,
    serviceUUID: string,
    charateristicUUID: string
  ) => {
    return await BleManager.startNotification(
      peripheralId,
      serviceUUID,
      charateristicUUID
    );
  };

  const unsubscribeCharacteristic = async (
    peripheralId: string,
    serviceUUID: string,
    charateristicUUID: string
  ) => {
    return await BleManager.stopNotification(
      peripheralId,
      serviceUUID,
      charateristicUUID
    );
  };

  const enableBluetooth = async () => {
    if (Platform.OS === "android") {
      await BleManager.enableBluetooth();
    }
    if (Platform.OS === "ios") {
      await Linking.openURL("App-Prefs:root=Bluetooth");
    }
  };

  const handleBluetoothManagerStateChange = useCallback(
    (event: { state?: BleState } | undefined) => {
      if (event?.state) {
        resetAvailablePeripheral();
        resetConnectedPeripheral();
        setState(event.state);
      }
    },
    [resetConnectedPeripheral]
  );

  const handleDiscoverPeripheral = useCallback(
    (peripheral: Peripheral) => {
      addAvailablePeripheral(peripheral);
    },
    [addAvailablePeripheral]
  );

  const handleStopScan = () => {
    setIsScanning(false);
    setHasScanned(true);
  };

  useEffect(() => {
    initBluetoothManager();
  }, [initBluetoothManager]);

  useEffect(() => {
    const listeners: EventSubscription[] = [
      BleManager.onDidUpdateState(handleBluetoothManagerStateChange),
      BleManager.onDidUpdateValueForCharacteristic(onCharacteristicUpdate),
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, [
    handleBluetoothManagerStateChange,
    handleDiscoverPeripheral,
    onCharacteristicUpdate,
  ]);

  return {
    isAvailable,
    isScanning,
    hasScanned,
    permissionStatus,
    availablePeripherals,
    connectedPeripheral,
    getCharacteristic,
    subscribeCharacteristic,
    unsubscribeCharacteristic,
    enableBluetooth,
    requestPermissions,
    scanPeripherals,
    connectPeripheral,
  };
}
