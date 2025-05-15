import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SafeArea({ children }: { children: React.ReactNode }) {
  return <SafeAreaView style={styles.safeAreaView}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 100,
  },
});
