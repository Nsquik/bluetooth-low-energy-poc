export type UseHeartRatePoint = {
  date: Date;
  value: number;
};

export type UseHeartRateMonitor = {
  isInitializing: boolean;
  isConnected: boolean;
  heartRate: UseHeartRatePoint[];
  heartRateLatest: number | undefined;
  startMonitoring: () => void;
};
