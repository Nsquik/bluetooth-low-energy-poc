import { Peripheral } from "@/types/Peripheral.types";
import { BleState } from "react-native-ble-manager";

export type UseBluetoothProps = {
  serviceUUIDs?: string[];
  allowDuplicates?: boolean;
  scanSeconds?: number;
};

export type UseBluetooth = {
  state: BleState;
  isScanning: boolean;
  availablePeripherals: Map<string, Peripheral>;
  connectedPeripheral?: Peripheral;
  scanPeripherals: () => Promise<void>;
  connectPeripheral: (peripheral: Peripheral) => Promise<void>;
};
