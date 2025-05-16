import { SPACING } from "@/constants/Token";
import { useTheme } from "@/hooks/useTheme";
import { Peripheral } from "@/types/Peripheral.types";
import { FlatList, StyleSheet } from "react-native";
import { Loader } from "../Loader";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Touchable } from "../Touchable";
import { PeripheralListProps } from "./PeripheralList.types";

export function PeripheralList({
  hasFetched,
  loading,
  data,
  title,
  onPress,
  style,
}: PeripheralListProps) {
  const isEmpty = hasFetched && !data.length && !loading;
  const { color } = useTheme();

  const isEmptyText = isEmpty ? "(Not found)" : null;
  const connectingIndicator = (
    <ThemedView
      style={[{ backgroundColor: color.card }, styles.connectingContainer]}
    >
      <ThemedText
        type="small"
        style={[{ color: color.accent }, styles.connectingText]}
        textTransform="uppercase"
      >
        Connecting
      </ThemedText>
      <Loader color={color.accent} />
    </ThemedView>
  );

  const connectedIndicator = (
    <ThemedText
      type="small"
      style={{ color: color.accent }}
      textTransform="uppercase"
    >
      Connected
    </ThemedText>
  );

  const renderItem = ({ item }: { item: Peripheral }) => {
    const name = item?.advertising?.localName || item.name;

    const handlePressItem = () => {
      onPress?.(item);
    };

    return (
      <Touchable
        onPress={() => handlePressItem()}
        style={[styles.row, { backgroundColor: color.card }]}
        haptic="medium"
      >
        <ThemedText type="medium">{name}</ThemedText>
        {item.connected ? connectedIndicator : null}
        {item.connecting ? connectingIndicator : null}
      </Touchable>
    );
  };

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="small"
          textTransform="uppercase"
          style={styles.titleText}
        >
          {title} {isEmptyText}
        </ThemedText>
        {loading ? <Loader /> : null}
      </ThemedView>
      <FlatList
        style={[style]}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  connectingText: {
    marginRight: SPACING.sm,
  },
  connectingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  titleText: {
    marginRight: SPACING.md,
  },
});
