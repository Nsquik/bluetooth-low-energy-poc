import { Permission } from "react-native";

export const PERMISSION_NAME: Record<string, Permission> = {
  scan: "android.permission.BLUETOOTH_SCAN",
  connect: "android.permission.BLUETOOTH_CONNECT",
};
