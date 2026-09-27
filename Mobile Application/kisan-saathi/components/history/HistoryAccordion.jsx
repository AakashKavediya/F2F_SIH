import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { colors, typography } from "../../src/theme";

const HistoryAccordion = ({ data = [] }) => {
  const [expandedId, setExpandedId] = useState(null);
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  const toggleAccordion = useCallback(
    (id) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId],
  );

  // Safe date formatter
  const formatDate = (dateString) => {
    try {
      if (!dateString) return { day: "--", month: "---" };

      const parts = dateString.split(" ");
      const day = parts[0] || "";
      const month = parts[1] || "";

      return {
        day: day.replace(/\D/g, "") || "--",
        month: month.substring(0, 3).toUpperCase() || "---",
      };
    } catch (error) {
      return { day: "--", month: "---" };
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      Excellent: colors.primary,
      Good: colors.primary,
      Average: "#FF9500",
      "Needs Attention": "#FF3B30",
      Poor: "#FF3B30",
      Great: colors.primary,
    };
    return statusMap[status] || colors.primary;
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
        <Text style={styles.emptyText}>No history available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
      {data.map((item, index) => {
        const isExpanded = expandedId === item.id;
        const isLast = index === data.length - 1;
        const statusColor = getStatusColor(item.status);
        const { day, month } = formatDate(item.date);

        return (
          <View key={item.id} style={styles.cardWrapper}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleAccordion(item.id)}
              style={[
                styles.row,
                isExpanded && styles.rowExpanded,
                isLast && styles.rowLast,
              ]}
            >
              {/* Date Badge */}
              <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>{day}</Text>
                <Text style={styles.dateMonth}>{month}</Text>
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={[styles.scoreText, { color: colors.primary }]}>
                      {item.score}
                    </Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor + "15" },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColor },
                      ]}
                    />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Chevron */}
              <View style={styles.chevronWrapper}>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#999"
                />
              </View>
            </TouchableOpacity>

            {/* Dropdown */}
            {isExpanded && (
              <Animated.View style={styles.dropdown}>
                <View style={styles.dropdownDivider} />
                <View style={styles.dropdownContent}>
                  {item.dropdownContent}
                </View>
              </Animated.View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default HistoryAccordion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
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

  cardWrapper: {
    backgroundColor: "#FFFFFF",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  rowExpanded: {
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 0,
  },
  rowLast: {
    borderBottomWidth: 0,
  },

  // Date Badge
  dateBadge: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    flexShrink: 0,
    marginRight: 14,
  },
  dateDay: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: -1,
  },

  // Content
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  dayText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    letterSpacing: 0.3,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(44, 95, 45, 0.08)",
  },
  scoreText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#999",
    letterSpacing: 0.2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
  },

  // Chevron
  chevronWrapper: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 4,
  },

  // Dropdown
  dropdown: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  dropdownContent: {
    paddingTop: 4,
  },
});
