import { useBluetoothStore } from "@/stores/Bluetooth";
import { Peripheral } from "@/types/Peripheral.types";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
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

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = false;

export function useBluetooth({
  scanSeconds = SECONDS_TO_SCAN_FOR,
  serviceUUIDs = SERVICE_UUIDS,
  allowDuplicates = ALLOW_DUPLICATES,
  onCharacteristicUpdate,
}: UseBluetoothProps = {}): UseBluetooth {
  const {
    connectedPeripheral,
    availablePeripherals,
    addAvailablePeripheral,
    removeAvailablePeripheral,
    setAvailablePeripheralConnecting,
    resetAvailablePeripherals,
    resetConnectedPeripheral,
    setConnectedPeripheral,
  } = useBluetoothStore();
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [state, setState] = useState<BleState>(BleState.Unknown);
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
      const state = await BleManager.checkState();
      setState(state);
      await requestPermissions();
    } catch (e) {
      console.log("Couldn't start bluetooth manager", e);
    }
  }, [requestPermissions]);

  const scanPeripherals = useCallback(async () => {
    resetAvailablePeripherals();

    await requestPermissions();
    const isReady = state === BleState.On && permissionStatus;

    if (isReady) {
      setIsScanning(true);
      const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
      resetConnectedPeripheral();

      if (connectedPeripherals.length) {
        setConnectedPeripheral(connectedPeripherals[0] as Peripheral);
      }
      await BleManager.scan(serviceUUIDs, scanSeconds, allowDuplicates, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      });
    }
  }, [
    resetAvailablePeripherals,
    requestPermissions,
    state,
    permissionStatus,
    resetConnectedPeripheral,
    serviceUUIDs,
    scanSeconds,
    allowDuplicates,
    setConnectedPeripheral,
  ]);

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      setAvailablePeripheralConnecting(peripheral, true);
      await BleManager.connect(peripheral.id);
      removeAvailablePeripheral(peripheral);
      setConnectedPeripheral(peripheral);
      await notificationAsync(NotificationFeedbackType.Success);
    } catch {
      setAvailablePeripheralConnecting(peripheral, false);
    }
  };

  const getCharacteristic = useCallback(
    async (
      peripheral: Peripheral,
      find: (characteristic: Characteristic) => boolean,
      serviceUUIDs: string[]
    ): Promise<Characteristic | undefined> => {
      if (peripheral.connected) {
        const services = await BleManager.retrieveServices(
          peripheral.id,
          serviceUUIDs
        );

        return services.characteristics?.find(find);
      }
    },
    []
  );

  const subscribeCharacteristic = useCallback(
    async (
      peripheralId: string,
      serviceUUID: string,
      charateristicUUID: string
    ) => {
      return await BleManager.startNotification(
        peripheralId,
        serviceUUID,
        charateristicUUID
      );
    },
    []
  );

  const unsubscribeCharacteristic = useCallback(
    async (
      peripheralId: string,
      serviceUUID: string,
      charateristicUUID: string
    ) => {
      return await BleManager.stopNotification(
        peripheralId,
        serviceUUID,
        charateristicUUID
      );
    },
    []
  );

  const enableBluetooth = async () => {
    if (Platform.OS === "android") {
      await BleManager.enableBluetooth();
    }
    if (Platform.OS === "ios") {
      if (state === BleState.Unauthorized) {
        return Linking.openSettings();
      }
      await Linking.openURL("App-Prefs:root=General");
    }
  };

  const handleBluetoothManagerStateChange = useCallback(
    (event: { state?: BleState } | undefined) => {
      if (event?.state) {
        resetAvailablePeripherals();
        resetConnectedPeripheral();
        setState(event.state);
      }
    },
    [resetAvailablePeripherals, resetConnectedPeripheral]
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
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    if (onCharacteristicUpdate) {
      listeners.push(
        BleManager.onDidUpdateValueForCharacteristic(onCharacteristicUpdate)
      );
    }

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
