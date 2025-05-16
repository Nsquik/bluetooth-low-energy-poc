export type UseBluetoothPermissionsRequest = (
  props?: {
    showAlert: boolean;
  }
) => Promise<void>;

export type UseBluetoothPermissions = {
  status: boolean;
  requestPermissions: UseBluetoothPermissionsRequest;
};

export type UseBluetoothPermissionsProps = unknown;
