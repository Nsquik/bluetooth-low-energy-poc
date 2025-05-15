import { Peripheral } from "@/types/Peripheral.types";

export type PeripheralListProps = {
  data: Peripheral[];
  onPress: (peripheral: Peripheral) => void;
};
