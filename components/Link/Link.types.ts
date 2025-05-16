import { StyleProp, ViewStyle } from "react-native";

export type LinkProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
