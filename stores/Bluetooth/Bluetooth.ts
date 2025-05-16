import { Peripheral } from "@/types/Peripheral.types";
import { create } from "zustand";
import { BluetoothStore } from "./Bluetooth.types";
import { mapPeripheral } from "./Bluetooth.utils";

export const useBluetoothStore = create<BluetoothStore>((set) => ({
  availablePeripherals: new Map(),
  connectedPeripheral: undefined,

  addAvailablePeripheral: (peripheral) =>
    set((state) => {
      const mappedPeripheral = mapPeripheral(peripheral);
      return {
        availablePeripherals: new Map(state.availablePeripherals).set(
          peripheral.id,
          mappedPeripheral
        ),
      };
    }),
  removeAvailablePeripheral: (peripheral) =>
    set((state) => {
      const newMap = new Map(state.availablePeripherals);
      newMap.delete(peripheral.id);
      return { availablePeripherals: newMap };
    }),
  setAvailablePeripheralConnecting: (
    peripheral: Peripheral,
    connecting: boolean
  ) => {
    set((state) => {
      const newMap = new Map(state.availablePeripherals);
      const mappedPeripheral = mapPeripheral(peripheral, { connecting });

      if (peripheral) {
        newMap.set(peripheral.id, mappedPeripheral);
      }
      return { availablePeripherals: newMap };
    });
  },
  resetAvailablePeripherals: () => set({ availablePeripherals: new Map() }),
  resetConnectedPeripheral: () => set({ connectedPeripheral: undefined }),
  setConnectedPeripheral: (peripheral) => {
    const mappedPeripheral = mapPeripheral(peripheral, { connected: true });
    set({ connectedPeripheral: mappedPeripheral });
  },
}));
