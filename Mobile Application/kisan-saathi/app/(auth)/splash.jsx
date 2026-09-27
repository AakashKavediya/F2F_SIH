import { router } from "expo-router";

import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, typography } from "../../src/theme";

export default function SplashPage() {
  const handleNext = () => {
    router.push("/(auth)/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/starterpage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Dark Overlay */}

        <View style={styles.overlay} />

        {/* Bottom Content */}

        <View style={styles.content}>
          <Text style={styles.title}>
            Shape the Future of{"\n"}Modern Farming
          </Text>

          <Text style={styles.description}>
            Advanced tools and real-time insights help farmers manage crops,
            resources, and operations more efficiently than ever.
          </Text>

          {/* Get Started */}

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={handleNext}
          >
            <View style={styles.leftIcon}>
              <Ionicons name="arrow-forward" size={20} color={colors.white} />
            </View>

            <Text style={styles.buttonText}>Get Started</Text>

            <Ionicons name="chevron-forward" size={22} color="#2A2A2A" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,

    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.18)",
  },

  content: {
    paddingHorizontal: 28,

    paddingBottom: 45,
  },

  title: {
    fontSize: 40,

    lineHeight: 46,

    color: colors.white,

    textAlign: "center",

    marginBottom: 16,

    fontFamily: typography.fontFamily.semiBold,
  },

  description: {
    fontSize: 16,

    lineHeight: 24,

    color: "rgba(255,255,255,0.9)",

    textAlign: "center",

    marginBottom: 34,

    fontFamily: typography.fontFamily.medium,
  },

  button: {
    height: 58,

    backgroundColor: colors.white,

    borderRadius: 50,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 8,
  },

  leftIcon: {
    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: colors.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,

    color: colors.text,

    fontFamily: typography.fontFamily.semiBold,
  },
});
