import { HeartRate } from "@/types/HeartRate.types";

export type UseHeartRateMonitor = {
  isInitializing: boolean;
  isConnected: boolean;
  heartRateList: HeartRate[];
  heartRateLatest: HeartRate | undefined;
  startMonitoring: () => void;
};
