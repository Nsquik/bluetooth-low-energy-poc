import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator } from "react-native";
import { LoaderProps } from "./Loader.types";

export function Loader(props: LoaderProps) {
  const { color } = useTheme();
  return <ActivityIndicator color={color.accent} {...props} />;
}
