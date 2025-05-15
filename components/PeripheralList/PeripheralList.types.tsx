import { Peripheral } from "@/types/Peripheral.types";
import { StyleProp, ViewStyle } from "react-native";

export type PeripheralListProps = {
  data: Peripheral[];
  title: string;
  loading: boolean;
  onPress?: (peripheral: Peripheral) => void;
  style?: StyleProp<ViewStyle>;
};
