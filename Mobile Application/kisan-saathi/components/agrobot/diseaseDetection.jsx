import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { typography } from "../../src/theme";

const CropScan = () => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Sample image URL for demo
  const SAMPLE_IMAGE =
    "https://i.pinimg.com/736x/6f/d6/d5/6fd6d58b80852045775935acccb646c3.jpg";

  // Disease detection data (mock)
  const diseaseData = {
    name: "Early Blight",
    scientificName: "Alternaria solani",
    type: "Fungal Disease",
    severity: "Moderate",
    description:
      "Early blight is a common fungal disease that affects tomato and potato plants. It appears as dark, concentric rings on leaves, starting from the lower leaves and moving upward.",
    symptoms: [
      "Dark brown to black spots with concentric rings",
      "Yellowing of leaves around the spots",
      "Leaves becoming dry and brittle",
      "Lesions on stems and fruits",
      "Defoliation in severe cases",
    ],
    causes: [
      "Warm, wet weather conditions",
      "Poor air circulation",
      "Overhead watering",
      "Infected plant debris",
      "High humidity",
    ],
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicide (Chlorothalonil or Copper-based)",
      "Improve air circulation",
      "Water at base of plants (avoid wetting leaves)",
      "Mulch around plants to prevent soil splashing",
    ],
    prevention: [
      "Plant resistant varieties",
      "Rotate crops annually",
      "Space plants properly",
      "Water early in the day",
      "Use drip irrigation",
    ],
    pesticides: [
      {
        name: "Chlorothalonil",
        type: "Broad-spectrum fungicide",
        application: "Apply every 7-10 days",
        dosage: "1.5-2.0 ml per liter of water",
      },
      {
        name: "Copper-based Fungicide",
        type: "Organic fungicide",
        application: "Apply every 10-14 days",
        dosage: "2.0-3.0 ml per liter of water",
      },
      {
        name: "Mancozeb",
        type: "Protective fungicide",
        application: "Apply at first sign of disease",
        dosage: "2.0-2.5 gm per liter of water",
      },
    ],
    summary:
      "Early Blight is a fungal disease caused by Alternaria solani. It affects tomatoes, potatoes, and other solanaceous crops. The disease spreads through infected plant debris, wind, and water splashes. Early detection and treatment are crucial for preventing crop loss. Apply fungicides at first sign of disease and practice good cultural practices.",
  };

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPermission.granted || !libraryPermission.granted) {
        Alert.alert(
          "Permissions Required",
          "Please allow access to camera and photo library to use this feature.",
          [{ text: "OK" }],
        );
        return false;
      }
    }
    return true;
  };

  // Take Photo
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert("Error", "Unable to access camera. Please try again.");
    }
  };

  // Pick from Gallery
  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Gallery error:", error);
      Alert.alert("Error", "Unable to access gallery. Please try again.");
    }
  };

  // Load sample image for demo
  const loadSampleImage = () => {
    setSelectedImage(SAMPLE_IMAGE);
    analyzeImage(SAMPLE_IMAGE);
  };

  // Analyze Image (Mock API call)
  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API call delay
    setTimeout(() => {
      setAnalysisResult(diseaseData);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Reset to initial state
  const resetScan = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {!selectedImage ? (
            // Upload/Photo Options
            <View style={styles.uploadContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="leaf-outline" size={48} color="#2C5F2D" />
              </View>
              <Text style={styles.uploadTitle}>Crop Scan</Text>
              <Text style={styles.uploadSubtitle}>
                Take a photo or upload an image of your crop for disease
                detection
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={takePhoto}
                >
                  <LinearGradient
                    colors={["#2C5F2D", "#4A7A4B"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Take Photo</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickFromGallery}
                >
                  <Ionicons name="images-outline" size={22} color="#2C5F2D" />
                  <Text style={styles.galleryButtonText}>From Gallery</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.sampleButton}
                onPress={loadSampleImage}
              >
                <Text style={styles.sampleButtonText}>
                  Or try with sample image
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Image Display
            <View style={styles.imageDisplay}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Analyzing Indicator */}
        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#2C5F2D" />
            <Text style={styles.analyzingText}>Analyzing crop image...</Text>
            <Text style={styles.analyzingSubtext}>
              Detecting diseases and pests
            </Text>
          </View>
        )}

        {/* Analysis Result */}
        {analysisResult && !isAnalyzing && (
          <View style={styles.resultContainer}>
            {/* Disease Name */}
            <LinearGradient
              colors={["#2C5F2D", "#4A7A4B"]}
              style={styles.resultHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.resultDiseaseName}>
                {analysisResult.name}
              </Text>
              <Text style={styles.resultScientificName}>
                {analysisResult.scientificName}
              </Text>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>
                  {analysisResult.type}
                </Text>
                <Text style={styles.resultBadgeText}>•</Text>
                <Text style={styles.resultBadgeText}>
                  Severity: {analysisResult.severity}
                </Text>
              </View>
            </LinearGradient>

            {/* Description */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Description</Text>
              <Text style={styles.resultDescription}>
                {analysisResult.description}
              </Text>
            </View>

            {/* Symptoms */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Symptoms</Text>
              {analysisResult.symptoms.map((symptom, index) => (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultDot} />
                  <Text style={styles.resultItemText}>{symptom}</Text>
                </View>
              ))}
            </View>

            {/* Causes */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Causes</Text>
              {analysisResult.causes.map((cause, index) => (
                <View key={index} style={styles.resultItem}>
                  <View
                    style={[styles.resultDot, { backgroundColor: "#FF9500" }]}
                  />
                  <Text style={styles.resultItemText}>{cause}</Text>
                </View>
              ))}
            </View>

            {/* Treatment */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Treatment</Text>
              {analysisResult.treatment.map((step, index) => (
                <View key={index} style={styles.resultItem}>
                  <View
                    style={[styles.resultDot, { backgroundColor: "#34C759" }]}
                  />
                  <Text style={styles.resultItemText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Prevention */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Prevention</Text>
              {analysisResult.prevention.map((step, index) => (
                <View key={index} style={styles.resultItem}>
                  <View
                    style={[styles.resultDot, { backgroundColor: "#007AFF" }]}
                  />
                  <Text style={styles.resultItemText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Pesticides Required */}
            <View style={styles.pesticideSection}>
              <Text style={styles.pesticideTitle}>Recommended Pesticides</Text>
              {analysisResult.pesticides.map((pesticide, index) => (
                <View key={index} style={styles.pesticideCard}>
                  <View style={styles.pesticideHeader}>
                    <Ionicons
                      name="chemical-outline"
                      size={20}
                      color="#2C5F2D"
                    />
                    <Text style={styles.pesticideName}>{pesticide.name}</Text>
                  </View>
                  <Text style={styles.pesticideDetail}>
                    • Type: {pesticide.type}
                  </Text>
                  <Text style={styles.pesticideDetail}>
                    • Application: {pesticide.application}
                  </Text>
                  <Text style={styles.pesticideDetail}>
                    • Dosage: {pesticide.dosage}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <LinearGradient
              colors={["#F8FAF8", "#E8F5E9"]}
              style={styles.summaryContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.summaryHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#2C5F2D"
                />
                <Text style={styles.summaryTitle}>Summary</Text>
              </View>
              <Text style={styles.summaryText}>{analysisResult.summary}</Text>
            </LinearGradient>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={resetScan}>
                <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Scan New Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={20} color="#2C5F2D" />
                <Text style={styles.shareButtonText}>Share Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignSelf: "center",
    minHeight: 400,
  },

  // Upload Section
  imageSection: {
    width: "100%",
  },
  uploadContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  galleryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  galleryButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
  sampleButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  sampleButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#007AFF",
    textDecorationLine: "underline",
  },

  // Image Display
  imageDisplay: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  resetButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 4,
  },

  // Analyzing
  analyzingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginTop: 12,
  },
  analyzingSubtext: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    marginTop: 4,
  },

  // Results
  resultContainer: {
    marginTop: 16,
  },
  resultHeader: {
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  resultDiseaseName: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  resultScientificName: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontStyle: "italic",
  },
  resultBadge: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  resultBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#FFFFFF",
  },
  resultSection: {
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  resultDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2C5F2D",
    marginTop: 6,
    marginRight: 10,
    flexShrink: 0,
  },
  resultItemText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    lineHeight: 20,
    flex: 1,
  },
  resultDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    lineHeight: 22,
  },

  // Pesticides
  pesticideSection: {
    marginBottom: 16,
  },
  pesticideTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  pesticideCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  pesticideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  pesticideName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  pesticideDetail: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: "#666",
    marginBottom: 2,
  },

  // Summary
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },
  summaryText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    lineHeight: 22,
  },

  // Action Buttons
  actionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C5F2D",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  shareButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },
});

export default CropScan;
