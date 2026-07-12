import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCart } from '@/context/CartContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { cartCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'น้ำพริก',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="bag.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'ตะกร้า',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="cart.fill" color={color} />,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: themeColors.tint,
            color: '#fff',
            fontSize: 11,
            lineHeight: 14,
          },
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'สูตรเด็ด',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.closed.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
