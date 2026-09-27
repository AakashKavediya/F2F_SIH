import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { typography } from "../../src/theme";

const AgrobotStatusCard = ({ data = [] }) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Helper to get status color
  const getStatusColor = (status) => {
    const statusMap = {
      Active: "#34C759",
      Online: "#34C759",
      Idle: "#FF9500",
      Offline: "#FF3B30",
      Maintenance: "#FF9500",
      Charging: "#007AFF",
    };
    return statusMap[status] || "#34C759";
  };

  // Helper to get battery color
  const getBatteryColor = (level) => {
    const num = parseInt(level);
    if (num >= 70) return "#34C759";
    if (num >= 40) return "#FF9500";
    return "#FF3B30";
  };

  // Helper to get status icon
  const getStatusIcon = (status) => {
    const iconMap = {
      Active: "checkmark-circle",
      Online: "checkmark-circle",
      Idle: "time",
      Offline: "close-circle",
      Maintenance: "construct",
      Charging: "battery-charging",
    };
    return iconMap[status] || "checkmark-circle";
  };

  // Format last updated time
  const getLastUpdated = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date
  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      {data.map((bot, index) => {
        const statusColor = getStatusColor(bot.status || "Active");
        const batteryColor = getBatteryColor(bot.battery || "90%");
        const statusIcon = getStatusIcon(bot.status || "Active");
        const isLast = index === data.length - 1;

        return (
          <View key={bot.id} style={[styles.card, isLast && styles.cardLast]}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <LinearGradient
                  colors={["#2C5F2D", "#4A7A4B"]}
                  style={styles.botIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name="hardware-chip-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                </LinearGradient>
                <View>
                  <Text style={styles.botTitle}>{bot.name}</Text>
                  <Text style={styles.botSubtitle}>
                    {bot.location || "Field A"} • {getFormattedDate()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.botStatusBadge,
                  { backgroundColor: statusColor + "15" },
                ]}
              >
                <Ionicons name={statusIcon} size={12} color={statusColor} />
                <Text style={[styles.botStatusText, { color: statusColor }]}>
                  {bot.status || "Active"}
                </Text>
              </View>
            </View>

            {/* Content Grid */}
            <View style={styles.content}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="battery-half-outline" size={14} color="#8E8E93" />
                  <Text style={styles.label}>Battery</Text>
                </View>
                <View style={styles.rowRight}>
                  <View
                    style={[
                      styles.batteryBar,
                      { backgroundColor: batteryColor + "20" },
                    ]}
                  >
                    <View
                      style={[
                        styles.batteryFill,
                        {
                          width: bot.battery || "90%",
                          backgroundColor: batteryColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.value, { color: batteryColor }]}>
                    {bot.battery || "90%"}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons
                    name="speedometer-outline"
                    size={14}
                    color="#8E8E93"
                  />
                  <Text style={styles.label}>Speed</Text>
                </View>
                <Text style={styles.value}>{bot.speed || "1.2 m/s"}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="play-outline" size={14} color="#8E8E93" />
                  <Text style={styles.label}>Current Task</Text>
                </View>
                <Text style={styles.value}>{bot.task || "Field Scanning"}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="wifi-outline" size={14} color="#8E8E93" />
                  <Text style={styles.label}>Connectivity</Text>
                </View>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        bot.connectivity === "Strong" ? "#34C759" : "#FF9500",
                    },
                  ]}
                >
                  {bot.connectivity || "Strong"}
                </Text>
              </View>

              <View style={[styles.row, styles.rowLast]}>
                <View style={styles.rowLeft}>
                  <Ionicons name="heart-outline" size={14} color="#8E8E93" />
                  <Text style={styles.label}>Sensor Health</Text>
                </View>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        bot.sensorHealth === "Excellent"
                          ? "#34C759"
                          : "#FF9500",
                    },
                  ]}
                >
                  {bot.sensorHealth || "Good"}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Ionicons name="time-outline" size={12} color="#C7C7CC" />
              <Text style={styles.footerText}>
                Last updated: {getLastUpdated()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    rowGap: 14,
  },
  containerLarge: {
    maxWidth: 500,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLast: {
    marginBottom: 0,
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  botIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  botTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  botSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.2,
    marginTop: 1,
  },
  botStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  botStatusText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },

  // Content
  content: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F8F9FA",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 13,
    color: "#666",
    fontFamily: typography.fontFamily.medium,
  },
  value: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.semiBold,
  },

  // Battery
  batteryBar: {
    height: 4,
    width: 60,
    borderRadius: 2,
    overflow: "hidden",
  },
  batteryFill: {
    height: "100%",
    borderRadius: 2,
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#C7C7CC",
    letterSpacing: 0.2,
  },
});

export default AgrobotStatusCard;
