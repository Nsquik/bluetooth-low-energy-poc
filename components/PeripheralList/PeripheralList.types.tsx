import { Peripheral } from "@/types/Peripheral.types";

export type PeripheralListProps = {
  data: Peripheral[];
  title: string;
  loading: boolean;
  onPress: (peripheral: Peripheral) => void;
};
