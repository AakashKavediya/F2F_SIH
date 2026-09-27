import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../../src/theme";

const CropScan = () => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="scan-outline" size={24} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Crop Scan</Text>
        <Text style={styles.description}>
          Scan results will appear here once the feature is connected.
        </Text>
      </View>
    </View>
  );
};

export default CropScan;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
