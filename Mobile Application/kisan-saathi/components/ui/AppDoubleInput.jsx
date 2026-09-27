import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { typography } from "../../src/theme";

// ── Single half input ─────────────────────────────────────────────────────────
function HalfInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  returnKeyType = "done",
  onSubmitEditing,
  maxLength,
  inputRef,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#2C5F2D"],
  });

  return (
    <View style={styles.halfWrapper}>
      {/* Label — identical to AppDropdown */}
      <Text style={styles.label}>{label}</Text>

      {/* Input box — mirrors AppDropdown trigger exactly */}
      <Animated.View
        style={[
          styles.inputBox,
          {
            borderColor: animatedBorderColor,
            backgroundColor: !editable
              ? "#F5F5F5"
              : isFocused
              ? "#FFFFFF"
              : "#F8F9FA",
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, !editable && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor="#C7C7CC"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor="#2C5F2D"
          autoCapitalize="none"
          maxLength={maxLength}
          blurOnSubmit={returnKeyType === "done"}
        />
      </Animated.View>
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AppDoubleInput({
  leftLabel,
  leftPlaceholder,
  leftValue,
  onLeftChange,
  leftKeyboardType = "default",
  leftReturnKeyType = "next",
  leftMaxLength,

  rightLabel,
  rightPlaceholder,
  rightValue,
  onRightChange,
  rightKeyboardType = "default",
  rightReturnKeyType = "done",
  rightMaxLength,

  editable = true,
}) {
  const rightRef = useRef(null);

  return (
    <View style={styles.container}>
      <HalfInput
        label={leftLabel}
        placeholder={leftPlaceholder}
        value={leftValue}
        onChangeText={onLeftChange}
        keyboardType={leftKeyboardType}
        editable={editable}
        returnKeyType={leftReturnKeyType}
        onSubmitEditing={() => rightRef.current?.focus()}
        maxLength={leftMaxLength}
      />

      <HalfInput
        inputRef={rightRef}
        label={rightLabel}
        placeholder={rightPlaceholder}
        value={rightValue}
        onChangeText={onRightChange}
        keyboardType={rightKeyboardType}
        editable={editable}
        returnKeyType={rightReturnKeyType}
        maxLength={rightMaxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  halfWrapper: {
    flex: 1,
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

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    paddingHorizontal: 14,
  },

  inputDisabled: {
    color: "#8E8E93",
  },
});
