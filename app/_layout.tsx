// file: app/_layout.tsx

import { COLORS } from '@/constants/theme';
import { store } from '@/store/store';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    async function hideSplash() {
      await SplashScreen.hideAsync();
    }
    hideSplash();
  }, []);

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen
          name="product/[id]"
          options={{
            headerStyle: { backgroundColor: COLORS.lightWhite },
            headerShadowVisible: false,
            headerTitle: "",
            headerBackTitleVisible: false,
            headerTintColor: COLORS.secondary,
          }}
        />

        {/* --- ADDED THIS NEW SCREEN FOR THE CART --- */}
        <Stack.Screen
          name="cart" // This corresponds to the new app/cart.tsx file
          options={{
            presentation: 'modal', // Makes it slide up from the bottom
            headerStyle: { backgroundColor: COLORS.lightWhite },
            headerShadowVisible: false,
            headerTitle: "My Cart",
            headerBackTitleVisible: false,
            headerTintColor: COLORS.secondary,
          }}
        />
      </Stack>
    </Provider>
  );
}