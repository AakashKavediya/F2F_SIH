import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../../src/theme";

const AppAnalyticsCard = ({ data = [] }) => {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.card}>
          {/* Icon */}

          <View>{item.icon}</View>

          {/* Title */}

          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>

          {/* Bottom */}

          <View style={styles.bottomSection}>
            <Text numberOfLines={1} style={styles.value}>
              {item.value}
            </Text>

            <View
              style={[
                styles.badge,

                {
                  backgroundColor: item.badgeColor,
                },
              ]}
            >
              <Text numberOfLines={1} style={styles.badgeText}>
                {item.badge}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default AppAnalyticsCard;

const styles = StyleSheet.create({
  container: {
    width: 360,

    flexDirection: "row",

    justifyContent: "space-between",
  },

  card: {
    width: 175,

    height: 120,

    backgroundColor: colors.white,

    borderRadius: 15,

    padding: 14,

    justifyContent: "space-between",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 4,

    elevation: 3,
  },

  title: {
    fontSize: 12,

    lineHeight: 16,

    color: "#8A8A8A",

    fontFamily: typography.fontFamily.medium,
  },

  bottomSection: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  value: {
    fontSize: 18,

    color: colors.text,

    fontFamily: typography.fontFamily.semiBold,
  },

  badge: {
    height: 24,

    maxWidth: 90,

    paddingHorizontal: 8,

    borderRadius: 50,

    justifyContent: "center",

    alignItems: "center",
  },

  badgeText: {
    fontSize: 10,

    color: colors.white,

    fontFamily: typography.fontFamily.semiBold,
  },
});
