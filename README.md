
https://github.com/user-attachments/assets/bf551bfe-985f-4de6-a0f8-d2c72d41644d


# Universal BLE Heart Rate Monitor App
A mobile application that connects to any heart rate strap or sensor supporting Bluetooth Low Energy (BLE) and the standard Heart Rate profile. Tested with the GEOID HS500, but works with most straps available on the market.


# Features
1. Automatic discovery of BLE devices supporting the Heart Rate Service (0x180D)
2. Connection and subscription to notifications from the Heart Rate Measurement characteristic (0x2A37)
3. Real-time display of current heart rate (BPM)
4. Background operation support (Android: foreground service, iOS: background mode bluetooth-central)
5. Heart rate history logging (for chart display only)
6. Simple and intuitive user interface
7. Beautiful dynamic heart animation (appearance and speed depend on the current heart rate)
8. Permission handling



# Technologies Used
1. Bluetooth Low Energy (BLE)
2. BLE library: react-native-ble-manager
3. React Native with EXPO
4. React Native SKIA + Reanimated for heart animation
5. React Native Gifted Charts for heart rate chart

# To do
1. Improve heart animation
2. Support disconnecting
3. Support connecting to multiple devices







