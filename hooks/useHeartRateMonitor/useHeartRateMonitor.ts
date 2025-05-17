import { HEART_RATE_SERVICES } from "@/constants/Services";
import { useCallback, useEffect, useState } from "react";
import { Characteristic } from "react-native-ble-manager";
import {
  useBluetooth,
  UseBluetoothCharacteristicUpdateEvent,
} from "../useBluetooth";
import {
  UseHeartRateMonitor,
  UseHeartRatePoint,
} from "./useHeartRateMonitor.types";

const HEART_RATE_MEASURE_CHARACTERISTIC_UUID = "2a37";

export function useHeartRateMonitor(): UseHeartRateMonitor {
  const [isInitializing, setIsInitializing] = useState(false);
  const [heartRate, setHeartRate] = useState<UseHeartRatePoint[]>([]);
  const [heartRateLatest, setHeartRateLatest] = useState<number>();
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
      date: new Date(),
      value,
    };
    setHeartRate((prev) => {
      if (prev.length < 1000) {
        return [...prev, point];
      } else {
        return [...prev.slice(-15), point];
      }
    });

    setHeartRateLatest(value);
  };

  console.log(heartRate);

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
    heartRate: heartRate,
    heartRateLatest: heartRateLatest,
    startMonitoring,
  };
}
