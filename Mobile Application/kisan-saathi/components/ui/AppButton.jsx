
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, typography } from "../../src/theme";

const AppButton = ({ title = "Submit", onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    width: 360,

    height: 56,

    backgroundColor: colors.primary,

    borderRadius: 15,

    justifyContent: "center",

    alignItems: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 18,

    fontFamily: typography.fontFamily.semiBold,

    color: colors.white,
  },
});
