import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, PermissionsAndroid } from "react-native";
import { PERMISSION_NAME } from "./useBluetoothPermissions.constants";
import {
  UseBluetoothPermissions,
  UseBluetoothPermissionsRequest,
} from "./useBluetoothPermissions.types";

export function useBluetoothPermissions(): UseBluetoothPermissions {
  const [status, setStatus] = useState<boolean | null>(null);

  const openApplicationSettings = () => {
    Linking.openSettings();
  };

  const checkPermissions = useCallback(async () => {
    const connectStatus = await PermissionsAndroid.check(
      PERMISSION_NAME.connect
    );
    const scanStatus = await PermissionsAndroid.check(PERMISSION_NAME.scan);

    setStatus(connectStatus && scanStatus);
  }, [setStatus]);

  const requestPermissions: UseBluetoothPermissionsRequest = useCallback(
    async ({ showAlert } = { showAlert: false }) => {
      const permissionsResponse = await PermissionsAndroid.requestMultiple([
        PERMISSION_NAME.connect,
        PERMISSION_NAME.scan,
      ]);

      const hasAcceptedStatus =
        permissionsResponse[PERMISSION_NAME.connect] === "granted" &&
        permissionsResponse[PERMISSION_NAME.scan] === "granted";

      const hasNeverAskAgainStatus =
        permissionsResponse[PERMISSION_NAME.connect] === "never_ask_again" &&
        permissionsResponse[PERMISSION_NAME.scan] === "never_ask_again";

      if (hasAcceptedStatus) {
        setStatus(hasAcceptedStatus);
      } else if (showAlert && hasNeverAskAgainStatus) {
        Alert.alert(
          "Action required",
          "Bluetooth permission is required to connect with your sensor. Allow bluetooth connection",
          [
            { text: "Ok", onPress: openApplicationSettings, isPreferred: true },
            { style: "cancel", text: "Cancel" },
          ]
        );
      }
    },
    []
  );

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return { status, requestPermissions };
}
