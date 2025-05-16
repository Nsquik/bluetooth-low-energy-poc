export type UseHeartRateMonitor = {
  isInitializing: boolean;
  isConnected: boolean;
  heartRate: number[];
  heartRateLatest: number | undefined;
  startMonitoring: () => void;
};
