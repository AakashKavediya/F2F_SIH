// app/(tabs)/history.jsx
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Import Components
import AgrobotSummaryCard from "../../components/agrobot/AgrobotSummaryCard";
import ExportReportCard from "../../components/history/ExportReportCard";
import HistoryDateFilter from "../../components/history/HistoryDateFilter";
import WeeklyGraphCard from "../../components/history/WeeklyGraphCard";

// Theme
import { colors, typography } from "../../src/theme";

// ── Helper Functions ──────────────────────────────────────────────────
const getStatusColor = (status) => {
  const colors = {
    'excellent': '#D8F0D1',
    'good': '#F4EDC8',
    'needs_attention': '#FFD3D3',
  };
  return colors[status] || '#F0F0F0';
};

const getStatusLabel = (status) => {
  const labels = {
    'excellent': 'Excellent',
    'good': 'Good',
    'needs_attention': 'Needs Attention',
  };
  return labels[status] || status || 'Good';
};

// ── Generate History Data (22/7/26 to 15/7/26) ──────────────────────
const generateHistoryData = () => {
  const data = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Tomato', 'Onion', 'Potato'];
  const fieldNames = ['Field A', 'Field B', 'Field C', 'Plot A', 'Plot B', 'Plot C', 'Plot D', 'Plot E'];
  const irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Furrow'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty'];
  
  for (let i = 22; i >= 15; i--) {
    const date = new Date(2026, 6, i);
    
    let baseScore = 70 + Math.floor(Math.random() * 25);
    if (date.getDay() === 6 || date.getDay() === 0) {
      baseScore += Math.floor(Math.random() * 10);
    }
    if (Math.random() < 0.15) {
      baseScore -= Math.floor(Math.random() * 20);
    }
    const score = Math.min(100, Math.max(35, baseScore));
    
    let status = 'good';
    if (score >= 80) status = 'excellent';
    else if (score < 60) status = 'needs_attention';
    
    const dayName = dayNames[date.getDay()];
    const isToday = i === 22;
    const crop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
    const field = fieldNames[Math.floor(Math.random() * fieldNames.length)];
    const irrigation = irrigationTypes[Math.floor(Math.random() * irrigationTypes.length)];
    const soil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    data.push({
      id: i,
      day: isToday ? 'Today' : dayName,
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      score: score,
      scoreColor: getStatusColor(status),
      status: status,
      // Weather Data
      temperature: Math.floor(Math.random() * 12) + 26,
      humidity: Math.floor(Math.random() * 35) + 50,
      rainfall: parseFloat((Math.random() * 12).toFixed(1)),
      wind_speed: parseFloat((Math.random() * 20).toFixed(1)),
      pressure: Math.floor(Math.random() * 20) + 1005,
      uv_index: parseFloat((Math.random() * 8 + 2).toFixed(1)),
      // Soil Data
      soil_moisture: Math.floor(Math.random() * 40) + 45,
      soil_type: soil,
      ph_level: parseFloat((6.0 + Math.random() * 1.5).toFixed(1)),
      nitrogen: Math.floor(Math.random() * 40) + 30,
      phosphorus: Math.floor(Math.random() * 30) + 20,
      potassium: Math.floor(Math.random() * 50) + 40,
      organic_matter: parseFloat((Math.random() * 3 + 1).toFixed(1)),
      // Crop Data
      crop_type: crop,
      field_name: field,
      irrigation_type: irrigation,
      crop_health: score >= 70 ? 'Good' : 'Fair',
      growth_stage: ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'][Math.floor(Math.random() * 5)],
      estimated_yield: parseFloat((Math.random() * 15 + 5).toFixed(1)),
      // Additional Data
      pest_risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      disease_risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      last_irrigation: Math.floor(Math.random() * 5) + 1,
      next_irrigation: Math.floor(Math.random() * 3) + 1,
      fertilizer_applied: ['Yes', 'No'][Math.floor(Math.random() * 2)],
    });
  }
  return data;
};

// ── Generate Bot Activities ──────────────────────────────────────────
const generateBotActivities = () => {
  const activities = [];
  const templates = [
    { title: "Bot completed field scan", icon: "bug-outline", bg: "#E8F5E9" },
    { title: "Bot completed watering", icon: "water-outline", bg: "#E3F2FD" },
    { title: "Disease detection scan", icon: "medkit-outline", bg: "#FFEBEE" },
    { title: "Sensor reading completed", icon: "speedometer-outline", bg: "#E8EAF6" },
    { title: "Pest control spraying", icon: "cloudy-outline", bg: "#E0F7FA" },
    { title: "Soil analysis completed", icon: "flask-outline", bg: "#F3E5F5" },
    { title: "Harvesting completed", icon: "leaf-outline", bg: "#E8F5E9" },
    { title: "Fertilizer application", icon: "git-branch-outline", bg: "#FFF3E0" },
  ];
  
  const fields = ['Field A', 'Field B', 'Field C', 'Plot A', 'Plot B', 'Plot C', 'Plot D', 'Plot E'];
  const times = ['9:15am', '10:45am', '11:30am', '2:30pm', '3:45pm', '4:00pm', '5:15pm', '6:30pm'];
  const statuses = ['Complete', 'In Progress', 'Scheduled', 'Delayed'];
  
  for (let i = 0; i < 30; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const field = fields[Math.floor(Math.random() * fields.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    const date = new Date(2026, 6, Math.floor(Math.random() * 8) + 15);
    const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const duration = Math.floor(Math.random() * 45) + 15;
    const area = (Math.random() * 4 + 1).toFixed(1);
    
    activities.push({
      id: i + 1,
      icon: template.icon,
      iconBackgroundColor: template.bg,
      title: template.title,
      subtitle: `${field} | ${time} | ${day} ${monthShort}`,
      details: [
        `Area covered: ${area} acres`,
        `Duration: ${duration} minutes`,
        `Status: ${status}`,
        `Battery used: ${Math.floor(Math.random() * 30) + 10}%`,
        `Efficiency: ${Math.floor(Math.random() * 20) + 80}%`,
      ],
      duration: duration,
      area: area,
      status: status,
      field: field,
      time: time,
    });
  }
  return activities;
};

// ── Weekly Data ──────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: "Mon", low: 10, medium: 20, high: 15 },
  { day: "Tue", low: 8, medium: 25, high: 20 },
  { day: "Wed", low: 12, medium: 18, high: 22 },
  { day: "Thu", low: 15, medium: 22, high: 18 },
  { day: "Fri", low: 20, medium: 15, high: 10 },
  { day: "Sat", low: 18, medium: 12, high: 8 },
  { day: "Sun", low: 22, medium: 20, high: 15 },
];

// ── CSV Generation Functions ──────────────────────────────────────────
const generateFarmHealthCSV = (data) => {
  const headers = ['Date', 'Day', 'Score', 'Status', 'Crop Health', 'Temperature', 'Humidity', 'Field', 'Crop Type'];
  const rows = data.map(d => [
    d.date,
    d.day,
    d.score,
    getStatusLabel(d.status),
    d.crop_health,
    d.temperature + '°C',
    d.humidity + '%',
    d.field_name,
    d.crop_type
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateSoilAnalysisCSV = (data) => {
  const headers = ['Date', 'Day', 'Soil Moisture', 'pH Level', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Organic Matter', 'Soil Type'];
  const rows = data.map(d => [
    d.date,
    d.day,
    d.soil_moisture + '%',
    d.ph_level,
    d.nitrogen + ' ppm',
    d.phosphorus + ' ppm',
    d.potassium + ' ppm',
    d.organic_matter + '%',
    d.soil_type
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateCropYieldCSV = (data) => {
  const headers = ['Date', 'Day', 'Score', 'Crop Type', 'Growth Stage', 'Estimated Yield (tons)', 'Field', 'Irrigation Type', 'Fertilizer Applied'];
  const rows = data.map(d => [
    d.date,
    d.day,
    d.score,
    d.crop_type,
    d.growth_stage,
    d.estimated_yield,
    d.field_name,
    d.irrigation_type,
    d.fertilizer_applied
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateWeatherCSV = (data) => {
  const headers = ['Date', 'Day', 'Temperature', 'Humidity', 'Rainfall (mm)', 'Wind Speed (km/h)', 'Pressure (hPa)', 'UV Index'];
  const rows = data.map(d => [
    d.date,
    d.day,
    d.temperature + '°C',
    d.humidity + '%',
    d.rainfall,
    d.wind_speed,
    d.pressure,
    d.uv_index
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateCompleteCSV = (data, activities) => {
  const headers = ['Date', 'Day', 'Score', 'Status', 'Soil Moisture', 'pH Level', 'Temperature', 'Humidity', 'Crop Health', 'Crop Type', 'Field', 'Growth Stage', 'Pest Risk', 'Disease Risk', 'Total Activities'];
  const rows = data.map(d => [
    d.date,
    d.day,
    d.score,
    getStatusLabel(d.status),
    d.soil_moisture + '%',
    d.ph_level,
    d.temperature + '°C',
    d.humidity + '%',
    d.crop_health,
    d.crop_type,
    d.field_name,
    d.growth_stage,
    d.pest_risk,
    d.disease_risk,
    activities.length
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// ── Generate Activity CSV ─────────────────────────────────────────────
const generateActivitiesCSV = (activities) => {
  const headers = ['Activity', 'Field', 'Time', 'Date', 'Duration (mins)', 'Area (acres)', 'Status', 'Efficiency'];
  const rows = activities.map(a => [
    a.title,
    a.field || 'N/A',
    a.time || 'N/A',
    a.subtitle ? a.subtitle.split('|')[2]?.trim() || 'N/A' : 'N/A',
    a.duration || 'N/A',
    a.area || 'N/A',
    a.status || 'Complete',
    a.details ? a.details[4]?.split(':')[1]?.trim() || 'N/A' : 'N/A'
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export default function HistoryPage() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // ── State ────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState("2026-07-22");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // ── Data ────────────────────────────────────────────────────────────
  const historyData = generateHistoryData();
  const botActivities = generateBotActivities();
  const weeklyData = WEEKLY_DATA;

  // ── Handle Date Change ─────────────────────────────────────────────
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // ── File Download ────────────────────────────────────────────────────
  const handleDownload = async (reportTitle, reportType) => {
    try {
      setLoading(true);
      setDownloadingId(reportTitle);

      let csvData = '';
      let fileName = '';

      switch(reportType) {
        case 'health':
          csvData = generateFarmHealthCSV(historyData);
          fileName = 'Farm_Health_Report.csv';
          break;
        case 'soil':
          csvData = generateSoilAnalysisCSV(historyData);
          fileName = 'Soil_Analysis_Report.csv';
          break;
        case 'yield':
          csvData = generateCropYieldCSV(historyData);
          fileName = 'Crop_Yield_Report.csv';
          break;
        case 'weather':
          csvData = generateWeatherCSV(historyData);
          fileName = 'Weather_Impact_Report.csv';
          break;
        case 'activities':
          csvData = generateActivitiesCSV(botActivities);
          fileName = 'Bot_Activities_Report.csv';
          break;
        case 'complete':
          csvData = generateCompleteCSV(historyData, botActivities);
          fileName = 'Complete_Farm_Summary.csv';
          break;
        default:
          csvData = generateFarmHealthCSV(historyData);
          fileName = 'Farm_Report.csv';
      }

      const documentDirectory = FileSystem.documentDirectory;
      const fileUri = documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/csv",
            dialogTitle: `Download ${reportTitle}`,
          });
        } else {
          Alert.alert("File Saved", `Report saved to:\n${fileUri}`, [
            { text: "OK" },
          ]);
        }
      } else {
        Alert.alert("Error", "File could not be created. Please try again.");
      }

      setLoading(false);
      setDownloadingId(null);
    } catch (error) {
      console.error("File Generation Error:", error);
      Alert.alert("Error", "Failed to generate file. Please try again.", [
        { text: "OK" },
      ]);
      setLoading(false);
      setDownloadingId(null);
    }
  };

  // ── Prepare Reports for Export Component ───────────────────────────
  const reportsWithDownload = [
    { 
      id: 1, 
      title: "Farm Health Report", 
      description: "Health metrics including temperature, humidity, and crop status",
      type: "health",
      onDownload: () => handleDownload("Farm Health Report", "health")
    },
    { 
      id: 2, 
      title: "Soil Analysis Report", 
      description: "Complete soil analysis with NPK, pH, and organic matter",
      type: "soil",
      onDownload: () => handleDownload("Soil Analysis Report", "soil")
    },
    { 
      id: 3, 
      title: "Crop Yield Report", 
      description: "Crop details, growth stage, and estimated yield",
      type: "yield",
      onDownload: () => handleDownload("Crop Yield Report", "yield")
    },
    { 
      id: 4, 
      title: "Weather Impact Report", 
      description: "Weather data including rainfall, wind speed, and UV index",
      type: "weather",
      onDownload: () => handleDownload("Weather Impact Report", "weather")
    },
    { 
      id: 5, 
      title: "Bot Activities Report", 
      description: "Complete log of all bot activities and performance",
      type: "activities",
      onDownload: () => handleDownload("Bot Activities Report", "activities")
    },
    { 
      id: 6, 
      title: "Complete Farm Summary", 
      description: "All farm data combined in one comprehensive report",
      type: "complete",
      onDownload: () => handleDownload("Complete Farm Summary", "complete")
    },
  ];

  // ── Tabs ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "scores", label: "Scores" },
    { id: "sensors", label: "Sensors" },
    { id: "activities", label: "Activities" },
  ];

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
        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2C5F2D" />
            <Text style={styles.loadingText}>Generating Report...</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
        </View>

        {/* Tabs - iOS Style Segmented Control */}
        <View style={styles.segmentedControl}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.segment,
                activeTab === tab.id && styles.segmentActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === tab.id && styles.segmentTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 1. Agrobot Summary Card */}
        <View style={styles.section}>
          <AgrobotSummaryCard
            image={require("../../assets/images/logo2.png")}
            title="Latest Field Scan"
            timestamp={new Date().toLocaleString('en-US', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            status={`Score: ${historyData[0]?.score || 0}/100`}
            onlineStatus="Online"
          />
        </View>

        {/* 2. History Date Filter */}
        <View style={styles.section}>
          <HistoryDateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            placeholder="Select Date"
          />
        </View>

        {/* 3. Daily Score History - Card Format */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Score History</Text>
            <Text style={styles.viewAllText}>22 - 15 July 2026</Text>
          </View>
          
          {historyData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.historyCard, { borderLeftColor: item.scoreColor }]}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  `${item.day} - ${item.date}`,
                  `📊 Score: ${item.score}/100\n` +
                  `📈 Status: ${getStatusLabel(item.status)}\n\n` +
                  `🌱 Crop: ${item.crop_type}\n` +
                  `📍 Field: ${item.field_name}\n` +
                  `🌿 Growth: ${item.growth_stage}\n\n` +
                  `🌡️ Temperature: ${item.temperature}°C\n` +
                  `💧 Humidity: ${item.humidity}%\n` +
                  `🌧️ Rainfall: ${item.rainfall} mm\n` +
                  `💨 Wind Speed: ${item.wind_speed} km/h\n` +
                  `☀️ UV Index: ${item.uv_index}\n\n` +
                  `🧪 Soil Moisture: ${item.soil_moisture}%\n` +
                  `🧪 pH Level: ${item.ph_level}\n` +
                  `🌱 Organic Matter: ${item.organic_matter}%\n\n` +
                  `⚠️ Pest Risk: ${item.pest_risk}\n` +
                  `⚠️ Disease Risk: ${item.disease_risk}\n` +
                  `💧 Last Irrigation: ${item.last_irrigation} days ago\n` +
                  `💧 Next Irrigation: ${item.next_irrigation} days`,
                  [{ text: "OK" }]
                );
              }}
            >
              <View style={styles.historyCardHeader}>
                <View>
                  <Text style={styles.historyCardDay}>{item.day}</Text>
                  <Text style={styles.historyCardDate}>{item.date}</Text>
                  <Text style={styles.historyCardSubtitle}>{item.crop_type} • {item.field_name}</Text>
                </View>
                <View style={[styles.historyCardScore, { backgroundColor: item.scoreColor }]}>
                  <Text style={styles.historyCardScoreText}>{item.score}</Text>
                </View>
              </View>
              
              <View style={styles.historyCardStats}>
                <View style={styles.historyCardStat}>
                  <Ionicons name="water-outline" size={14} color="#4ECDC4" />
                  <Text style={styles.historyCardStatLabel}>Moisture</Text>
                  <Text style={styles.historyCardStatValue}>{item.soil_moisture}%</Text>
                </View>
                <View style={styles.historyCardStat}>
                  <Ionicons name="thermometer-outline" size={14} color="#FF6B6B" />
                  <Text style={styles.historyCardStatLabel}>Temp</Text>
                  <Text style={styles.historyCardStatValue}>{item.temperature}°C</Text>
                </View>
                <View style={styles.historyCardStat}>
                  <Ionicons name="water-outline" size={14} color="#4A90D9" />
                  <Text style={styles.historyCardStatLabel}>Humidity</Text>
                  <Text style={styles.historyCardStatValue}>{item.humidity}%</Text>
                </View>
                <View style={styles.historyCardStat}>
                  <Ionicons name="leaf-outline" size={14} color="#2C5F2D" />
                  <Text style={styles.historyCardStatLabel}>Health</Text>
                  <Text style={[styles.historyCardStatValue, { color: item.score >= 70 ? '#2C5F2D' : '#FF9500' }]}>
                    {item.crop_health}
                  </Text>
                </View>
              </View>

              <View style={styles.historyCardFooter}>
                <View style={[styles.historyCardStatus, { backgroundColor: item.scoreColor }]}>
                  <Text style={styles.historyCardStatusText}>{getStatusLabel(item.status)}</Text>
                </View>
                <View style={styles.historyCardTags}>
                  <View style={styles.historyCardTag}>
                    <Text style={styles.historyCardTagText}>{item.growth_stage}</Text>
                  </View>
                  <Text style={styles.historyCardMore}>Tap →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Weekly Graph */}
        <View style={styles.section}>
          <WeeklyGraphCard
            data={weeklyData}
            title="Weekly Activity"
            subtitle="Past 7 days"
            legendLabels={["High", "Medium", "Low"]}
          />
        </View>

        {/* 5. Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <Text style={styles.viewAllText}>Last 5</Text>
          </View>
          {botActivities.slice(0, 5).map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: activity.iconBackgroundColor }]}>
                <Ionicons name={activity.icon} size={20} color="#333" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityDetailText}>{activity.details[0]}</Text>
                  <Text style={styles.activityDetailText}>• {activity.details[1]}</Text>
                  <View style={[styles.activityStatusBadge, { 
                    backgroundColor: activity.status === 'Complete' ? '#E8F5E9' : '#FFF3E0'
                  }]}>
                    <Text style={[styles.activityStatusText, {
                      color: activity.status === 'Complete' ? '#2C5F2D' : '#FF9500'
                    }]}>
                      {activity.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 6. Export Report - CSV Export */}
        <View style={styles.section}>
          <ExportReportCard
            data={reportsWithDownload}
            title="Export Report"
            subtitle="Download your farm data as CSV"
            viewAll="View All"
            onViewAll={() => {}}
            downloadingId={downloadingId}
          />
        </View>

        {/* Bottom Spacing */}
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

  // Loading Overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
  },

  // Header
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },

  // Segmented Control - iOS Style
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E5E5EA",
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    letterSpacing: 0.3,
  },
  segmentTextActive: {
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.semiBold,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    letterSpacing: 0.3,
  },

  // History Card
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyCardDay: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  historyCardDate: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
  },
  historyCardSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: "#8E8E93",
    marginTop: 1,
  },
  historyCardScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  historyCardScoreText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  historyCardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#F0F0F0",
  },
  historyCardStat: {
    alignItems: "center",
    flex: 1,
  },
  historyCardStatLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 2,
  },
  historyCardStatValue: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  historyCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  historyCardStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyCardStatusText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  historyCardTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  historyCardTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyCardTagText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
  },
  historyCardMore: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },

  // Activity Card
  activityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  activitySubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: "#8E8E93",
    marginTop: 1,
  },
  activityDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  activityDetailText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: "#666",
  },
  activityStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.semiBold,
  },

  bottomSpacing: {
    height: 20,
  },
});