import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2C5F2D" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  );
}