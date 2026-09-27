import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { colors, typography } from "../../src/theme";

const ExportReportCard = ({
  title = "Export Report",
  subtitle = "Download and share your farm data and report",
  viewAll = "View all",
  data = [],
  onViewAll,
}) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Animated scale for download buttons
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
        <Text style={styles.emptyText}>No reports available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onViewAll}
          style={styles.viewAllContainer}
        >
          <Text style={styles.viewAll}>{viewAll}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {data.map((item, index) => {
        const isLast = index === data.length - 1;
        const isFirst = index === 0;

        return (
          <View
            key={item.id}
            style={[
              styles.row,
              !isLast && styles.border,
              isFirst && styles.rowFirst,
              isLast && styles.rowLast,
            ]}
          >
            {/* Left Section */}
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={["#E8F5E9", "#C8E6C9"]}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#2C5F2D"
                  />
                </LinearGradient>
              </View>

              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.reportTitle}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={styles.description}>
                  {item.description}
                </Text>
              </View>
            </View>

            {/* Download Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={item.onDownload}
              style={styles.downloadButton}
            >
              <Animated.View
                style={[
                  styles.downloadButtonInner,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Ionicons name="download-outline" size={22} color="#2C5F2D" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default ExportReportCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignSelf: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 30,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 17,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAll: {
    fontSize: 14,
    color: "#2C5F2D",
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },

  // Row
  row: {
    minHeight: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowFirst: {
    paddingTop: 4,
  },
  rowLast: {
    paddingBottom: 4,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  // Left Section
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 14,
    flexShrink: 0,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    marginTop: 2,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
  },

  // Download Button
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  downloadButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
