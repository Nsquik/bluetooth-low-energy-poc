import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { COLOR } from "./Color";

export const THEME_LIGHT = {
  color: {
    ...COLOR.light,
  },
};

export const THEME_DARK = {
  color: {
    ...COLOR.dark,
  },
};

export const NAVIGATION_LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export const NAVIGATION_DARK_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: THEME_DARK.color.accent,
    background: THEME_DARK.color.background,
    text: THEME_DARK.color.text,
    card: THEME_DARK.color.card,
    border: THEME_DARK.color.accent,
  },
};
