import { Icon } from "@/components/Icon";
import TabBarBackground from "@/components/TabBarBackground";
import { Touchable } from "@/components/Touchable";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

function HapticTab({ ...props }) {
  return <Touchable {...props} haptic="heavy" />;
}

export default function TabLayout() {
  const tintColor = useThemeColor({}, "tint");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
