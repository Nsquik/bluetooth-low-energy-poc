import { Peripheral } from "@/types/Peripheral.types";
import { Characteristic } from "react-native-ble-manager";
import { UseBluetoothPermissions } from "../useBluetoothPermissions";

export type UseBluetoothCharacteristicUpdateEvent = {
  value: any[];
  peripheral: string;
  characteristic: string;
  service: string;
};

export type UseBluetoothProps = {
  serviceUUIDs?: string[];
  allowDuplicates?: boolean;
  scanSeconds?: number;
  onCharacteristicUpdate?: (ev: UseBluetoothCharacteristicUpdateEvent) => void;
};

export type UseBluetooth = {
  permissionStatus: UseBluetoothPermissions["status"];
  isAvailable: boolean;
  isScanning: boolean;
  hasScanned: boolean;
  availablePeripherals: Map<string, Peripheral>;
  connectedPeripheral?: Peripheral;
  getCharacteristic: (
    peripheral: Peripheral,
    findPredicate: (characteristic: Characteristic) => boolean,
    serviceUUIDs: string[]
  ) => Promise<Characteristic | undefined>;
  subscribeCharacteristic: (
    peripheralId: string,
    serviceUUID: string,
    charateristicUUID: string
  ) => Promise<void>;
  unsubscribeCharacteristic: (
    peripheralId: string,
    serviceUUID: string,
    charateristicUUID: string
  ) => Promise<void>;
  requestPermissions: UseBluetoothPermissions["requestPermissions"];
  scanPeripherals: () => Promise<void>;
  connectPeripheral: (peripheral: Peripheral) => Promise<void>;
  enableBluetooth: () => Promise<void>;
};
