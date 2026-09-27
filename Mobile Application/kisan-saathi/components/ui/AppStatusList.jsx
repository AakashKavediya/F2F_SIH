import { StyleSheet, Text, View } from "react-native";

import { colors, radius, typography } from "../../src/theme";

const AppStatusList = ({ data = [] }) => {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

export default AppStatusList;

const styles = StyleSheet.create({
  container: {
    width: "100%",

    rowGap: 14,
  },

  card: {
    height: 56,

    backgroundColor: colors.white,

    borderRadius: radius.md,

    paddingHorizontal: 22,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 5,

    elevation: 3,
  },

  title: {
    fontSize: 18,

    color: colors.text,

    fontFamily: typography.fontFamily.semiBold,
  },

  value: {
    fontSize: 18,

    color: colors.text,

    fontFamily: typography.fontFamily.medium,
  },
});
