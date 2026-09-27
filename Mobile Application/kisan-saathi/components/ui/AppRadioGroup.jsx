import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, radius, spacing, typography } from "../../src/theme";

const AppRadioGroup = ({ title, options = [], selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionRow}
          activeOpacity={0.8}
          onPress={() => onSelect(item)}
        >
          <View
            style={[styles.radio, selectedValue === item && styles.activeRadio]}
          />

          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AppRadioGroup;

const styles = StyleSheet.create({
  container: {
    width: 360,

    backgroundColor: "#FFFFFF",

    borderRadius: radius.md,

    padding: 24,
  },

  title: {
    fontSize: 16,

    fontFamily: typography.fontFamily.semiBold,

    color: colors.text,

    marginBottom: spacing.lg,
  },

  optionRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  radio: {
    width: 22,

    height: 22,

    borderRadius: 15,

    backgroundColor: "#D9D9D9",

    marginRight: 14,
  },

  activeRadio: {
    backgroundColor: "#6FAE45",
  },

  optionText: {
    fontSize: 16,

    fontFamily: typography.fontFamily.medium,

    color: colors.text,
  },
});
