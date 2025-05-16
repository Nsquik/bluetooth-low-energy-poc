import { Peripheral } from "@/types/Peripheral.types";

export const mapPeripheral = (
  peripheral: Peripheral,
  overrides: Partial<Peripheral> = {}
): Peripheral => {
  return {
    ...peripheral,
    connected: false,
    connecting: false,
    ...overrides,
  };
};
