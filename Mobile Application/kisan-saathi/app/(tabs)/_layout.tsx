import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { colors, typography } from "../../src/theme";
import FloatingChatIcon from "../../components/chat/FloatingChatIcon";

// Define the type for tab configuration
type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;  // Use keyof typeof for proper typing
  headerTitle: string;
};

// Tab configuration with proper typing
const TAB_SCREENS: TabConfig[] = [
  {
    name: "home",
    title: "Home",
    icon: "home",
    headerTitle: "Farm Dashboard",
  },
  {
    name: "analysis",
    title: "Analysis",
    icon: "analytics",
    headerTitle: "Farm Analysis",
  },
  {
    name: "agrobot",
    title: "AgroBot",
    icon: "hardware-chip",
    headerTitle: "AgroBot Control",
  },
  {
    name: "map",
    title: "Map",
    icon: "map",
    headerTitle: "Farm Map",
  },
  {
    name: "history",
    title: "History",
    icon: "time",
    headerTitle: "Activity History",
  },
  {
    name: "index",
    title: "Profile",
    icon: "person",
    headerTitle: "User Profile",
  },
];

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#FFFFFF",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0,
            height: Platform.OS === "ios" ? 50 : 56,
          },
          headerTitleStyle: {
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 17,
            color: "#1A1A1A",
            letterSpacing: 0.3,
          },
          headerShadowVisible: false,
          headerLeftContainerStyle: styles.headerLeft,
          headerRightContainerStyle: styles.headerRight,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: "#8E8E93",
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarBackground: () => {
            if (Platform.OS === "ios") {
              return (
                <BlurView
                  intensity={80}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
              );
            }
            return null;
          },
        }}
      >
        {TAB_SCREENS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name as any} // Type assertion to avoid router type issues
            options={{
              title: tab.title,
              headerTitle: tab.headerTitle,
              tabBarIcon: ({ color, size, focused }) => (
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.iconWrapperActive,
                  ]}
                >
                  <Ionicons
                    name={focused ? tab.icon : `${tab.icon}-outline` as any}
                    size={size}
                    color={color}
                  />
                </View>
              ),
            }}
          />
        ))}
      </Tabs>
      <FloatingChatIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  headerLeft: {
    paddingLeft: 16,
  },
  headerRight: {
    paddingRight: 16,
  },
  tabBar: {
    height: Platform.OS === "ios" ? 85 : 70,
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    shadowColor: "transparent",
    elevation: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabBarItem: {
    borderRadius: 16,
    paddingVertical: 4,
  },
  iconWrapper: {
    padding: 4,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: "rgba(44, 95, 45, 0.08)",
  },
});