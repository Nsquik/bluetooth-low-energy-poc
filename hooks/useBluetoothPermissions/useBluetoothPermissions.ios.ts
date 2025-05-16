import { useCallback } from "react";
import {
  UseBluetoothPermissions,
  UseBluetoothPermissionsProps,
} from "./useBluetoothPermissions.types";

export function useBluetoothPermissions(
  _props: UseBluetoothPermissionsProps
): UseBluetoothPermissions {
  const status = true;
  const requestPermissions = useCallback(() => Promise.resolve(), []);
  return { status: status, requestPermissions: requestPermissions };
}
