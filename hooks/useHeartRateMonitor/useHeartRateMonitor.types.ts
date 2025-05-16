export type UseHeartRateMonitor = {
  isInitializing: boolean;
  heartRate: number[];
  heartRateLatest: number | undefined;
  startMonitoring: () => void;
};
