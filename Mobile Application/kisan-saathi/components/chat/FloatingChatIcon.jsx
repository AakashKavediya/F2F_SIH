import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ChatBot from "./ChatBot";

const FloatingChatIcon = ({ position = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
    // Animate scale on press
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          position === "left" ? styles.leftPosition : styles.rightPosition,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.iconButton}
        >
          <LinearGradient
            colors={["#2C5F2D", "#4A7A4B"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AI</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ChatBot visible={isOpen} onClose={handleClose} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    zIndex: 999,
    shadowColor: "#2C5F2D",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  leftPosition: {
    left: 20,
  },
  rightPosition: {
    right: 20,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    fontSize: 7,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default FloatingChatIcon;
