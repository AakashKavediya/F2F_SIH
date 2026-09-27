import { useRef, useState } from "react";

import {
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors, typography } from "../../src/theme";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,

    image: require("../../../assets/images/mainScreenWallpaper1.png"),

    title: "Shape the Future of\nModern Farming",

    description:
      "Advanced tools and real-time insights help farmers manage crops and operations efficiently.",
  },

  {
    id: 2,

    image: require("../../../assets/images/mainScreenWallpaper1.png"),

    title: "AI Powered\nCrop Intelligence",

    description: "Detect diseases, weeds and monitor crop health in real time.",
  },

  {
    id: 3,

    image: require("../../../assets/images/mainScreenWallpaper1.png"),

    title: "One Platform\nFor Everything",

    description:
      "Monitor Agrobots, analytics, history and farm operations in one place.",
  },
];

const OnboardingSwiper = () => {
  const flatListRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
      });

      return;
    }

    router.replace("/(auth)/login");
  };

  const renderItem = ({ item }) => (
    <ImageBackground source={item.image} style={styles.page} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.description}>{item.description}</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.button}
          onPress={handleNext}
        >
          <View style={styles.leftCircle}>
            <Ionicons name="arrow-forward" size={22} color={colors.white} />
          </View>

          <Text style={styles.buttonText}>
            {currentIndex === 2 ? "Continue" : "Next"}
          </Text>

          <Ionicons name="chevron-forward" size={22} color="#222" />
        </TouchableOpacity>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={onboardingData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      pagingEnabled
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleScroll}
      bounces={false}
    />
  );
};

export default OnboardingSwiper;

const styles = StyleSheet.create({
  page: {
    width,

    height,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.22)",
  },

  content: {
    flex: 1,

    justifyContent: "flex-end",

    paddingHorizontal: 28,

    paddingBottom: 50,
  },

  title: {
    fontSize: 42,

    lineHeight: 48,

    color: colors.white,

    textAlign: "center",

    marginBottom: 18,

    fontFamily: typography.fontFamily.semiBold,
  },

  description: {
    fontSize: 16,

    lineHeight: 24,

    color: colors.white,

    textAlign: "center",

    marginBottom: 36,

    fontFamily: typography.fontFamily.medium,
  },

  button: {
    height: 60,

    backgroundColor: colors.white,

    borderRadius: 50,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 8,
  },

  leftCircle: {
    width: 44,

    height: 44,

    borderRadius: 22,

    backgroundColor: colors.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,

    color: colors.text,

    fontFamily: typography.fontFamily.semiBold,
  },

  pagination: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 28,
  },

  dot: {
    width: 8,

    height: 8,

    borderRadius: 10,

    backgroundColor: "rgba(255,255,255,0.5)",

    marginHorizontal: 4,
  },

  activeDot: {
    width: 28,

    backgroundColor: colors.white,
  },
});
