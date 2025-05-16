import { Peripheral } from "@/types/Peripheral.types";
import { StyleProp, ViewStyle } from "react-native";

export type PeripheralListProps = {
  hasFetched?: boolean;
  loading: boolean;
  data: Peripheral[];
  title: string;
  onPress?: (peripheral: Peripheral) => void;
  style?: StyleProp<ViewStyle>;
};
