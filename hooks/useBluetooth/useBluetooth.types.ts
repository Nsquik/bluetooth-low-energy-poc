import { Peripheral } from "@/types/Peripheral.types";
import { BleState } from "react-native-ble-manager";

export type UseBluetoothProps = {
  serviceUUIDs?: string[];
  allowDuplicates?: boolean;
  scanSeconds?: number;
};

export type UseBluetooth = {
  state: BleState;
  permissionStatus: boolean;
  isScanning: boolean;
  availablePeripherals: Map<string, Peripheral>;
  connectedPeripheral?: Peripheral;
  requestPermissions: () => Promise<void>;
  scanPeripherals: () => Promise<void>;
  connectPeripheral: (peripheral: Peripheral) => Promise<void>;
  enableBluetooth: () => Promise<void>;
};
