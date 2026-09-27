import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";
import { typography } from "../../src/theme";

const FarmHealthCard = ({ score = 86, status = "Good", trendData = [] }) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Dynamic sizing
  const cardWidth = isLarge ? 400 : width - 32;
  const circleSize = isLarge ? 160 : 140;
  const radius = circleSize / 2 - 15;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - score / 100);

  // Calculate graph points
  const max = Math.max(...trendData);
  const min = Math.min(...trendData);
  const graphWidth = isLarge ? 220 : 180;
  const graphHeight = 50;

  const graphPoints = trendData
    .map((value, index) => {
      const x = (index / (trendData.length - 1)) * graphWidth;
      const y = graphHeight - ((value - min) / (max - min || 1)) * 35;
      return `${x},${y}`;
    })
    .join(" ");

  const getStatusColor = (status) => {
    const statusMap = {
      Good: "#34C759",
      Excellent: "#34C759",
      Average: "#FF9500",
      "Needs Attention": "#FF3B30",
      Poor: "#FF3B30",
    };
    return statusMap[status] || "#34C759";
  };

  const statusColor = getStatusColor(status);

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* Top Card */}
      <View style={styles.topCard}>
        <View style={styles.leftSection}>
          <Text style={styles.heading}>Farm Health Score</Text>
          <Text style={styles.subHeading}>Overall score of your farm</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.outOf}>/100</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        </View>

        {/* Circular Gauge */}
        <View style={styles.circleContainer}>
          <Svg width={circleSize} height={circleSize}>
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="#F0F0F0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={statusColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
              rotation="-90"
              origin={`${circleSize / 2},${circleSize / 2}`}
            />
          </Svg>

          <View style={styles.circleText}>
            <Text style={[styles.circleScore, { color: statusColor }]}>
              {score}
            </Text>
            <Text style={styles.circleDescription}>Health Score</Text>
          </View>
        </View>
      </View>

      {/* Bottom Card - Trend */}
      <View style={styles.bottomCard}>
        <View style={styles.trendLeft}>
          <Text style={styles.heading}>Score Trend</Text>
          <Text style={styles.trendSub}>Past 7 days</Text>
        </View>

        <View style={styles.graphContainer}>
          <Svg width={graphWidth} height={graphHeight}>
            <Polyline
              points={graphPoints}
              fill="none"
              stroke={statusColor}
              strokeWidth="3"
            />
            {/* Area under graph */}
            <Polyline
              points={`${graphPoints} ${graphWidth},${graphHeight} 0,${graphHeight}`}
              fill={statusColor + "15"}
              stroke="none"
            />
          </Svg>
        </View>

        <View style={styles.todayContainer}>
          <Text style={[styles.todayScore, { color: statusColor }]}>
            {score}
          </Text>
          <Text style={styles.todayText}>Today</Text>
        </View>
      </View>
    </View>
  );
};

export default FarmHealthCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minHeight: 190,
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
  },
  heading: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  subHeading: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
    fontFamily: typography.fontFamily.medium,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 14,
  },
  score: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -1,
  },
  outOf: {
    fontSize: 20,
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: typography.fontFamily.medium,
  },
  badge: {
    paddingHorizontal: 16,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  circleContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    position: "absolute",
    alignItems: "center",
  },
  circleScore: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  circleDescription: {
    textAlign: "center",
    fontSize: 10,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bottomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minHeight: 90,
  },
  trendLeft: {
    flex: 1,
  },
  trendSub: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
    fontFamily: typography.fontFamily.medium,
  },
  graphContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  todayContainer: {
    alignItems: "center",
    marginLeft: 8,
  },
  todayScore: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  todayText: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
});
