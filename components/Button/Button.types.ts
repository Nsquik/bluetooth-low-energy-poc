import { TouchableProps } from "../Touchable/Touchable.types";

export type ButtonProps = TouchableProps & {
  size?: "default" | "large";
  onPress: () => void;
};
