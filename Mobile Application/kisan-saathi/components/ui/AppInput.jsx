import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../../src/theme";

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  error = null,
  autoCapitalize = "none",
  returnKeyType = "done",
  multiline = false,
  numberOfLines = 1,
  maxLength,
  onFocus,
  onBlur,
  rightIcon,
  onRightIconPress,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onBlur) onBlur();
  };

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#2C5F2D"],
  });

  const isPassword = secureTextEntry;

  return (
    <View style={styles.wrapper}>
      {/* Static label above box — same as AppDropdown */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Input box — same dimensions as AppDropdown trigger */}
      <Animated.View
        style={[
          styles.inputBox,
          multiline && styles.inputBoxMultiline,
          error && styles.inputBoxError,
          {
            borderColor: error ? "#FF3B30" : animatedBorderColor,
            backgroundColor: !editable
              ? "#F5F5F5"
              : isFocused
              ? "#FFFFFF"
              : "#F8F9FA",
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            !editable && styles.inputDisabled,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#C7C7CC"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor="#2C5F2D"
          blurOnSubmit={!multiline}
        />

        {/* Password toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconWrap}
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={8}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}

        {/* Custom right icon */}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            style={styles.rightIconWrap}
            onPress={onRightIconPress}
            hitSlop={8}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Error message */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Character count */}
      {maxLength && value ? (
        <Text
          style={[
            styles.charCount,
            value.length > maxLength * 0.8 && styles.charCountWarn,
            value.length === maxLength && styles.charCountDanger,
          ]}
        >
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  // Matches AppDropdown label exactly
  label: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#8E8E93",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  // Matches AppDropdown trigger: height 50, borderRadius 12, borderWidth 1.5
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputBoxMultiline: {
    height: "auto",
    minHeight: 50,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  inputBoxError: {
    borderWidth: 1.5,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    paddingHorizontal: 14,
  },
  inputMultiline: {
    paddingHorizontal: 14,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
  inputDisabled: {
    color: "#8E8E93",
  },

  rightIconWrap: {
    paddingRight: 14,
    paddingLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#FF3B30",
  },

  charCount: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#C7C7CC",
    textAlign: "right",
    marginTop: 4,
    paddingHorizontal: 2,
  },
  charCountWarn: { color: "#FF9500" },
  charCountDanger: { color: "#FF3B30" },
});
