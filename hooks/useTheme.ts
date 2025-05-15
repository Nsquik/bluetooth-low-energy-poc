import { THEME_DARK } from "@/constants/Theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme() ?? "light";

  return colorScheme === "light" ? THEME_DARK : THEME_DARK;
}
