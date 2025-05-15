import { Peripheral as BLEManagerPeripheral } from "react-native-ble-manager";

export type Peripheral = BLEManagerPeripheral & {
  connected: boolean;
  connecting: boolean;
};
