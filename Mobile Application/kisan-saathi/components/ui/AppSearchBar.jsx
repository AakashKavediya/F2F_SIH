
import { StyleSheet, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, typography } from "../../src/theme";

const AppSearchBar = ({ placeholder = "Search", value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={28} color={colors.text} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default AppSearchBar;

const styles = StyleSheet.create({
  container: {
    width: 360,

    height: 64,

    backgroundColor: colors.white,

    borderRadius: 15,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 20,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  input: {
    flex: 1,

    marginLeft: 16,

    fontSize: 16,

    fontFamily: typography.fontFamily.medium,

    color: colors.text,
  },
});
