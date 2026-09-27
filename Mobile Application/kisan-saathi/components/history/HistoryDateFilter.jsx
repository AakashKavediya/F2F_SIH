import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useState } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, typography } from "../../src/theme";

const HistoryDateFilter = ({
  selectedDate,
  onDateChange,
  placeholder = "Select Date",
  minDate = "2020-01-01",
  maxDate = "2025-12-31",
}) => {
  const [visible, setVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Format date for display
  const formatDisplayDate = useCallback(
    (dateString) => {
      if (!dateString) return placeholder;

      const date = new Date(dateString + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.getTime() === today.getTime()) {
        return "Today";
      }
      if (date.getTime() === yesterday.getTime()) {
        return "Yesterday";
      }
      if (date.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
      }

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    },
    [placeholder],
  );

  const displayText = useMemo(() => {
    return formatDisplayDate(selectedDate);
  }, [selectedDate, formatDisplayDate]);

  const openModal = useCallback(() => setVisible(true), []);
  const closeModal = useCallback(() => setVisible(false), []);

  const handleDayPress = useCallback(
    (day) => {
      onDateChange(day.dateString);
      closeModal();
    },
    [onDateChange, closeModal],
  );

  // Modal width
  const modalWidth = isLarge ? 420 : Math.min(360, width - 40);

  return (
    <>
      {/* Selector */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={openModal}
      >
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#2C5F2D" />
          </View>
          <Text style={[styles.date, !selectedDate && styles.placeholder]}>
            {displayText}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#8E8E93" />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={[styles.modal, { width: modalWidth }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <Calendar
              onDayPress={handleDayPress}
              minDate={minDate}
              maxDate={maxDate}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary || "#2C5F2D",
                  selectedTextColor: "#FFFFFF",
                },
              }}
              theme={{
                backgroundColor: "#FFFFFF",
                calendarBackground: "#FFFFFF",
                textSectionTitleColor: "#8E8E93",
                selectedDayBackgroundColor: colors.primary || "#2C5F2D",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: colors.primary || "#2C5F2D",
                dayTextColor: "#1A1A1A",
                textDisabledColor: "#D1D5DB",
                dotColor: colors.primary || "#2C5F2D",
                selectedDotColor: "#FFFFFF",
                arrowColor: colors.primary || "#2C5F2D",
                monthTextColor: "#1A1A1A",
                textMonthFontFamily: typography.fontFamily.semiBold,
                textDayFontFamily: typography.fontFamily.medium,
                textDayHeaderFontFamily: typography.fontFamily.medium,
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                "stylesheet.calendar.header": {
                  week: {
                    marginTop: 12,
                    marginBottom: 8,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  },
                },
              }}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  onDateChange(null);
                  closeModal();
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => {
                  const today = new Date();
                  const dateString = today.toISOString().split("T")[0];
                  onDateChange(dateString);
                  closeModal();
                }}
              >
                <LinearGradient
                  colors={["#2C5F2D", "#4A7A4B"]}
                  style={styles.todayButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.todayButtonText}>Today</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default HistoryDateFilter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(44, 95, 45, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    marginLeft: 12,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.3,
  },
  placeholder: {
    color: "#B0B0B0",
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        backdropFilter: "blur(4px)",
      },
    }),
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  modalClose: {
    padding: 4,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.3,
  },
  todayButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  todayButtonGradient: {
    paddingVertical: 10,
    alignItems: "center",
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
