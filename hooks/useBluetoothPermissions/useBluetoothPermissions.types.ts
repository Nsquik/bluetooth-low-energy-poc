export type UseBluetoothPermissionsRequest = (props?: {
  showAlert: boolean;
}) => Promise<void>;

export type UseBluetoothPermissions = {
  status: boolean | null;
  requestPermissions: UseBluetoothPermissionsRequest;
};

export type UseBluetoothPermissionsProps = never;
