import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Theme
import { typography } from "../../src/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function FarmDashboard() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Mumbai-based farm data
  const farmData = {
    name: "Mumbai Organic Farms",
    farmer: "Rajesh Patil",
    id: "FRM-0042",
    location: "Mumbai, Maharashtra",
    coordinates: "19.0760° N, 72.8777° E",
    size: "2.5 Acres",
    plots: 3,
    type: "Organic Open Field",
    created: "15 March 2024",
  };

  // Plot Information - Mumbai region crops
  const plots = [
    {
      id: "A",
      name: "Plot A",
      size: "0.8 acre",
      crop: "Tomato (Desi)",
      health: 94,
    },
    {
      id: "B",
      name: "Plot B",
      size: "0.8 acre",
      crop: "Okra (Bhindi)",
      health: 88,
    },
    {
      id: "C",
      name: "Plot C",
      size: "0.9 acre",
      crop: "Leafy Vegetables",
      health: 91,
    },
  ];

  // Current Crop - Mumbai monsoon season
  const currentCrop = {
    name: "Tomato",
    variety: "Desi Hybrid",
    stage: "Flowering Stage",
    sowing: "15 June 2026",
    harvest: "20 September 2026",
    age: "30 days",
  };

  // Soil Information - Mumbai region soil
  const soilInfo = {
    type: "Laterite Soil",
    moisture: "58%",
    temperature: "28°C",
    ph: "6.4",
    nitrogen: "Good",
    phosphorus: "Medium",
    potassium: "Good",
    organicCarbon: "1.2%",
  };

  // Weather Information - Mumbai monsoon
  const weatherInfo = {
    temperature: "30°C",
    humidity: "78%",
    rainProbability: "85%",
    windSpeed: "3.1 km/h",
    uvIndex: "5",
    monsoonStatus: "Active",
  };

  // Water Information
  const waterInfo = {
    source: "Borewell + Rainwater Harvesting",
    availability: "82%",
    dailyConsumption: "1850 litres",
    weeklyConsumption: "12950 litres",
    saving: "22%",
  };

  // Irrigation Information
  const irrigationInfo = {
    system: "Drip + Sprinkler",
    lastIrrigation: "Today 5:30 AM",
    nextIrrigation: "Tomorrow 6:00 AM",
    waterNeed: "16 mm",
  };

  // Agrobot Information
  const agrobots = [
    { id: 1, battery: 92, health: "Excellent", task: "Field Monitoring" },
    { id: 2, battery: 78, health: "Good", task: "Irrigation Management" },
  ];

  // Tasks
  const tasks = [
    { day: "Today", task: "Harvesting - Plot A", time: "6:00 AM" },
    { day: "Tomorrow", task: "Fertilizer Application", time: "7:00 AM" },
    { day: "Friday", task: "Disease Monitoring", time: "9:00 AM" },
    { day: "Sunday", task: "Weed Control", time: "6:30 AM" },
  ];

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#34C759";
    if (score >= 60) return "#FF9500";
    return "#FF3B30";
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const renderSection = (id: string, title: string, icon: IconName) => {
    const isExpanded = expandedSection === id;

    return (children: React.ReactNode) => (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(id)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name={icon} size={18} color="#2C5F2D" />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#C7C7CC"
          />
        </TouchableOpacity>
        {isExpanded && <View style={styles.sectionContent}>{children}</View>}
      </View>
    );
  };

  const renderInfoRow = (
    label: string,
    value: string,
    valueColor = "#1A1A1A",
    icon: IconName | null = null,
  ) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color="#8E8E93"
            style={styles.infoIcon}
          />
        )}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
    </View>
  );

  const renderMetricCard = (
    label: string,
    value: string,
    subtitle: string | null,
    icon: IconName,
    color = "#2C5F2D",
  ) => (
    <View style={styles.metricCard}>
      <View
        style={[styles.metricIconContainer, { backgroundColor: color + "12" }]}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {subtitle && <Text style={styles.metricSubtext}>{subtitle}</Text>}
    </View>
  );

  const renderProgressItem = (
    label: string,
    value: string | number,
    color = "#34C759",
  ) => {
    const progressValue =
      typeof value === "string" ? Number(value.replace("%", "")) : value;

    return (
      <View style={styles.progressItem}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{value}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressValue}%` as `${number}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isLarge && styles.scrollContentLarge,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Farm Intelligence</Text>
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitle}>{farmData.name}</Text>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Active</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="sync-outline" size={20} color="#2C5F2D" />
          </TouchableOpacity>
        </View>

        {/* Farm Overview */}
        <View style={styles.overviewCard}>
          <LinearGradient
            colors={["#2C5F2D", "#4A7A4B"]}
            style={styles.overviewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.overviewHeader}>
              <View>
                <Text style={styles.overviewName}>{farmData.name}</Text>
                <Text style={styles.overviewFarmer}>👨‍🌾 {farmData.farmer}</Text>
              </View>
              <View style={styles.overviewId}>
                <Text style={styles.overviewIdText}>{farmData.id}</Text>
              </View>
            </View>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{farmData.size}</Text>
                <Text style={styles.overviewStatLabel}>Farm Size</Text>
              </View>
              <View style={styles.overviewStatDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{farmData.plots}</Text>
                <Text style={styles.overviewStatLabel}>Plots</Text>
              </View>
              <View style={styles.overviewStatDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{farmData.type}</Text>
                <Text style={styles.overviewStatLabel}>Farm Type</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>30°C</Text>
            <Text style={styles.quickStatLabel}>Temperature</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>78%</Text>
            <Text style={styles.quickStatLabel}>Humidity</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>85%</Text>
            <Text style={styles.quickStatLabel}>Rain Chance</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>86</Text>
            <Text style={styles.quickStatLabel}>Health Score</Text>
          </View>
        </View>

        {/* Farm Health Score - Hero Card */}
        <View style={styles.healthHero}>
          <LinearGradient
            colors={["#2C5F2D", "#4A7A4B"]}
            style={styles.healthHeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.healthHeroContent}>
              <View>
                <Text style={styles.healthHeroTitle}>Farm Health Score</Text>
                <Text style={styles.healthHeroSubtitle}>
                  Overall farm performance
                </Text>
              </View>
              <View style={styles.healthHeroScore}>
                <Text style={styles.healthHeroScoreValue}>86</Text>
                <Text style={styles.healthHeroScoreTotal}>/100</Text>
              </View>
            </View>
            <View style={styles.healthHeroBreakdown}>
              {renderProgressItem("Soil Health", "90%")}
              {renderProgressItem("Water Efficiency", "88%")}
              {renderProgressItem("Crop Health", "85%")}
              <View style={styles.healthHeroBadges}>
                <View style={styles.healthHeroBadge}>
                  <View
                    style={[
                      styles.healthHeroDot,
                      { backgroundColor: "#34C759" },
                    ]}
                  />
                  <Text style={styles.healthHeroBadgeText}>Disease: Low</Text>
                </View>
                <View style={styles.healthHeroBadge}>
                  <View
                    style={[
                      styles.healthHeroDot,
                      { backgroundColor: "#34C759" },
                    ]}
                  />
                  <Text style={styles.healthHeroBadgeText}>Weed: Low</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 1. Plot Information */}
        {renderSection(
          "plots",
          "📊 Plot Information",
          "grid-outline",
        )(
          <View>
            {plots.map((plot) => (
              <View key={plot.id} style={styles.plotCard}>
                <View style={styles.plotHeader}>
                  <View style={styles.plotNameContainer}>
                    <View
                      style={[
                        styles.plotColor,
                        { backgroundColor: getHealthColor(plot.health) },
                      ]}
                    />
                    <Text style={styles.plotName}>{plot.name}</Text>
                  </View>
                  <Text style={styles.plotSize}>{plot.size}</Text>
                </View>
                <View style={styles.plotDetails}>
                  <Text style={styles.plotCrop}>🌱 {plot.crop}</Text>
                  <View style={styles.plotHealth}>
                    <Text
                      style={[
                        styles.plotHealthText,
                        { color: getHealthColor(plot.health) },
                      ]}
                    >
                      {plot.health}%
                    </Text>
                    <View style={styles.plotHealthBar}>
                      <View
                        style={[
                          styles.plotHealthFill,
                          {
                            width: `${plot.health}%`,
                            backgroundColor: getHealthColor(plot.health),
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>,
        )}

        {/* 2. Current Crop */}
        {renderSection(
          "crop",
          "🌱 Current Crop",
          "leaf-outline",
        )(
          <View style={styles.cropContainer}>
            <View style={styles.cropHeader}>
              <View>
                <Text style={styles.cropName}>{currentCrop.name}</Text>
                <Text style={styles.cropVariety}>{currentCrop.variety}</Text>
              </View>
              <View style={styles.cropStage}>
                <Text style={styles.cropStageText}>{currentCrop.stage}</Text>
              </View>
            </View>
            <View style={styles.cropDetails}>
              {renderInfoRow(
                "Sowing Date",
                currentCrop.sowing,
                "#1A1A1A",
                "calendar-outline",
              )}
              {renderInfoRow(
                "Expected Harvest",
                currentCrop.harvest,
                "#1A1A1A",
                "calendar-outline",
              )}
              {renderInfoRow(
                "Crop Age",
                currentCrop.age,
                "#1A1A1A",
                "time-outline",
              )}
            </View>
          </View>,
        )}

        {/* 3. Weather Information */}
        {renderSection(
          "weather",
          "🌤️ Weather",
          "cloud-outline",
        )(
          <View style={styles.weatherContainer}>
            <View style={styles.weatherMain}>
              <View style={styles.weatherTemperature}>
                <Text style={styles.weatherTempValue}>
                  {weatherInfo.temperature}
                </Text>
                <Text style={styles.weatherTempLabel}>Current</Text>
              </View>
              <View style={styles.weatherMonsoon}>
                <Text style={styles.weatherMonsoonText}>
                  ☔ {weatherInfo.monsoonStatus}
                </Text>
                <Text style={styles.weatherMonsoonLabel}>Monsoon Status</Text>
              </View>
            </View>
            <View style={styles.weatherGrid}>
              {renderMetricCard(
                "Humidity",
                weatherInfo.humidity,
                null,
                "water-outline",
                "#5CCEFF",
              )}
              {renderMetricCard(
                "Rain Chance",
                weatherInfo.rainProbability,
                null,
                "rainy-outline",
                "#007AFF",
              )}
              {renderMetricCard(
                "Wind",
                weatherInfo.windSpeed,
                null,
                "cloud-outline",
                "#8E8E93",
              )}
              {renderMetricCard(
                "UV Index",
                weatherInfo.uvIndex,
                null,
                "sunny-outline",
                "#FF9500",
              )}
            </View>
          </View>,
        )}

        {/* 4. Soil Information */}
        {renderSection(
          "soil",
          "🧪 Soil Information",
          "flask-outline",
        )(
          <View style={styles.soilContainer}>
            <View style={styles.soilHeader}>
              <Text style={styles.soilType}>{soilInfo.type}</Text>
              <View style={styles.soilStatus}>
                <View style={styles.soilStatusDot} />
                <Text style={styles.soilStatusText}>Healthy</Text>
              </View>
            </View>
            <View style={styles.soilGrid}>
              {renderInfoRow(
                "Moisture",
                soilInfo.moisture,
                "#1A1A1A",
                "water-outline",
              )}
              {renderInfoRow(
                "Temperature",
                soilInfo.temperature,
                "#1A1A1A",
                "thermometer-outline",
              )}
              {renderInfoRow(
                "pH Level",
                soilInfo.ph,
                "#1A1A1A",
                "flask-outline",
              )}
              {renderInfoRow(
                "Organic Carbon",
                soilInfo.organicCarbon,
                "#1A1A1A",
                "leaf-outline",
              )}
              {renderInfoRow(
                "Nitrogen",
                soilInfo.nitrogen,
                "#34C759",
                "leaf-outline",
              )}
              {renderInfoRow(
                "Phosphorus",
                soilInfo.phosphorus,
                "#FF9500",
                "leaf-outline",
              )}
              {renderInfoRow(
                "Potassium",
                soilInfo.potassium,
                "#34C759",
                "leaf-outline",
              )}
            </View>
          </View>,
        )}

        {/* 5. Water & Irrigation */}
        {renderSection(
          "water",
          "💧 Water & Irrigation",
          "water-outline",
        )(
          <View>
            <View style={styles.waterSection}>
              <Text style={styles.waterSectionTitle}>Water Information</Text>
              {renderInfoRow(
                "Source",
                waterInfo.source,
                "#1A1A1A",
                "water-outline",
              )}
              {renderInfoRow(
                "Availability",
                waterInfo.availability,
                "#34C759",
                "water-outline",
              )}
              {renderInfoRow(
                "Daily Usage",
                waterInfo.dailyConsumption,
                "#1A1A1A",
                "water-outline",
              )}
              {renderInfoRow(
                "Weekly Usage",
                waterInfo.weeklyConsumption,
                "#1A1A1A",
                "water-outline",
              )}
              {renderInfoRow(
                "Saved This Month",
                waterInfo.saving,
                "#34C759",
                "trending-up-outline",
              )}
            </View>
            <View style={styles.irrigationSection}>
              <Text style={styles.irrigationTitle}>Irrigation</Text>
              {renderInfoRow(
                "System",
                irrigationInfo.system,
                "#1A1A1A",
                "sync-outline",
              )}
              {renderInfoRow(
                "Last Irrigation",
                irrigationInfo.lastIrrigation,
                "#1A1A1A",
                "time-outline",
              )}
              {renderInfoRow(
                "Next Irrigation",
                irrigationInfo.nextIrrigation,
                "#007AFF",
                "calendar-outline",
              )}
              {renderInfoRow(
                "Daily Need",
                irrigationInfo.waterNeed,
                "#1A1A1A",
                "water-outline",
              )}
            </View>
          </View>,
        )}

        {/* 6. Agrobot Information */}
        {renderSection(
          "agrobot",
          "🤖 Agrobot Status",
          "hardware-chip-outline",
        )(
          <View>
            <View style={styles.agrobotStats}>
              <View style={styles.agrobotStat}>
                <Text style={styles.agrobotStatValue}>2</Text>
                <Text style={styles.agrobotStatLabel}>Connected</Text>
              </View>
              <View style={styles.agrobotStat}>
                <Text style={[styles.agrobotStatValue, { color: "#34C759" }]}>
                  2
                </Text>
                <Text style={styles.agrobotStatLabel}>Active</Text>
              </View>
              <View style={styles.agrobotStat}>
                <Text style={[styles.agrobotStatValue, { color: "#34C759" }]}>
                  92%
                </Text>
                <Text style={styles.agrobotStatLabel}>Avg Battery</Text>
              </View>
            </View>
            {agrobots.map((bot) => (
              <View key={bot.id} style={styles.agrobotCard}>
                <View style={styles.agrobotHeader}>
                  <View style={styles.agrobotNameContainer}>
                    <Text style={styles.agrobotName}>AgroBot {bot.id}</Text>
                    <View
                      style={[
                        styles.agrobotStatus,
                        {
                          backgroundColor:
                            bot.battery >= 80 ? "#34C759" : "#FF9500",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.agrobotTask}>{bot.task}</Text>
                </View>
                <View style={styles.agrobotDetails}>
                  <View style={styles.agrobotDetail}>
                    <Text style={styles.agrobotDetailLabel}>Battery</Text>
                    <View style={styles.agrobotBattery}>
                      <View
                        style={[
                          styles.agrobotBatteryFill,
                          {
                            width: `${bot.battery}%`,
                            backgroundColor:
                              bot.battery >= 80 ? "#34C759" : "#FF9500",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.agrobotDetailValue}>
                      {bot.battery}%
                    </Text>
                  </View>
                  <View style={styles.agrobotDetail}>
                    <Text style={styles.agrobotDetailLabel}>Health</Text>
                    <Text
                      style={[styles.agrobotDetailValue, { color: "#34C759" }]}
                    >
                      {bot.health}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>,
        )}

        {/* 7. Disease & Weed Monitoring */}
        {renderSection(
          "monitoring",
          "🔬 Disease & Weed",
          "medical-outline",
        )(
          <View>
            <View style={styles.monitoringSection}>
              <Text style={styles.monitoringTitle}>Disease Monitoring</Text>
              <View style={styles.monitoringStatus}>
                <View
                  style={[
                    styles.monitoringStatusBadge,
                    { backgroundColor: "#E8F5E9" },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.monitoringStatusText}>Healthy</Text>
                </View>
              </View>
              {renderInfoRow(
                "Probability",
                "12%",
                "#1A1A1A",
                "analytics-outline",
              )}
              {renderInfoRow(
                "Risk Level",
                "Low",
                "#34C759",
                "alert-circle-outline",
              )}
              {renderInfoRow(
                "Recommendation",
                "Weekly monitoring recommended",
                "#1A1A1A",
                "bulb-outline",
              )}
            </View>
            <View style={styles.monitoringSection}>
              <Text style={styles.monitoringTitle}>Weed Monitoring</Text>
              {renderInfoRow("Weed Coverage", "7%", "#1A1A1A", "leaf-outline")}
              {renderInfoRow(
                "Risk Level",
                "Low",
                "#34C759",
                "alert-circle-outline",
              )}
              {renderInfoRow(
                "Action",
                "Mechanical removal",
                "#1A1A1A",
                "construct-outline",
              )}
            </View>
          </View>,
        )}

        {/* 8. Farm Economics */}
        {renderSection(
          "economics",
          "💰 Farm Economics",
          "cash-outline",
        )(
          <View style={styles.economicsGrid}>
            {renderMetricCard(
              "Investment",
              "₹35K",
              "Season 2026",
              "trending-down-outline",
              "#FF6B35",
            )}
            {renderMetricCard(
              "Revenue",
              "₹1.8L",
              "Projected",
              "trending-up-outline",
              "#34C759",
            )}
            {renderMetricCard(
              "Profit",
              "₹1.2L",
              "Expected",
              "cash-outline",
              "#2C5F2D",
            )}
            {renderMetricCard(
              "Expenses",
              "₹18K",
              "This month",
              "receipt-outline",
              "#FF9500",
            )}
          </View>,
        )}

        {/* 9. Sustainability */}
        {renderSection(
          "sustainability",
          "🌿 Sustainability",
          "leaf-outline",
        )(
          <View style={styles.sustainabilityGrid}>
            {renderMetricCard(
              "Water Saved",
              "400L",
              "This month",
              "water-outline",
              "#5CCEFF",
            )}
            {renderMetricCard(
              "Pesticides Reduced",
              "12%",
              "vs last season",
              "flask-outline",
              "#34C759",
            )}
            {renderMetricCard(
              "Carbon Reduction",
              "8%",
              "Target: 15%",
              "cloud-outline",
              "#8E8E93",
            )}
            {renderMetricCard(
              "AI Efficiency",
              "91%",
              "Smart farming",
              "analytics-outline",
              "#2C5F2D",
            )}
          </View>,
        )}

        {/* 10. Upcoming Tasks */}
        {renderSection(
          "tasks",
          "📅 Upcoming Tasks",
          "calendar-outline",
        )(
          <View style={styles.tasksContainer}>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskCard}>
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.taskDay,
                      { backgroundColor: index === 0 ? "#2C5F2D" : "#E5E5EA" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.taskDayText,
                        { color: index === 0 ? "#FFFFFF" : "#8E8E93" },
                      ]}
                    >
                      {task.day}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.taskText}>{task.task}</Text>
                    <Text style={styles.taskTime}>{task.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>
            ))}
          </View>,
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  scrollContentLarge: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  headerSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  headerBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  // Overview Card
  overviewCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  overviewGradient: {
    padding: 16,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  overviewName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  overviewFarmer: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  overviewId: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overviewIdText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  overviewStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 10,
  },
  overviewStat: {
    alignItems: "center",
    flex: 1,
  },
  overviewStatValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
  },
  overviewStatLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  overviewStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // Quick Stats
  quickStats: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  quickStat: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  quickStatValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  quickStatLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
  },

  // Health Hero
  healthHero: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  healthHeroGradient: {
    padding: 16,
  },
  healthHeroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  healthHeroTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  healthHeroSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  healthHeroScore: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  healthHeroScoreValue: {
    fontSize: 36,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
  },
  healthHeroScoreTotal: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.6)",
    marginLeft: 2,
  },
  healthHeroBreakdown: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
  },
  healthHeroBadges: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  healthHeroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  healthHeroDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  healthHeroBadgeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.85)",
  },

  // Progress
  progressItem: {
    marginBottom: 4,
  },
  progressLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.8)",
  },
  progressValue: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // Section
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  sectionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },

  // Info Row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F5F5F5",
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIcon: {
    width: 16,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },

  // Metric Card
  metricCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 1,
  },
  metricSubtext: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
  },

  // Plot
  plotCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  plotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plotNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  plotColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  plotName: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  plotSize: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  plotDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  plotCrop: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
  },
  plotHealth: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  plotHealthText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
  },
  plotHealthBar: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    overflow: "hidden",
  },
  plotHealthFill: {
    height: "100%",
    borderRadius: 2,
  },

  // Crop
  cropContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cropName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  cropVariety: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 1,
  },
  cropStage: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cropStageText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
  cropDetails: {
    gap: 2,
  },

  // Weather
  weatherContainer: {
    gap: 12,
  },
  weatherMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
  },
  weatherTemperature: {
    alignItems: "center",
  },
  weatherTempValue: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  weatherTempLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  weatherMonsoon: {
    alignItems: "center",
  },
  weatherMonsoonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#007AFF",
  },
  weatherMonsoonLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  weatherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Soil
  soilContainer: {
    gap: 8,
  },
  soilHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
  },
  soilType: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  soilStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  soilStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34C759",
  },
  soilStatusText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#34C759",
  },
  soilGrid: {
    gap: 2,
  },

  // Water & Irrigation
  waterSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  waterSectionTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 6,
  },
  irrigationSection: {
    gap: 2,
  },
  irrigationTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 6,
  },

  // Agrobot
  agrobotStats: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  agrobotStat: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  agrobotStatValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  agrobotStatLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 1,
  },
  agrobotCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  agrobotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  agrobotNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  agrobotName: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  agrobotStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  agrobotTask: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  agrobotDetails: {
    flexDirection: "row",
    gap: 16,
  },
  agrobotDetail: {
    flex: 1,
  },
  agrobotDetailLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  agrobotBattery: {
    height: 3,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    overflow: "hidden",
    marginVertical: 2,
  },
  agrobotBatteryFill: {
    height: "100%",
    borderRadius: 2,
  },
  agrobotDetailValue: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },

  // Monitoring
  monitoringSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  monitoringTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  monitoringStatus: {
    marginBottom: 6,
  },
  monitoringStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  monitoringStatusText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#34C759",
  },

  // Economics
  economicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Sustainability
  sustainabilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Tasks
  tasksContainer: {
    gap: 8,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskDay: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  taskDayText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },
  taskText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
  },
  taskTime: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 1,
  },

  bottomSpacing: {
    height: 20,
  },
});
