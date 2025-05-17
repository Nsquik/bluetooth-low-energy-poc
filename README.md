
https://github.com/user-attachments/assets/bf551bfe-985f-4de6-a0f8-d2c72d41644d


# Universal BLE Heart Rate Monitor App
Aplikacja mobilna umożliwiająca połączenie z dowolnym paskiem lub czujnikiem tętna obsługującym Bluetooth Low Energy (BLE) oraz standardowy profil Heart Rate. Testowana m.in. z GEOID HS500, ale działa z większością pasków dostępnych na rynku.


# Funkcjonalności
1. Automatyczne wykrywanie urządzeń BLE obsługujących Heart Rate Service *(0x180D)*
2. Połączenie i subskrypcja powiadomień z charakterystyki Heart Rate Measurement *(0x2A37)*
3. Wyświetlanie aktualnego tętna w czasie rzeczywistym (BPM)
4. Obsługa pracy w tle (Android: foreground service, iOS: background mode bluetooth-central)
5. Zapis historii pomiarów (Tylko do wyświetlania wykresu)
6. Prosty, przejrzysty interfejs użytkownika
7. Piękna dynamiczna animacja serca. (wygląd, prędkość itd. zależna od aktualnego pulsu)
8. Obsługa uprawnień

# Wykorzystane technologie
1. Bluetooth Low Energy (BLE)
4. Biblioteka BLE: react-native-ble-manager
6. React Native z EXPO
7. React Native SKIA + Reanimated do animacji serca
8. React Native Gifted Charts do wykresu pulsu





