import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { Peripheral } from "@/types/Peripheral.types";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Touchable } from "../Touchable";
import { PeripheralListProps } from "./PeripheralList.types";

export function PeripheralList({ data }: PeripheralListProps) {
  const { color } = useTheme();

  const renderItem = ({ item }: { item: Peripheral }) => {
    const name = item?.advertising?.localName || item.name;
    return (
      <Touchable
        onPress={() => null}
        style={[styles.row, { backgroundColor: color.card }]}
        haptic="medium"
      >
        <ThemedText type="medium">{name}</ThemedText>
      </Touchable>
    );
  };

  return (
    <FlatList
      style={{
        flex: 1,
      }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
});
