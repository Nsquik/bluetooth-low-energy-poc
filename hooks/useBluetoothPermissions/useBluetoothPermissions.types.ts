export type UseBluetoothPermissions = {
  status: boolean;
  requestPermissions: () => Promise<void>;
};

export type UseBluetoothPermissionsProps = { alertOnDenied: boolean };
