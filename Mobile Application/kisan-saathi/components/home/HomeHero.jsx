import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { typography } from "../../src/theme";
import TaskTimelineCard from "../cards/TaskTimelineCard";

// Base64 placeholder avatar — clean two-tone initial mark
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiMyQzVGMkQiLz48dGV4dCB4PSI0MCIgeT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RjwvdGV4dD48L3N2Zz4=";

const HomeHero = ({
  tasks = [],
  location = "Mumbai, Maharashtra",
  greeting = "Hey, Good Morning!",
  temperature = "32°C",
  windSpeed = "2.4 km/h",
  humidity = "72.5%",
  uvIndex = "5",
  weatherCondition = "Partially Cloudy",
  time = "7:30AM | 17 Jan",
  onAvatarPress = () => {},
  onLocationPress = () => {},
  onWeatherPress = () => {},
  onTemperaturePress = () => {},
}) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Dynamic sizing
  const heroHeight = isLarge ? 480 : 420;
  const tempSize = isLarge ? 64 : 54;
  const greetingSize = isLarge ? 20 : 18;

  return (
    <View style={styles.heroWrapper}>
      <ImageBackground
        source={require("../../assets/images/mainScreenWallpaper1.png")}
        style={[styles.hero, { height: heroHeight }]}
        imageStyle={styles.heroImage}
      >
        {/* Layered scrim */}
        <LinearGradient
          colors={[
            "rgba(10,26,16,0.45)",
            "rgba(10,26,16,0.08)",
            "rgba(10,26,16,0.15)",
            "rgba(10,26,16,0.65)",
          ]}
          locations={[0, 0.32, 0.6, 1]}
          style={styles.overlay}
        />

        {/* Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.locationPill}
            activeOpacity={0.7}
            onPress={onLocationPress}
          >
            <Ionicons name="location-outline" size={16} color="#2C5F2D" />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
            <View style={styles.locationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.7}
            onPress={onAvatarPress}
          >
            <Image source={{ uri: PLACEHOLDER_AVATAR }} style={styles.avatar} />
            <View style={styles.avatarBadge} />
          </TouchableOpacity>
        </View>

        {/* Greeting + Temperature */}
        <View style={styles.headlineBlock}>
          <Text style={[styles.greeting, { fontSize: greetingSize }]}>
            {greeting}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onTemperaturePress}
            style={styles.temperatureWrapper}
          >
            <Text style={[styles.temperature, { fontSize: tempSize }]}>
              {temperature}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weather Stats Row - Interactive */}
        <TouchableOpacity
          style={styles.statsRow}
          activeOpacity={0.7}
          onPress={onWeatherPress}
        >
          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="speedometer-outline" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText} numberOfLines={1}>
              {windSpeed}
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="water-outline" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText} numberOfLines={1}>
              {humidity}
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Ionicons name="sunny-outline" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText} numberOfLines={1}>
              UV: {uvIndex}
            </Text>
          </View>

          <View style={styles.refreshIcon}>
            <Ionicons
              name="refresh-outline"
              size={14}
              color="rgba(255,255,255,0.5)"
            />
          </View>
        </TouchableOpacity>

        {/* Weather Condition and Time */}
        <View style={styles.weatherInfoRow}>
          <View style={styles.weatherConditionContainer}>
            <Ionicons name="cloud-outline" size={16} color="#FFFFFF" />
            <Text style={styles.weatherCondition} numberOfLines={1}>
              {weatherCondition}
            </Text>
          </View>

          <View style={styles.weatherTimeContainer}>
            <Ionicons name="time-outline" size={14} color="#FFFFFF" />
            <Text style={styles.weatherTime} numberOfLines={1}>
              {time}
            </Text>
          </View>
        </View>

        {/* Task Timeline */}
        <View style={styles.taskContainer}>
          <TaskTimelineCard data={tasks} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    borderRadius: 28,
    shadowColor: "#0A1A10",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },

  hero: {
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 28,
    overflow: "hidden",
  },

  heroImage: {
    borderRadius: 28,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationPill: {
    flexShrink: 1,
    maxWidth: "78%",
    height: 38,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  locationText: {
    flexShrink: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.medium,
  },

  locationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2C5F2D",
    marginLeft: 8,
  },

  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.9)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarBadge: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  headlineBlock: {
    marginTop: 16,
  },

  greeting: {
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  temperatureWrapper: {
    alignSelf: "flex-start",
  },

  temperature: {
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.bold,
    marginTop: -4,
    letterSpacing: -1,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    rowGap: 8,
    alignItems: "center",
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },

  statIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  statText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    opacity: 0.95,
  },

  refreshIcon: {
    marginLeft: 8,
    padding: 4,
  },

  weatherInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weatherConditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  weatherCondition: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    opacity: 0.95,
    marginLeft: 6,
  },

  weatherTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },

  weatherTime: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    opacity: 0.95,
    marginLeft: 6,
  },

  taskContainer: {
    marginTop: 10,
  },
});

export default HomeHero;
