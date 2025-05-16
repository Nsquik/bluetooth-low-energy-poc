import { Peripheral } from "@/types/Peripheral.types";
import { useCallback, useEffect, useState } from "react";
import { EventSubscription } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  BleState,
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
}: UseBluetoothProps = {}): UseBluetooth {
  const [isScanning, setIsScanning] = useState(false);
  const [state, setState] = useState<BleState>(BleState.Unknown);
  const [availablePeripherals, setAvailablePeripherals] = useState<
    Map<string, Peripheral>
  >(new Map());
  const [connectedPeripheral, setConnectedPeripheral] = useState<Peripheral>();
  const { requestPermissions, status: permissionStatus } =
    useBluetoothPermissions({
      alertOnDenied: true,
    });

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
    await requestPermissions();
    const isReady = state === BleState.On && permissionStatus;
    if (isReady) {
      console.log("scan");
      resetAvailablePeripheral();
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
    permissionStatus,
    state,
    serviceUUIDs,
    scanSeconds,
    allowDuplicates,
    addConnectedPeripheral,
  ]);

  const connectPeripheral = async (peripheral: Peripheral) => {
    setAvailablePeripheralConnecting(peripheral, true);
    await BleManager.connect(peripheral.id, { autoconnect: true });
    removeAvailablePeripheral(peripheral);
    addConnectedPeripheral(peripheral);
  };

  const handleBluetoothManagerStateChange = (
    event: { state?: BleState } | undefined
  ) => {
    if (event?.state) {
      setState(event.state);
    }
  };

  const handleDiscoverPeripheral = useCallback(
    (peripheral: Peripheral) => {
      addAvailablePeripheral(peripheral);
    },
    [addAvailablePeripheral]
  );

  const handleStopScan = () => {
    setIsScanning(false);
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

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, [handleDiscoverPeripheral]);

  return {
    state,
    isScanning,
    availablePeripherals,
    connectedPeripheral,
    scanPeripherals,
    connectPeripheral,
  };
}
