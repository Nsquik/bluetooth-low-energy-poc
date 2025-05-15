import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;

type IconProps = {
  name: SymbolViewProps["name"];
  size?: number;
  color: string | OpaqueColorValue;
  weight?: SymbolWeight;
};

export type IconPropsIOS = IconProps & {
  style?: StyleProp<ViewStyle>;
};

export type IconPropsAndroid = IconProps & {
  style?: StyleProp<TextStyle>;
};
