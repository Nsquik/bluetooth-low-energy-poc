import { HEART_RATE_SERVICES } from "@/constants/Services";
import { HeartRate } from "@/types/HeartRate.types";
import { useCallback, useEffect, useState } from "react";
import { Characteristic } from "react-native-ble-manager";
import {
  useBluetooth,
  UseBluetoothCharacteristicUpdateEvent,
} from "../useBluetooth";
import { UseHeartRateMonitor } from "./useHeartRateMonitor.types";

const HEART_RATE_MEASURE_CHARACTERISTIC_UUID = "2a37";

export function useHeartRateMonitor(): UseHeartRateMonitor {
  const [isInitializing, setIsInitializing] = useState(false);
  const [heartRateList, HeartRateList] = useState<HeartRate[]>([]);
  const [heartRateLatest, setHeartRateLatest] = useState<HeartRate>();
  const [subscribedCharacteristic, setSubscribedCharacteristics] = useState<
    Characteristic | undefined
  >();

  const {
    isAvailable,
    permissionStatus,
    connectedPeripheral,
    getCharacteristic,
    subscribeCharacteristic,
    unsubscribeCharacteristic,
  } = useBluetooth({
    scanSeconds: 3,
    serviceUUIDs: [HEART_RATE_SERVICES.Monitor],
    allowDuplicates: false,
    onCharacteristicUpdate,
  });

  const isConnected = Boolean(
    isAvailable && permissionStatus && connectedPeripheral?.connected
  );

  const parseHeartRateValue = ([
    _,
    value,
  ]: UseBluetoothCharacteristicUpdateEvent["value"]) => {
    const point = {
      value,
    };
    HeartRateList((prev) => {
      if (prev.length < 1000) {
        return [...prev, point];
      } else {
        return [...prev.slice(-15), point];
      }
    });

    setHeartRateLatest({ value });
  };

  function onCharacteristicUpdate(ev: UseBluetoothCharacteristicUpdateEvent) {
    parseHeartRateValue(ev.value);
  }

  const startMonitoring = useCallback(async () => {
    if (connectedPeripheral) {
      setIsInitializing(true);

      const characteristic = await getCharacteristic(
        connectedPeripheral,
        (c) =>
          c.service === HEART_RATE_SERVICES.Monitor &&
          Boolean(c.properties.Notify) &&
          c.characteristic === HEART_RATE_MEASURE_CHARACTERISTIC_UUID,
        [HEART_RATE_SERVICES.Monitor]
      );

      if (characteristic) {
        await subscribeCharacteristic(
          connectedPeripheral.id,
          characteristic.service,
          characteristic.characteristic
        );
        setIsInitializing(false);
        setSubscribedCharacteristics(characteristic);
      }
    }
  }, [connectedPeripheral, getCharacteristic, subscribeCharacteristic]);

  useEffect(() => {
    return () => {
      if (connectedPeripheral?.id && subscribedCharacteristic?.characteristic) {
        unsubscribeCharacteristic(
          connectedPeripheral.id,
          HEART_RATE_SERVICES.Monitor,
          subscribedCharacteristic.characteristic
        );
      }
    };
  }, [
    connectedPeripheral?.id,
    subscribedCharacteristic?.characteristic,
    unsubscribeCharacteristic,
  ]);

  return {
    isInitializing,
    isConnected,
    heartRateList,
    heartRateLatest,
    startMonitoring,
  };
}
