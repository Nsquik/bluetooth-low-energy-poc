import { useTheme } from "@/hooks/useTheme";
import { LineChart } from "react-native-gifted-charts";
import { ThemedView } from "../ThemedView";
import { HeartMonitorChartProps } from "./HeartMonitorChart.types";

export function HeartMonitorChart({ heartRateList }: HeartMonitorChartProps) {
  const { color } = useTheme();

  return (
    <ThemedView style={{ height: 100, alignSelf: "stretch" }}>
      {heartRateList.length > 2 ? (
        <LineChart
          data={heartRateList}
          thickness={2}
          color={color.accent}
          hideRules
          yAxisColor="transparent"
          xAxisColor="transparent"
          textColor={color.text}
          dataPointsColor="transparent"
          yAxisTextStyle={{ width: 0 }}
          yAxisLabelContainerStyle={{ width: 0 }}
          yAxisLabelWidth={0}
          xAxisLabelTextStyle={{ color: "red" }}
          startFillColor={color.accent}
          endFillColor={color.background}
          startOpacity={0.16}
          endOpacity={0}
          noOfSections={1}
          stepValue={10}
          maxValue={255}
          showValuesAsDataPointsText
          onDataChangeAnimationDuration={400}
          scrollAnimation
          scrollToEnd
          animateOnDataChange
          height={100}
          disableScroll
        />
      ) : null}
    </ThemedView>
  );
}
