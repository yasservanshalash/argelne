// file: app/(tabs)/_layout.tsx

import { COLORS } from '@/constants/theme';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // We just want icons
        tabBarActiveTintColor: COLORS.primary, // Color for the active tab
        tabBarInactiveTintColor: COLORS.gray2, // Color for inactive tabs
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.tertiary,
          height: 80, // A bit more space for a premium feel
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index" // Corresponds to app/(tabs)/index.tsx
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders" // Corresponds to app/(tabs)/orders.tsx
        options={{
          title: 'My Orders',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            // This is the correct icon for a receipt/order
            <FontAwesome5 name="receipt" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Corresponds to app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            // This is a great icon for a user profile
            <MaterialIcons name="person-outline" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;  