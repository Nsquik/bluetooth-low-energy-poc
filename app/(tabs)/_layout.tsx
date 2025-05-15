import { Icon } from "@/components/Icon";
import { Touchable } from "@/components/Touchable";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HapticTab({ ...props }) {
  return <Touchable {...props} haptic="heavy" />;
}

export default function TabLayout() {
  const tintColor = useThemeColor({}, "tint");
  const { left, right } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          paddingLeft: left + 10,
          paddingRight: right + 10,
        },
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Heart Rate",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          headerShown: true,
          title: "Device",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
