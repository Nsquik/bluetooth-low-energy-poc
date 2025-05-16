import { ThemedText } from "../ThemedText";
import { Touchable } from "../Touchable";
import { LinkProps } from "./Link.types";

export function Link({ text, onPress, style }: LinkProps) {
  return (
    <Touchable onPress={onPress} haptic="soft" style={style}>
      <ThemedText type="link">{text}</ThemedText>
    </Touchable>
  );
}
