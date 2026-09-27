import { LinearGradient } from "expo-linear-gradient";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { typography } from "../../src/theme";

const MAX_HEIGHT = 140;

const WeeklyGraphCard = ({
  data = [],
  title = "Weekly Activity",
  subtitle = "Past 7 days",
  legendLabels = ["High", "Medium", "Low"],
}) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Calculate card width
  const cardWidth = isLarge ? 500 : width - 32;
  const barWidth = isLarge ? 40 : 28;
  const barGap = isLarge ? 16 : 8;

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((item) => item.low + item.medium + item.high),
    1, // Prevent division by zero
  );

  // Colors for the stacks
  const colorMap = {
    low: "#FFA800",
    medium: "#FFD400",
    high: "#D9D9D9",
  };

  // Legend labels with proper colors
  const legendItems = [
    { label: legendLabels[0] || "High", color: colorMap.high },
    { label: legendLabels[1] || "Medium", color: colorMap.medium },
    { label: legendLabels[2] || "Low", color: colorMap.low },
  ];

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width: cardWidth }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Weekly</Text>
        </View>
      </View>

      {/* Chart Area */}
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {/* Y-Axis Grid Lines */}
          <View style={styles.yAxisGrid}>
            {[0, 25, 50, 75, 100].map((percent) => (
              <View key={percent} style={styles.gridLine}>
                <Text style={styles.gridLabel}>{percent}%</Text>
                <View style={styles.gridLineDashed} />
              </View>
            ))}
          </View>

          {/* Bars */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barsScrollContainer}
          >
            <View style={[styles.barsContainer, { gap: barGap }]}>
              {data.map((item, index) => {
                const total = item.low + item.medium + item.high;
                const scale = MAX_HEIGHT / maxValue;
                const isActive = index === 0;

                return (
                  <View key={item.day || index} style={styles.barWrapper}>
                    {/* Bar with Gradient */}
                    <View
                      style={[
                        styles.barStack,
                        { height: total * scale, width: barWidth },
                      ]}
                    >
                      {/* Low */}
                      <LinearGradient
                        colors={[colorMap.low, colorMap.low + "CC"]}
                        style={[
                          styles.barSegment,
                          { height: item.low * scale },
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                      />
                      {/* Medium */}
                      <LinearGradient
                        colors={[colorMap.medium, colorMap.medium + "CC"]}
                        style={[
                          styles.barSegment,
                          { height: item.medium * scale },
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                      />
                      {/* High */}
                      <LinearGradient
                        colors={[colorMap.high, colorMap.high + "CC"]}
                        style={[
                          styles.barSegment,
                          { height: item.high * scale },
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                      />
                    </View>

                    {/* Value Label */}
                    <Text style={styles.valueLabel}>{total}</Text>

                    {/* Day Label */}
                    <Text style={[styles.day, isActive && styles.dayActive]}>
                      {item.day}
                    </Text>

                    {/* Active Indicator */}
                    {isActive && <View style={styles.activeIndicator} />}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {legendItems.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyGraphCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignSelf: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
    letterSpacing: 0.3,
  },

  // Chart
  chartContainer: {
    flex: 1,
  },
  chartArea: {
    flexDirection: "row",
    height: 200,
  },

  // Y-Axis Grid
  yAxisGrid: {
    width: 40,
    justifyContent: "space-between",
    paddingVertical: 4,
    marginRight: 8,
  },
  gridLine: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  gridLabel: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
    color: "#B0B0B0",
    width: 30,
    textAlign: "right",
  },
  gridLineDashed: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 4,
  },

  // Bars
  barsScrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 180,
    paddingBottom: 4,
  },
  barWrapper: {
    alignItems: "center",
    position: "relative",
  },
  barStack: {
    justifyContent: "flex-end",
    overflow: "hidden",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 4,
  },
  barSegment: {
    width: "100%",
    minHeight: 2,
  },
  valueLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: "#666",
    marginTop: 4,
  },
  day: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.3,
  },
  dayActive: {
    color: "#2C5F2D",
    fontFamily: typography.fontFamily.semiBold,
  },
  activeIndicator: {
    position: "absolute",
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2C5F2D",
  },

  // Legend
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
    letterSpacing: 0.3,
  },
});
