import { TextProps, TextStyle } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  textTransform?: TextStyle["textTransform"];
  type?:
    | "default"
    | "small"
    | "medium"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link";
};
