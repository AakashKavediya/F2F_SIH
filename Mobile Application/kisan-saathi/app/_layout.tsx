import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { typography } from "../src/theme";

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
    // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: {
            backgroundColor: "#F6F6F6",
          },
        }}
      >
        {/* Auth Screens - No Tab Bar */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />

        {/* Main App Screens - With Tab Bar */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* Modal Screens - Full Screen Overlay */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />

        {/* Catch-all route for 404 */}
        <Stack.Screen
          name="+not-found"
          options={{
            title: "Page Not Found",
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}