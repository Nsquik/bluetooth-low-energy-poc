import { THEME_DARK, THEME_LIGHT } from "@/constants/Theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme() ?? "light";

  return colorScheme === "dark" ? THEME_DARK : THEME_LIGHT;
}
