import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { typography } from "../../src/theme";

// Props: { label, placeholder, value, onSelect, options }

export default function AppDropdown({
  label,
  placeholder = "Select an option",
  value,
  onSelect,
  options,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Trigger */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.trigger, open && styles.triggerOpen]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[styles.triggerText, !value && styles.placeholderText]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#8E8E93"
        />
      </TouchableOpacity>

      {/* Modal overlay */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        {/* Backdrop — tap to close */}
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>{label}</Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            bounces={false}
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <TouchableOpacity
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark" size={18} color="#2C5F2D" />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  triggerOpen: {
    borderColor: "#2C5F2D",
    backgroundColor: "#FFFFFF",
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    marginRight: 8,
  },
  placeholderText: {
    color: "#C7C7CC",
  },

  // Modal
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: "60%",
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D1D6",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  optionSelected: {
    // subtle highlight
  },
  optionText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
  },
  optionTextSelected: {
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#F0F0F0",
  },
});
