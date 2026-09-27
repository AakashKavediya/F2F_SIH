import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

// Import Home Components
import HomeHero from "../../components/home/HomeHero";

// Import Card Components
import FarmHealthCard from "../../components/cards/FarmHealthCard";
import SchemeCarousel from "../../components/cards/SchemeCarousel";
import WeatherForecastCard from "../../components/cards/WeatherForecastCard";

// Import UI Components
import AppListCard from "../../components/ui/AppListCard";

// Import Analysis Components
import SensorGrid from "../../components/analysis/SensorGrid";

// Import Map Components
import AgrobotLocationCard from "../../components/maps/AgrobotLocationCard";

// Theme
import { typography } from "../../src/theme";

export default function HomePage() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Task Data
  const tasks = [
    {
      id: 1,
      time: "7:30 AM",
      task: "Washing of the field DC5",
      status: "in progress",
      active: true,
    },
    {
      id: 2,
      time: "8:30 AM",
      task: "Planting of the plant in field",
      status: "next task",
    },
    {
      id: 3,
      time: "9:30 AM",
      task: "Washing of field BC2",
      status: "next task",
    },
    {
      id: 4,
      time: "10:30 AM",
      task: "Fertilizer application",
      status: "next task",
    },
  ];

  // Scheme Data
  const schemes = [
    {
      id: 1,
      image:
        "https://sarkariyojana.com/wp-content/uploads/2024/04/pm-kisan-samman-nidhi-yojana.webp",
      title: "PM-KISAN Samman Nidhi",
      description:
        "₹6,000 annual financial support provided directly to eligible farming families in three installments.",
    },
    {
      id: 2,
      image:
        "https://amoghavarshaiaskas.in/wp-content/uploads/2025/01/Pradhan-Mantri-Fasal-Bima-Yojana-PMFBY.webp",
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description:
        "Crop insurance scheme that protects farmers against crop loss due to natural disasters, pests, and diseases.",
    },
    {
      id: 3,
      image:
        "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/wp/current-affairs/2025/06/Soil-Health-Card-Scheme.webp?v=2",
      title: "Soil Health Card Scheme",
      description:
        "Get soil nutrient analysis and personalized fertilizer recommendations to improve productivity.",
    },
  ];

  // PM Kisan Scheme Data
  const pmKisanScheme = {
    id: 1,
    title: "PM Kisan Samman Nidhi",
    description: "₹6,000 annual financial support for Maharashtra farmers. 3 installments of ₹2,000 each.",
    image: "https://sarkariyojana.com/wp-content/uploads/2024/04/pm-kisan-samman-nidhi-yojana.webp",
  };
  // Sensor data for the Mumbai farm
  const sensors = [
    { id: 1, title: "Crop Status", value: "82%" },
    { id: 2, title: "Soil Moisture", value: "68%" },
    { id: 3, title: "Water Tank", value: "55%" },
    { id: 4, title: "pH Level", value: "7.2" },
    { id: 5, title: "EC/TDS", value: "42%" },
    { id: 6, title: "Battery", value: "88%" },
    { id: 7, title: "Water Flow", value: "35%" },
    { id: 8, title: "CO2 Sensor", value: "410" },
    { id: 9, title: "Temperature", value: "34°C" },
    { id: 10, title: "Humidity", value: "65%" },
    { id: 11, title: "Light Intensity", value: "920" },
  ];

  // Farm Health Score Data
  const farmHealthTrendData = [75, 80, 85, 82, 78, 84, 82];

  // Quick stats for the Mumbai farm
  const quickStats = [
    { label: "Total Fields", value: "8" },
    { label: "Active Bots", value: "3" },
    { label: "Tasks Today", value: "6" },
    { label: "Health Score", value: "82%" },
  ];

  // Agrobot location in Mumbai
  const agrobotLocation = {
    latitude: 19.076,
    longitude: 72.8777,
    botName: "AgroBot 1",
    status: "Active",
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        isLarge && styles.scrollContentLarge,
      ]}
    >
      {/* 1. HomeHero component */}
      <HomeHero
        tasks={tasks}
        location="Mumbai, Maharashtra"
        greeting="Hey, Good Morning!"
        temperature="34°C"
        windSpeed="3.6 km/h"
        humidity="65%"
        weatherCondition="Sunny"
        time="7:30AM | 18 July"
      />

      {/* 2. Quick Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Weather Timeline Component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weather Report</Text>
          <Text style={styles.sectionSubtitle}>7-day forecast</Text>
        </View>
        <WeatherForecastCard />
      </View>

      {/* 4. Farm Health Score Component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Farm Health</Text>
          <Text style={styles.sectionSubtitle}>Overall score</Text>
        </View>
        <FarmHealthCard
          score={82}
          status="Good"
          trendData={farmHealthTrendData}
        />
      </View>

      {/* 5. Sensor Reading Component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sensors Reading</Text>
          <Text style={styles.sectionSubtitle}>Real-time data</Text>
        </View>
        <SensorGrid
          data={sensors}
          modalContent={(item) => (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{item?.title}</Text>
              <Text style={styles.modalValue}>{item?.value}</Text>
              <Text style={styles.modalDescription}>Current reading</Text>
            </View>
          )}
        />
      </View>

      {/* 6. Agrobot location component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agrobot Location</Text>
          <Text style={styles.sectionSubtitle}>Live tracking</Text>
        </View>
        <AgrobotLocationCard
          title="Agro-Bot Location"
          latitude={agrobotLocation.latitude}
          longitude={agrobotLocation.longitude}
          botName={agrobotLocation.botName}
          status={agrobotLocation.status}
          onFabPress={() => console.log("Chat with Agrobot")}
        />
      </View>

      {/* 7. PM Kisan Scheme Component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PM Kisan Scheme</Text>
          <Text style={styles.sectionSubtitle}>Apply now</Text>
        </View>
        <AppListCard
          image={pmKisanScheme.image}
          title={pmKisanScheme.title}
          description={pmKisanScheme.description}
          buttonText="Apply Now"
          onPress={() => {}}
        />
      </View>

      {/* 8. SchemeCarousel Component */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Farmer Schemes</Text>
          <Text style={styles.sectionSubtitle}>Available schemes</Text>
        </View>
        <SchemeCarousel data={schemes} onApply={() => {}} />
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentLarge: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },

  // Quick Stats
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.3,
  },

  // Modal Content
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 10,
  },
  modalValue: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: "#2C5F2D",
    marginVertical: 8,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 4,
  },

  bottomSpacing: {
    height: 40,
  },
});