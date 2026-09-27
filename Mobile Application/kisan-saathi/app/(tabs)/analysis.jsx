// app/(tabs)/analysis.jsx
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { typography } from "../../src/theme";

// ── API Configuration ────────────────────────────────────────────────
const YOUR_COMPUTER_IP = '192.168.0.225';

const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return `http://${YOUR_COMPUTER_IP}:8000`;
  }
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiUrl();
console.log('🔗 API Base URL:', API_BASE_URL);

// ── Cloudinary Configuration ──────────────────────────────────────────
const CLOUDINARY_CONFIG = {
  cloudName: 'djtmbtl2f',
  uploadPreset: 'AgroBot',
  uploadUrl: 'https://api.cloudinary.com/v1_1/djtmbtl2f/image/upload',
};

// ── Sample Data for Fetch Button ─────────────────────────────────────
const SAMPLE_DATA = {
  disease_detection: {
    image_url: 'https://res.cloudinary.com/djtmbtl2f/image/upload/v1784455052/AgroBot/urksdvt3fohxq373e00g.jpg',
    filename: 'sample_scan'
  },
  crop_recommendation: {
    N: 50,
    P: 40,
    K: 35,
    temperature: 28.5,
    humidity: 65,
    ph: 6.8,
    rainfall: 120.5
  },
  crop_yield: {
    Crop: "Rice",
    Season: "Kharif",
    State: "Maharashtra",
    Crop_Year: 2026,
    Area: 2.5,
    Production: 5.0,
    Annual_Rainfall: 800,
    Fertilizer: 120,
    Pesticide: 40
  },
  irrigation: {
    Soil_Type: "Loamy",
    Crop_Type: "Wheat",
    Crop_Growth_Stage: "Flowering",
    Season: "Rabi",
    Irrigation_Type: "Drip",
    Water_Source: "Groundwater",
    Mulching_Used: "No",
    Region: "North",
    Soil_pH: 6.5,
    Soil_Moisture: 45,
    Organic_Carbon: 1.2,
    Electrical_Conductivity: 0.8,
    Temperature_C: 28,
    Humidity: 60,
    Rainfall_mm: 2.5,
    Sunlight_Hours: 8,
    Wind_Speed_kmh: 12,
    Field_Area_hectare: 2.5,
    Previous_Irrigation_mm: 10
  },
  fertilizer: {
    Soil_pH: 6.5,
    Soil_Moisture: 45,
    Organic_Carbon: 1.2,
    Electrical_Conductivity: 0.8,
    Nitrogen_Level: 25,
    Phosphorus_Level: 15,
    Potassium_Level: 40,
    Temperature: 28,
    Humidity: 60,
    Rainfall: 2.5,
    Crop_Growth_Stage: "Flowering",
    Fertilizer_Used_Last_Season: 50,
    Yield_Last_Season: 4.5,
    Soil_Type: "Loamy",
    Crop_Type: "Wheat",
    Season: "Rabi",
    Irrigation_Type: "Drip",
    Previous_Crop: "Rice",
    Region: "North"
  },
  soil_analysis: {
    Soil_pH: 6.5,
    Soil_Moisture: 45,
    Organic_Carbon: 1.2,
    Nitrogen: 25,
    Phosphorus: 15,
    Potassium: 40,
    Temperature: 28,
    Humidity: 60
  }
};

// ── Animation helper ───────────────────────────────────────────────────
function useResultAnim() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const reset = () => {
    fade.setValue(0);
    scale.setValue(0.95);
  };

  const play = () => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { fade, scale, reset, play };
}

// ── Main Component ─────────────────────────────────────────────────────
export default function AnalysisPage() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const scanAnim = useResultAnim();

  // ── State ────────────────────────────────────────────────────────────
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  // ── Model Selection ──────────────────────────────────────────────────
  const [selectedModel, setSelectedModel] = useState('disease_detection');
  const [modelInputs, setModelInputs] = useState({});
  const [modelResult, setModelResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // ── Crop Scan ────────────────────────────────────────────────────────
  const [scanImage, setScanImage] = useState(null);

  // ── Model Configurations ─────────────────────────────────────────────
  const models = [
    { id: 'disease_detection', label: 'Disease Detection', icon: 'bug-outline' },
    { id: 'crop_recommendation', label: 'Crop Recommendation', icon: 'leaf-outline' },
    { id: 'crop_yield', label: 'Crop Yield Prediction', icon: 'stats-chart-outline' },
    { id: 'irrigation', label: 'Irrigation Need', icon: 'water-outline' },
    { id: 'fertilizer', label: 'Fertilizer Recommendation', icon: 'flask-outline' },
    { id: 'soil_analysis', label: 'Soil Analysis', icon: 'pulse-outline' },
  ];

  // ── Endpoint mapping ─────────────────────────────────────────────────
  const getEndpoint = (modelId) => {
    const endpoints = {
      disease_detection: '/predict/disease-detection',
      crop_recommendation: '/predict/crop-recommendation',
      crop_yield: '/predict/crop-yield',
      irrigation: '/predict/irrigation',
      fertilizer: '/predict/fertilizer',
      soil_analysis: '/predict/soil-analysis',
    };
    return endpoints[modelId] || `/predict/${modelId}`;
  };

  // ── Input Fields for each model ──────────────────────────────────────
  const getInputFields = (modelId) => {
    const fields = {
      disease_detection: [
        { key: 'image_url', label: 'Image URL', type: 'text', placeholder: 'Enter image URL or upload' },
      ],
      crop_recommendation: [
        { key: 'N', label: 'Nitrogen (N)', type: 'number', placeholder: '0-100' },
        { key: 'P', label: 'Phosphorus (P)', type: 'number', placeholder: '0-100' },
        { key: 'K', label: 'Potassium (K)', type: 'number', placeholder: '0-100' },
        { key: 'temperature', label: 'Temperature (°C)', type: 'number', placeholder: '20-40' },
        { key: 'humidity', label: 'Humidity (%)', type: 'number', placeholder: '0-100' },
        { key: 'ph', label: 'pH Level', type: 'number', placeholder: '0-14' },
        { key: 'rainfall', label: 'Rainfall (mm)', type: 'number', placeholder: '0-500' },
      ],
      crop_yield: [
        { key: 'Crop', label: 'Crop', type: 'text', placeholder: 'Rice, Wheat, Cotton' },
        { key: 'Season', label: 'Season', type: 'text', placeholder: 'Kharif, Rabi, Zaid' },
        { key: 'State', label: 'State', type: 'text', placeholder: 'Maharashtra, Punjab, etc.' },
        { key: 'Crop_Year', label: 'Crop Year', type: 'number', placeholder: '2026' },
        { key: 'Area', label: 'Area (hectares)', type: 'number', placeholder: '0.5-10' },
        { key: 'Production', label: 'Production (tons)', type: 'number', placeholder: '0-50' },
        { key: 'Annual_Rainfall', label: 'Annual Rainfall (mm)', type: 'number', placeholder: '300-1500' },
        { key: 'Fertilizer', label: 'Fertilizer (kg/ha)', type: 'number', placeholder: '0-500' },
        { key: 'Pesticide', label: 'Pesticide (kg/ha)', type: 'number', placeholder: '0-100' },
      ],
      irrigation: [
        { key: 'Soil_Type', label: 'Soil Type', type: 'text', placeholder: 'Loamy, Sandy, Clay' },
        { key: 'Crop_Type', label: 'Crop Type', type: 'text', placeholder: 'Wheat, Rice, Cotton' },
        { key: 'Crop_Growth_Stage', label: 'Growth Stage', type: 'text', placeholder: 'Flowering, Vegetative' },
        { key: 'Season', label: 'Season', type: 'text', placeholder: 'Rabi, Kharif, Zaid' },
        { key: 'Irrigation_Type', label: 'Irrigation Type', type: 'text', placeholder: 'Drip, Sprinkler, Flood' },
        { key: 'Water_Source', label: 'Water Source', type: 'text', placeholder: 'Groundwater, River' },
        { key: 'Mulching_Used', label: 'Mulching Used', type: 'text', placeholder: 'Yes/No' },
        { key: 'Region', label: 'Region', type: 'text', placeholder: 'North, South, East' },
        { key: 'Soil_pH', label: 'Soil pH', type: 'number', placeholder: '0-14' },
        { key: 'Soil_Moisture', label: 'Soil Moisture (%)', type: 'number', placeholder: '0-100' },
        { key: 'Organic_Carbon', label: 'Organic Carbon (%)', type: 'number', placeholder: '0-5' },
        { key: 'Electrical_Conductivity', label: 'EC (dS/m)', type: 'number', placeholder: '0-10' },
        { key: 'Temperature_C', label: 'Temperature (°C)', type: 'number', placeholder: '15-45' },
        { key: 'Humidity', label: 'Humidity (%)', type: 'number', placeholder: '0-100' },
        { key: 'Rainfall_mm', label: 'Rainfall (mm)', type: 'number', placeholder: '0-100' },
        { key: 'Sunlight_Hours', label: 'Sunlight Hours', type: 'number', placeholder: '0-24' },
        { key: 'Wind_Speed_kmh', label: 'Wind Speed (km/h)', type: 'number', placeholder: '0-50' },
        { key: 'Field_Area_hectare', label: 'Field Area (hectares)', type: 'number', placeholder: '0.5-20' },
        { key: 'Previous_Irrigation_mm', label: 'Previous Irrigation (mm)', type: 'number', placeholder: '0-50' },
      ],
      fertilizer: [
        { key: 'Soil_pH', label: 'Soil pH', type: 'number', placeholder: '0-14' },
        { key: 'Soil_Moisture', label: 'Soil Moisture (%)', type: 'number', placeholder: '0-100' },
        { key: 'Organic_Carbon', label: 'Organic Carbon (%)', type: 'number', placeholder: '0-5' },
        { key: 'Electrical_Conductivity', label: 'EC (dS/m)', type: 'number', placeholder: '0-10' },
        { key: 'Nitrogen_Level', label: 'Nitrogen Level (kg/ha)', type: 'number', placeholder: '0-200' },
        { key: 'Phosphorus_Level', label: 'Phosphorus Level (kg/ha)', type: 'number', placeholder: '0-100' },
        { key: 'Potassium_Level', label: 'Potassium Level (kg/ha)', type: 'number', placeholder: '0-150' },
        { key: 'Temperature', label: 'Temperature (°C)', type: 'number', placeholder: '15-45' },
        { key: 'Humidity', label: 'Humidity (%)', type: 'number', placeholder: '0-100' },
        { key: 'Rainfall', label: 'Rainfall (mm)', type: 'number', placeholder: '0-100' },
        { key: 'Crop_Growth_Stage', label: 'Growth Stage', type: 'text', placeholder: 'Flowering, Vegetative' },
        { key: 'Fertilizer_Used_Last_Season', label: 'Fertilizer Used (kg/ha)', type: 'number', placeholder: '0-300' },
        { key: 'Yield_Last_Season', label: 'Yield Last Season (tons/ha)', type: 'number', placeholder: '0-15' },
        { key: 'Soil_Type', label: 'Soil Type', type: 'text', placeholder: 'Loamy, Sandy, Clay' },
        { key: 'Crop_Type', label: 'Crop Type', type: 'text', placeholder: 'Wheat, Rice, Cotton' },
        { key: 'Season', label: 'Season', type: 'text', placeholder: 'Rabi, Kharif, Zaid' },
        { key: 'Irrigation_Type', label: 'Irrigation Type', type: 'text', placeholder: 'Drip, Sprinkler, Flood' },
        { key: 'Previous_Crop', label: 'Previous Crop', type: 'text', placeholder: 'Rice, Wheat, etc.' },
        { key: 'Region', label: 'Region', type: 'text', placeholder: 'North, South, East' },
      ],
      soil_analysis: [
        { key: 'Soil_pH', label: 'Soil pH', type: 'number', placeholder: '0-14' },
        { key: 'Soil_Moisture', label: 'Soil Moisture (%)', type: 'number', placeholder: '0-100' },
        { key: 'Organic_Carbon', label: 'Organic Carbon (%)', type: 'number', placeholder: '0-5' },
        { key: 'Nitrogen', label: 'Nitrogen (kg/ha)', type: 'number', placeholder: '0-200' },
        { key: 'Phosphorus', label: 'Phosphorus (kg/ha)', type: 'number', placeholder: '0-100' },
        { key: 'Potassium', label: 'Potassium (kg/ha)', type: 'number', placeholder: '0-150' },
        { key: 'Temperature', label: 'Temperature (°C)', type: 'number', placeholder: '15-45' },
        { key: 'Humidity', label: 'Humidity (%)', type: 'number', placeholder: '0-100' },
      ],
    };
    return fields[modelId] || [];
  };

  // ── Initialize inputs when model changes ────────────────────────────
  useEffect(() => {
    const fields = getInputFields(selectedModel);
    const initialInputs = {};
    fields.forEach(field => {
      initialInputs[field.key] = '';
    });
    setModelInputs(initialInputs);
    setModelResult(null);
  }, [selectedModel]);

  // ── Check backend on mount ───────────────────────────────────────────
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setIsLoadingModel(true);
    try {
      console.log('🔍 Checking backend at:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
     
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend healthy:', data);
        setIsModelLoaded(true);
        return true;
      } else {
        throw new Error(`Backend returned: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend health check failed:', error.message);
      setIsModelLoaded(false);
      Alert.alert(
        "⚠️ Server Connection Failed",
        "Cannot connect to the analysis server.\n\n" +
        "Make sure:\n" +
        "1. Backend server is running:\n" +
        "   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\n" +
        "2. Your computer's IP is correct in the code\n" +
        "3. Both devices are on the same network\n\n" +
        `Current URL: ${API_BASE_URL}`,
        [{ text: "Retry", onPress: checkBackendHealth }]
      );
      return false;
    } finally {
      setIsLoadingModel(false);
    }
  };

  // ── Permissions ──────────────────────────────────────────────────────
  const requestPermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !lib.granted) {
      Alert.alert(
        "Permissions Required",
        "Please allow camera and photo library access.",
      );
      return false;
    }
    return true;
  };

  // ── Fetch Sample Data ───────────────────────────────────────────────
  const fetchSampleData = () => {
    const sample = SAMPLE_DATA[selectedModel];
    if (sample) {
      setModelInputs(sample);
    }
  };

  // ── Upload image to Cloudinary ──────────────────────────────────────
  const uploadToCloudinary = async (imageAsset) => {
    try {
      console.log('📤 Uploading to Cloudinary...');

      const formData = new FormData();
      const fileName = imageAsset.fileName || `crop_scan_${Date.now()}.jpg`;
      const fileType = imageAsset.mimeType || 'image/jpeg';

      if (Platform.OS === 'web') {
        const webFile = imageAsset.file || await fetch(imageAsset.uri).then((result) => result.blob());
        formData.append('file', webFile, fileName);
      } else {
        const base64 = await FileSystem.readAsStringAsync(imageAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        formData.append('file', `data:${fileType};base64,${base64}`);
      }

      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', 'AgroBot');

      const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary upload failed:', response.status, errorText);
        throw new Error(`Cloudinary upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cloudinary upload successful:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw new Error(error?.message || 'Failed to upload image. Please try again.');
    }
  };

  // ── Handle Image Selection for Disease Detection ────────────────────
  const handleTakePhoto = async () => {
    if (!isModelLoaded) {
      Alert.alert("Server Offline", "Please wait for server connection.");
      return;
    }
    if (selectedModel !== 'disease_detection') {
      Alert.alert("Info", "Image upload is only available for Disease Detection model.");
      return;
    }
    if (!(await requestPermissions())) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        const imageAsset = result.assets[0];
        setScanImage(imageAsset.uri);
        const cloudinaryUrl = await uploadToCloudinary(imageAsset);
        setModelInputs({ ...modelInputs, image_url: cloudinaryUrl });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert("Error", "Unable to access camera. Please try again.");
    }
  };

  const handlePickFromGallery = async () => {
    if (!isModelLoaded) {
      Alert.alert("Server Offline", "Please wait for server connection.");
      return;
    }
    if (selectedModel !== 'disease_detection') {
      Alert.alert("Info", "Image upload is only available for Disease Detection model.");
      return;
    }
    if (!(await requestPermissions())) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) {
        const imageAsset = result.assets[0];
        setScanImage(imageAsset.uri);
        const cloudinaryUrl = await uploadToCloudinary(imageAsset);
        setModelInputs({ ...modelInputs, image_url: cloudinaryUrl });
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert("Error", "Unable to access gallery. Please try again.");
    }
  };

  // ── Handle Input Change ─────────────────────────────────────────────
  const handleInputChange = (key, value) => {
    setModelInputs({ ...modelInputs, [key]: value });
  };

  // ── Run Analysis ─────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!isModelLoaded) {
      Alert.alert("Server Offline", "Please wait for server connection.");
      return;
    }

    // Validate inputs
    const fields = getInputFields(selectedModel);
    const missingFields = fields.filter(f => !modelInputs[f.key] || modelInputs[f.key] === '');
    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Inputs",
        `Please fill in all fields. Missing: ${missingFields.map(f => f.label).join(', ')}`
      );
      return;
    }

    setIsAnalyzing(true);
    setModelResult(null);
    setAnalysisProgress(0);

    try {
      setAnalysisProgress(30);
      const endpoint = getEndpoint(selectedModel);
      console.log(`📤 Sending to: ${API_BASE_URL}${endpoint}`);
      
      let requestBody = { ...modelInputs };
      
      if (selectedModel === 'disease_detection') {
        requestBody.filename = `scan_${Date.now()}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      setAnalysisProgress(70);

      if (!response.ok) {
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || 'Analysis failed';
        } catch (e) {
          errorMessage = await response.text() || 'Analysis failed';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAnalysisProgress(100);
      console.log('✅ Analysis complete:', data);
      setModelResult(data);
      
      scanAnim.play();

    } catch (error) {
      console.error("❌ Analysis error:", error.message);
      Alert.alert("Analysis Error", error.message || "Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Reset Analysis ──────────────────────────────────────────────────
  const resetAnalysis = () => {
    const fields = getInputFields(selectedModel);
    const initialInputs = {};
    fields.forEach(field => {
      initialInputs[field.key] = '';
    });
    setModelInputs(initialInputs);
    setModelResult(null);
    setScanImage(null);
    scanAnim.reset();
    setAnalysisProgress(0);
  };

  // ── Get severity color ──────────────────────────────────────────────
  const getSeverityColor = (severity) => {
    const colors = {
      none: "#34C759",
      low: "#FF9500",
      moderate: "#FF6B00",
      high: "#FF3B30",
      critical: "#FF2D55",
      unknown: "#8E8E93",
    };
    return colors[severity?.toLowerCase()] || "#34C759";
  };

  // ── Render Disease Detection Result ─────────────────────────────────
  const renderDiseaseResult = (result) => {
    const { disease_detected, affected_area_percentage, disease_info, image_urls, message, suggestions } = result;
    const severityColor = getSeverityColor(disease_info?.severity || 'none');

    return (
      <View style={styles.diseaseResultContainer}>
        {/* Status Header */}
        <LinearGradient
          colors={disease_detected ? [severityColor, severityColor + "CC"] : ["#34C759", "#2C5F2D"]}
          style={styles.resultHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.resultStatus}>
            {disease_detected ? '⚠️ Disease Detected' : '✅ Healthy Crop'}
          </Text>
          <Text style={styles.resultSubStatus}>
            {disease_info?.health_status || message || 'Analysis complete'}
          </Text>
          <View style={styles.resultBadgeRow}>
            <Text style={styles.resultBadgeText}>
              Severity: {disease_info?.severity || 'None'}
            </Text>
            <Text style={styles.resultBadgeText}>•</Text>
            <Text style={styles.resultBadgeText}>
              Affected: {affected_area_percentage?.toFixed(1) || 0}%
            </Text>
          </View>
          <View style={styles.healthStatusBadge}>
            <Text style={styles.healthStatusText}>
              {disease_info?.urgency || 'Monitor'}
            </Text>
          </View>
        </LinearGradient>

        {/* Images Section */}
        <View style={styles.imagesSection}>
          <Text style={styles.imagesSectionTitle}>📸 Analysis Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {/* Original Image */}
            {image_urls?.original && (
              <View style={styles.imageCard}>
                <Text style={styles.imageCardLabel}>Original</Text>
                <Image
                  source={{ uri: typeof image_urls.original === 'string' ? image_urls.original : image_urls.original.url }}
                  style={styles.imageCardImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Mask Image */}
            {image_urls?.mask && disease_detected && (
              <View style={styles.imageCard}>
                <Text style={styles.imageCardLabel}>Mask</Text>
                <Image
                  source={{ uri: typeof image_urls.mask === 'string' ? image_urls.mask : image_urls.mask.url }}
                  style={styles.imageCardImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Overlay Image */}
            {image_urls?.overlay && disease_detected && (
              <View style={styles.imageCard}>
                <Text style={styles.imageCardLabel}>Overlay</Text>
                <Image
                  source={{ uri: typeof image_urls.overlay === 'string' ? image_urls.overlay : image_urls.overlay.url }}
                  style={styles.imageCardImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Disease Info Section */}
        {disease_detected && disease_info && (
          <View style={styles.diseaseInfoSection}>
            <View style={styles.diseaseInfoHeader}>
              <Text style={styles.diseaseInfoName}>{disease_info.name}</Text>
              <Text style={styles.diseaseInfoType}>{disease_info.type}</Text>
            </View>
            <Text style={styles.diseaseInfoScientific}>Scientific: {disease_info.scientific_name}</Text>

            {/* Symptoms */}
            {disease_info.symptoms?.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoBlockTitle}>🔴 Symptoms</Text>
                {disease_info.symptoms.map((s, i) => (
                  <View key={`symptom-${i}`} style={styles.bulletRow}>
                    <View style={[styles.dot, { backgroundColor: severityColor }]} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Treatment */}
            {disease_info.treatment?.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoBlockTitle}>💊 Treatment</Text>
                {disease_info.treatment.map((t, i) => (
                  <View key={`treatment-${i}`} style={styles.bulletRow}>
                    <View style={[styles.dot, { backgroundColor: '#FF9500' }]} />
                    <Text style={styles.bulletText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Prevention */}
            {disease_info.prevention?.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoBlockTitle}>🛡️ Prevention</Text>
                {disease_info.prevention.map((p, i) => (
                  <View key={`prevention-${i}`} style={styles.bulletRow}>
                    <View style={[styles.dot, { backgroundColor: '#4A90D9' }]} />
                    <Text style={styles.bulletText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendation */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>📋 Recommendation</Text>
              <Text style={styles.recommendationText}>{disease_info.recommendation}</Text>
            </View>
          </View>
        )}

        {/* Healthy Crop Suggestions */}
        {!disease_detected && suggestions && (
          <View style={styles.diseaseInfoSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>🌱 Suggestions</Text>
              {suggestions.map((s, i) => (
                <View key={`suggestion-${i}`} style={styles.bulletRow}>
                  <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  // ── Render Result ────────────────────────────────────────────────────
  const renderResult = () => {
    if (!modelResult) return null;

    // For disease detection, use the specialized renderer
    if (selectedModel === 'disease_detection') {
      return (
        <Animated.View
          style={[
            styles.resultBlock,
            {
              opacity: scanAnim.fade,
              transform: [{ scale: scanAnim.scale }],
            },
          ]}
        >
          {renderDiseaseResult(modelResult)}
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetAnalysis}>
            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
            <Text style={styles.scanAgainButtonText}>New Analysis</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    // For other models, use the generic renderer
    const isSuccess = modelResult.success !== false;

    return (
      <Animated.View
        style={[
          styles.resultBlock,
          {
            opacity: scanAnim.fade,
            transform: [{ scale: scanAnim.scale }],
          },
        ]}
      >
        <LinearGradient
          colors={isSuccess ? ["#2C5F2D", "#4A7A4B"] : ["#FF6B6B", "#EE5A5A"]}
          style={styles.resultHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.resultStatus}>
            {isSuccess ? '✅ Analysis Complete' : '❌ Analysis Failed'}
          </Text>
          <Text style={styles.resultSubStatus}>
            {selectedModel.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </LinearGradient>

        <ScrollView style={styles.resultContent} nestedScrollEnabled={true}>
          {Object.entries(modelResult).map(([key, value]) => {
            if (key === 'success') return null;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return (
                <View key={key} style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <View key={subKey} style={styles.resultRow}>
                      <Text style={styles.resultLabel}>{subKey.replace(/_/g, ' ')}:</Text>
                      <Text style={styles.resultValue}>{String(subValue)}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            if (Array.isArray(value)) {
              return (
                <View key={key} style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                  {value.map((item, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <View style={[styles.dot, { backgroundColor: '#2C5F2D' }]} />
                      <Text style={styles.bulletText}>
                        {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            }
            return (
              <View key={key} style={styles.resultRow}>
                <Text style={styles.resultLabel}>{key.replace(/_/g, ' ')}:</Text>
                <Text style={styles.resultValue}>{String(value)}</Text>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.scanAgainButton} onPress={resetAnalysis}>
          <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
          <Text style={styles.scanAgainButtonText}>New Analysis</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌿 Analysis</Text>
          <View style={styles.headerRight}>
            <View style={[styles.modelBadge, isModelLoaded ? styles.modelLoaded : styles.modelLoading]}>
              <Text style={styles.modelText}>
                {isLoadingModel ? '⏳ Connecting...' : isModelLoaded ? '✅ API Ready' : '❌ Offline'}
              </Text>
            </View>
          </View>
        </View>

        {/* Model Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Model</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelScroll}>
            {models.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelChip,
                  selectedModel === model.id && styles.modelChipActive,
                ]}
                onPress={() => setSelectedModel(model.id)}
              >
                <Ionicons 
                  name={model.icon} 
                  size={18} 
                  color={selectedModel === model.id ? "#FFFFFF" : "#2C5F2D"} 
                />
                <Text style={[
                  styles.modelChipText,
                  selectedModel === model.id && styles.modelChipTextActive,
                ]}>
                  {model.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Fields */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Input Parameters</Text>
            <TouchableOpacity 
              style={styles.fetchButton}
              onPress={fetchSampleData}
            >
              <Ionicons name="download-outline" size={16} color="#2C5F2D" />
              <Text style={styles.fetchButtonText}>Fetch Sample</Text>
            </TouchableOpacity>
          </View>

          {selectedModel === 'disease_detection' && (
            <View style={styles.imageUploadSection}>
              <View style={styles.scanFrame}>
                {scanImage ? (
                  <Image source={{ uri: scanImage }} style={styles.scanImage} />
                ) : (
                  <View style={styles.centerContent}>
                    <Ionicons name="image-outline" size={40} color="#C0C0C0" />
                    <Text style={styles.placeholderText}>Upload or take a photo</Text>
                  </View>
                )}
              </View>
              <View style={styles.scanActionRow}>
                <TouchableOpacity
                  style={[styles.scanGhostButton, (!isModelLoaded || isAnalyzing) && styles.disabledButton]}
                  onPress={handleTakePhoto}
                  disabled={!isModelLoaded || isAnalyzing}
                >
                  <Ionicons name="camera-outline" size={18} color={isModelLoaded ? "#2C5F2D" : "#999"} />
                  <Text style={[styles.scanGhostButtonText, !isModelLoaded && styles.disabledText]}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.scanGhostButton, (!isModelLoaded || isAnalyzing) && styles.disabledButton]}
                  onPress={handlePickFromGallery}
                  disabled={!isModelLoaded || isAnalyzing}
                >
                  <Ionicons name="images-outline" size={18} color={isModelLoaded ? "#2C5F2D" : "#999"} />
                  <Text style={[styles.scanGhostButtonText, !isModelLoaded && styles.disabledText]}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.inputGrid}>
            {getInputFields(selectedModel).map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#B0B0B0"
                  value={modelInputs[field.key]?.toString() || ''}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  editable={!isAnalyzing}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.analyzeButton, (isAnalyzing || !isModelLoaded) && styles.disabledButton]}
            onPress={runAnalysis}
            disabled={isAnalyzing || !isModelLoaded}
          >
            <LinearGradient
              colors={["#2C5F2D", "#4A7A4B"]}
              style={styles.analyzeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analyzing... {analysisProgress}%</Text>
                </>
              ) : (
                <>
                  <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Run Analysis</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isAnalyzing && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${analysisProgress}%` }]} />
            </View>
          )}
        </View>

        {/* Result */}
        {renderResult()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  scrollContentLarge: { maxWidth: 800, alignSelf: "center", width: "100%" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  modelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modelLoaded: {
    backgroundColor: "#E8F5E9",
  },
  modelLoading: {
    backgroundColor: "#FFF3E0",
  },
  modelText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.2,
    marginBottom: 12,
  },

  modelScroll: {
    flexDirection: "row",
    marginBottom: 4,
  },
  modelChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
    gap: 6,
  },
  modelChipActive: {
    backgroundColor: "#2C5F2D",
  },
  modelChipText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
  },
  modelChipTextActive: {
    color: "#FFFFFF",
  },

  imageUploadSection: {
    marginBottom: 12,
  },
  scanFrame: {
    height: 140,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  scanImage: { width: "100%", height: "100%", resizeMode: "cover" },
  centerContent: { alignItems: "center" },
  placeholderText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#B0B0B0",
    marginTop: 6,
  },

  scanActionRow: { flexDirection: "row", gap: 10 },
  scanGhostButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
    gap: 6,
  },
  scanGhostButtonText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },

  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  inputGroup: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    color: "#1A1A1A",
  },

  fetchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
  },
  fetchButtonText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },

  analyzeButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  analyzeButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2C5F2D",
    borderRadius: 2,
  },

  resultBlock: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 16,
  },
  resultHeader: { padding: 16, alignItems: "center" },
  resultStatus: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  resultSubStatus: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: "#FFFFFF",
    marginTop: 2,
    opacity: 0.9,
  },
  resultBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: "center",
  },
  resultBadgeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#FFFFFF",
  },
  healthStatusBadge: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthStatusText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  resultContent: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    maxHeight: 350,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#666",
    flex: 1,
  },
  resultValue: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    flex: 1,
    textAlign: "right",
  },
  resultSection: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  resultSectionTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 4,
  },

  // Disease Detection Specific Styles
  diseaseResultContainer: {
    backgroundColor: "#FFFFFF",
  },
  imagesSection: {
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  imagesSectionTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 10,
  },
  imagesScroll: {
    flexDirection: "row",
  },
  imageCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  imageCardLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 4,
    backgroundColor: "#F0F0F0",
  },
  imageCardImage: {
    width: 150,
    height: 120,
  },

  diseaseInfoSection: {
    padding: 14,
  },
  diseaseInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  diseaseInfoName: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
  },
  diseaseInfoType: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  diseaseInfoScientific: {
    fontSize: 12,
    fontFamily: typography.fontFamily.italic,
    color: "#8E8E93",
    marginBottom: 10,
  },

  infoBlock: {
    marginTop: 10,
  },
  infoBlockTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    lineHeight: 20,
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
    lineHeight: 20,
    backgroundColor: "#F8FAF8",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  scanAgainButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C5F2D",
    paddingVertical: 12,
    gap: 8,
  },
  scanAgainButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },

  bottomSpacing: { height: 20 },
});