import { TouchableProps } from "../Touchable/Touchable.types";

export type ButtonProps = TouchableProps & {
  text: string;
  size?: "default" | "large";
  onPress: () => void;
};
