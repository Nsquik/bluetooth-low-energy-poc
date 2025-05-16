import { Icon } from "@/components/Icon";
import { Touchable } from "@/components/Touchable";
import { SPACING } from "@/constants/Token";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HapticTab({ ...props }) {
  return <Touchable {...props} haptic="medium" />;
}

export default function TabLayout() {
  const { left, right } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          paddingLeft: left + SPACING.sm,
          paddingRight: right + SPACING.sm,
        },
        headerShown: true,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Heart Rate",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="bolt.heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          headerShown: true,
          title: "Device",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="applewatch" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
