import { Peripheral } from "@/types/Peripheral.types";
import { UseBluetoothPermissions } from "../useBluetoothPermissions";

export type UseBluetoothProps = {
  serviceUUIDs?: string[];
  allowDuplicates?: boolean;
  scanSeconds?: number;
};

export type UseBluetooth = {
  permissionStatus: UseBluetoothPermissions["status"];
  isAvailable: boolean;
  isScanning: boolean;
  hasScanned: boolean;
  availablePeripherals: Map<string, Peripheral>;
  connectedPeripheral?: Peripheral;
  requestPermissions: UseBluetoothPermissions["requestPermissions"];
  scanPeripherals: () => Promise<void>;
  connectPeripheral: (peripheral: Peripheral) => Promise<void>;
  enableBluetooth: () => Promise<void>;
};
