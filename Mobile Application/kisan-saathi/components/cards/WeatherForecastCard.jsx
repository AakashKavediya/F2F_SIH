import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { colors, typography } from "../../src/theme";

const WeatherForecastCard = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Static fallback data - Mumbai weather
  const staticWeatherData = [
    { day: "Today", temperature: 32, weatherCode: 0 },
    { day: "Mon", temperature: 28, weatherCode: 2 },
    { day: "Tue", temperature: 35, weatherCode: 1 },
    { day: "Wed", temperature: 36, weatherCode: 3 },
    { day: "Thu", temperature: 30, weatherCode: 45 },
    { day: "Fri", temperature: 27, weatherCode: 0 },
    { day: "Sat", temperature: 29, weatherCode: 2 },
  ];

  useEffect(() => {
    // Immediately set static data so something shows
    setWeather(staticWeatherData);
    setLoading(false);

    // Try to fetch real data in background
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&daily=weather_code,temperature_2m_max&forecast_days=7&timezone=Asia%2FKolkata",
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.daily && data.daily.time) {
        const days = data.daily.time.map((date, index) => ({
          day:
            index === 0
              ? "Today"
              : new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                }),
          temperature: Math.round(data.daily.temperature_2m_max[index]),
          weatherCode: data.daily.weather_code[index],
        }));

        setWeather(days);
        setLoading(false);
      }
    } catch (error) {
      console.log("Weather fetch error:", error);
      // Static data is already set, so just keep it
    }
  };

  const getWeatherEmoji = (code) => {
    if (code <= 3) return "☀️";
    if (code <= 10) return "⛅";
    if (code <= 20) return "🌤️";
    if (code <= 30) return "🌥️";
    if (code <= 55) return "🌧️";
    if (code <= 67) return "⛈️";
    if (code <= 80) return "🌦️";
    return "🌨️";
  };

  const getWeatherDescription = (code) => {
    if (code <= 3) return "Clear";
    if (code <= 10) return "Partly Cloudy";
    if (code <= 20) return "Cloudy";
    if (code <= 30) return "Overcast";
    if (code <= 55) return "Rainy";
    if (code <= 67) return "Stormy";
    if (code <= 80) return "Showers";
    return "Snow";
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Loading weather...</Text>
      </View>
    );
  }

  if (!weather || weather.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load weather</Text>
      </View>
    );
  }

  const cardWidth = isLarge ? 110 : 90;
  const cardHeight = isLarge ? 160 : 140;
  const temperatureSize = isLarge ? 20 : 18;
  const iconSize = isLarge ? 42 : 38;
  const daySize = isLarge ? 17 : 16;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
      >
        {weather.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                width: cardWidth,
                height: cardHeight,
              },
              index === 0 && styles.activeCard,
            ]}
          >
            {/* Temperature */}
            <Text
              style={[
                styles.temperature,
                { fontSize: temperatureSize },
                index === 0 && styles.activeText,
              ]}
            >
              {item.temperature}°C
            </Text>

            {/* Weather Icon */}
            <Text style={[styles.icon, { fontSize: iconSize }]}>
              {getWeatherEmoji(item.weatherCode)}
            </Text>

            {/* Weather Condition (only for active card) */}
            {index === 0 && (
              <Text style={styles.conditionText}>
                {getWeatherDescription(item.weatherCode)}
              </Text>
            )}

            {/* Day */}
            <Text
              style={[
                styles.day,
                { fontSize: daySize },
                index === 0 && styles.activeText,
              ]}
            >
              {item.day}
            </Text>

            {/* Active Indicator */}
            {index === 0 && <View style={styles.activeIndicator} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  scrollContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginVertical: 10,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: typography.fontFamily.medium,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontFamily: typography.fontFamily.medium,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 8,
    position: "relative",
  },
  activeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  temperature: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  activeText: {
    color: "#FFFFFF",
  },
  icon: {
    marginVertical: 4,
  },
  conditionText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
    textTransform: "capitalize",
  },
  day: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    marginTop: 2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -4,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
});

export default WeatherForecastCard;
