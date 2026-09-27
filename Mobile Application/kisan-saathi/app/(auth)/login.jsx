import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginPage() {
  // ---- State ----
  const [email, setEmail] = useState("aakashkavediya@gmail.com");
  const [password, setPassword] = useState("12341234");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Refs for inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // ---- Animations ----
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const heroScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(heroScale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ---- Handlers ----
  const handleLogin = () => {
    // Validate credentials
    if (email === "aakashkavediya@gmail.com" && password === "12341234") {
      Animated.sequence([
        Animated.spring(buttonScale, {
          toValue: 0.92,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace("/(tabs)/home");
      });
    } else {
      Alert.alert(
        "Invalid Credentials",
        "Please check your email and password and try again.",
        [{ text: "OK" }],
      );
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleNext = (ref) => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  };

  const clearInput = (setValue) => {
    setValue("");
  };

  // ---- Render ----
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#F5F7FA", "#FFFFFF"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Spacer */}
            <View style={styles.topSpacer} />

            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: heroScale }],
                },
              ]}
            >
              <View style={styles.heroContent}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={["#2C5F2D", "#4A7A4B"]}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="leaf" size={32} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.appName}>FarmerOS</Text>
                <Text style={styles.appSubtitle}>
                  Smart Farming · Better Yield
                </Text>
              </View>

              {/* Decorative Circles */}
              <View style={styles.decoCircle1} />
              <View style={styles.decoCircle2} />
              <View style={styles.decoCircle3} />
            </Animated.View>

            {/* Login Card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Sign In</Text>
                <Text style={styles.cardSubtitle}>
                  Welcome back to your farm
                </Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL</Text>
                <View
                  style={[
                    styles.inputWrap,
                    emailFocused && styles.inputWrapFocused,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={emailFocused ? "#2C5F2D" : "#8E8E93"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#C7C7CC"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    selectionColor="#2C5F2D"
                    returnKeyType="next"
                    onSubmitEditing={() => handleNext(passwordRef)}
                    blurOnSubmit={false}
                  />
                  {email.length > 0 && (
                    <TouchableOpacity onPress={() => clearInput(setEmail)}>
                      <Ionicons name="close-circle" size={18} color="#C7C7CC" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TouchableOpacity hitSlop={8}>
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.inputWrap,
                    passwordFocused && styles.inputWrapFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={passwordFocused ? "#2C5F2D" : "#8E8E93"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Enter your password"
                    placeholderTextColor="#C7C7CC"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    selectionColor="#2C5F2D"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={() => setShowPassword((v) => !v)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <LinearGradient
                    colors={["#2C5F2D", "#4A7A4B"]}
                    style={styles.loginGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.loginText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.socialButton}
                >
                  <View style={styles.socialIconWrap}>
                    <Ionicons name="logo-google" size={20} color="#EA4335" />
                  </View>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.socialButton}
                >
                  <View style={styles.socialIconWrap}>
                    <Ionicons name="call-outline" size={20} color="#2C5F2D" />
                  </View>
                  <Text style={styles.socialText}>Phone</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.socialButton, styles.socialButtonApple]}
                >
                  <View
                    style={[styles.socialIconWrap, styles.socialIconWrapApple]}
                  >
                    <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.socialText, styles.socialTextApple]}>
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.footerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // Spacers
  topSpacer: {
    flex: 0.05,
  },
  bottomSpacer: {
    flex: 0.05,
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    paddingBottom: 20,
    position: "relative",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#2C5F2D",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.3,
  },

  // Decorative Circles
  decoCircle1: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(44, 95, 45, 0.04)",
    zIndex: 1,
  },
  decoCircle2: {
    position: "absolute",
    bottom: -10,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(44, 95, 45, 0.03)",
    zIndex: 1,
  },
  decoCircle3: {
    position: "absolute",
    top: 40,
    right: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(44, 95, 45, 0.02)",
    zIndex: 1,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.03)",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.2,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWrapFocused: {
    borderColor: "#2C5F2D",
    backgroundColor: "#FFFFFF",
    shadowColor: "#2C5F2D",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    height: "100%",
    paddingVertical: 0,
  },
  inputFlex: {
    marginRight: 8,
  },

  // Login Button
  loginButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 22,
    shadowColor: "#2C5F2D",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginGradient: {
    flexDirection: "row",
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#D1D1D6",
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginHorizontal: 14,
    letterSpacing: 0.3,
  },

  // Social
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  socialButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialButtonApple: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  socialIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconWrapApple: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  socialText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
  socialTextApple: {
    color: "#FFFFFF",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
});
