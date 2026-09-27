
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../src/theme";

const AppAlertBar = ({
  title,
  time = "2h ago",
  backgroundColor = "#DDF3D4",
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default AppAlertBar;

const styles = StyleSheet.create({
  container: {
    width: 360,

    minHeight: 74,

    borderRadius: 15,

    paddingVertical: 14,

    paddingHorizontal: 16,

    justifyContent: "center",

    marginBottom: spacing.md,
  },

  title: {
    fontSize: 16,

    fontFamily: typography.fontFamily.semiBold,

    color: colors.text,

    marginBottom: 8,
  },

  time: {
    fontSize: 14,

    fontFamily: typography.fontFamily.medium,

    color: colors.textSecondary,
  },
});
