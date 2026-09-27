import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { typography } from "../../src/theme";

const AgrobotSummaryCard = ({
  image,
  title = "Latest Field Scan",
  timestamp = "22 June 2024 || 5.00pm",
  status = "Scan Completed",
  onlineStatus = "Online",
}) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const imageSource = typeof image === "string" ? { uri: image } : image;

  return (
    <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
      {/* Left Image */}
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            resizeMode="contain"
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="hardware-chip-outline" size={32} color="#2C5F2D" />
          </View>
        )}
      </View>

      {/* Right Content */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <Text numberOfLines={1} style={styles.timestamp}>
          {timestamp}
        </Text>

        <View style={styles.badges}>
          <View style={[styles.statusBadge, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="checkmark-circle" size={14} color="#2C5F2D" />
            <Text style={styles.badgeText}>{status}</Text>
          </View>

          <View style={[styles.onlineBadge, { backgroundColor: "#E8F5E9" }]}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>{onlineStatus}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AgrobotSummaryCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignSelf: "center",
    minHeight: 110,
  },

  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#F5F8F5",
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 14,
  },

  title: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 2,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  timestamp: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 10,
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34C759",
    marginRight: 6,
  },

  badgeText: {
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
    marginLeft: 4,
  },
});
