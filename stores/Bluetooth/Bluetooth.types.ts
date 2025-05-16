import { Peripheral } from "@/types/Peripheral.types";

export type BluetoothStore = {
  availablePeripherals: Map<string, Peripheral>;
  connectedPeripheral?: Peripheral;

  addAvailablePeripheral: (peripheral: Peripheral) => void;
  removeAvailablePeripheral: (peripheral: Peripheral) => void;
  resetAvailablePeripherals: () => void;
  setAvailablePeripheralConnecting: (
    peripheral: Peripheral,
    connecting: boolean
  ) => void;
  setConnectedPeripheral: (peripheral: Peripheral) => void;
  resetConnectedPeripheral: () => void;
};
