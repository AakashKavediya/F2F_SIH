import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../src/theme";

const TaskTimelineCard = ({ data = [] }) => {
  const renderItem = ({ item, index }) => {
    const isActive = index === 0;

    return (
      <View style={[styles.card, isActive && styles.activeCard]}>
        {/* Time */}
        <View style={styles.timeRow}>
          <Ionicons
            name="time-outline"
            size={18}
            color={isActive ? "#FFF" : "#444"}
          />
          <Text style={[styles.time, isActive && styles.activeText]}>
            {item.time}
          </Text>
        </View>

        {/* Task */}
        <Text
          numberOfLines={2}
          style={[styles.task, isActive && styles.activeText]}
        >
          {item.task}
        </Text>

        {/* Status */}
        <View style={[styles.statusContainer, isActive && styles.activeStatus]}>
          <Text
            style={[styles.statusText, isActive && styles.activeStatusText]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 4,
  },
  card: {
    width: 150,
    height: 160,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCard: {
    backgroundColor: "#A6DD75",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    marginLeft: 6,
    fontSize: 16,
    color: colors.text,
    fontFamily: typography.fontFamily.semiBold,
  },
  task: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
    fontFamily: typography.fontFamily.semiBold,
  },
  activeText: {
    color: colors.white,
  },
  statusContainer: {
    height: 34,
    borderRadius: 50,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  activeStatus: {
    backgroundColor: "#0F5B3A",
  },
  statusText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: typography.fontFamily.medium,
  },
  activeStatusText: {
    color: colors.white,
  },
});

export default TaskTimelineCard;
