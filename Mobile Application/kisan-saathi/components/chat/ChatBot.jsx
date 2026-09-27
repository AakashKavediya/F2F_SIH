import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { typography } from "../../src/theme";

const ChatBot = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // AI Knowledge Base - Plant Disease Solutions
  const diseaseKnowledge = {
    "early blight": {
      name: "Early Blight",
      cause: "Fungal disease caused by Alternaria solani",
      symptoms:
        "Dark brown to black spots with concentric rings on leaves, yellowing around spots",
      treatment: [
        "Remove and destroy infected leaves",
        "Apply fungicide (Chlorothalonil or Copper-based)",
        "Improve air circulation around plants",
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
      pesticides:
        "Chlorothalonil (1.5-2.0 ml/L) or Copper-based fungicide (2.0-3.0 ml/L)",
      severity: "Moderate",
    },
    "powdery mildew": {
      name: "Powdery Mildew",
      cause: "Fungal disease caused by various species of fungi",
      symptoms:
        "White powdery spots on leaves, stems, and flowers, leaves may curl and distort",
      treatment: [
        "Remove infected plant parts",
        "Apply sulfur-based fungicide",
        "Use neem oil spray",
        "Improve air circulation",
        "Avoid overhead watering",
      ],
      prevention: [
        "Plant resistant varieties",
        "Space plants for good air flow",
        "Water early morning",
        "Apply preventive sprays",
        "Remove plant debris",
      ],
      pesticides: "Sulfur-based fungicide or Neem oil (2.0-3.0 ml/L)",
      severity: "Moderate",
    },
    "leaf curl": {
      name: "Leaf Curl Virus",
      cause: "Viral disease transmitted by whiteflies and aphids",
      symptoms:
        "Leaves curling upward, yellowing, stunted growth, reduced fruit production",
      treatment: [
        "Remove infected plants immediately",
        "Control vector insects (whiteflies, aphids)",
        "Use insecticidal soap",
        "Apply neem oil",
        "Maintain plant health",
      ],
      prevention: [
        "Use disease-free seeds",
        "Control insect vectors",
        "Use reflective mulches",
        "Plant resistant varieties",
        "Maintain healthy soil",
      ],
      pesticides: "Insecticidal soap or Neem oil (2.0-3.0 ml/L)",
      severity: "High",
    },
    "bacterial wilt": {
      name: "Bacterial Wilt",
      cause: "Bacterial disease caused by Ralstonia solanacearum",
      symptoms:
        "Sudden wilting of leaves, yellowing, bacterial ooze from cut stems",
      treatment: [
        "Remove and destroy infected plants",
        "Solarize soil",
        "Apply copper-based bactericides",
        "Improve drainage",
        "Rotate crops",
      ],
      prevention: [
        "Plant resistant varieties",
        "Use certified disease-free seeds",
        "Crop rotation (4-5 years)",
        "Improve soil drainage",
        "Avoid overhead irrigation",
      ],
      pesticides: "Copper-based bactericides (2.0-3.0 ml/L)",
      severity: "High",
    },
    rust: {
      name: "Rust Disease",
      cause: "Fungal disease caused by Puccinia species",
      symptoms:
        "Orange, yellow, or brown rust-colored pustules on leaves, premature leaf drop",
      treatment: [
        "Remove infected leaves",
        "Apply fungicide (Mancozeb or Sulfur)",
        "Improve air circulation",
        "Water at base of plants",
        "Avoid wet foliage",
      ],
      prevention: [
        "Plant resistant varieties",
        "Space plants properly",
        "Water early morning",
        "Apply preventive fungicides",
        "Remove plant debris",
      ],
      pesticides: "Mancozeb (2.0-2.5 gm/L) or Sulfur-based fungicide",
      severity: "Moderate",
    },
    "downy mildew": {
      name: "Downy Mildew",
      cause: "Fungal disease caused by Peronospora species",
      symptoms:
        "Yellow spots on upper leaf surface, white/purple fuzzy growth on underside",
      treatment: [
        "Remove infected leaves",
        "Apply fungicide (Copper-based or Mancozeb)",
        "Improve air circulation",
        "Reduce humidity",
        "Avoid overhead watering",
      ],
      prevention: [
        "Plant resistant varieties",
        "Space plants for air flow",
        "Water early morning",
        "Apply preventive sprays",
        "Remove plant debris",
      ],
      pesticides:
        "Copper-based fungicide (2.0-3.0 ml/L) or Mancozeb (2.0-2.5 gm/L)",
      severity: "Moderate",
    },
    "fusarium wilt": {
      name: "Fusarium Wilt",
      cause: "Fungal disease caused by Fusarium oxysporum",
      symptoms:
        "Yellowing and wilting of leaves, vascular discoloration, stunted growth",
      treatment: [
        "Remove infected plants",
        "Solarize soil",
        "Apply fungicide",
        "Improve drainage",
        "Crop rotation",
      ],
      prevention: [
        "Plant resistant varieties",
        "Use disease-free seeds",
        "Maintain proper soil pH",
        "Crop rotation",
        "Avoid overwatering",
      ],
      pesticides: "Fungicide with thiophanate-methyl",
      severity: "High",
    },
    anthracnose: {
      name: "Anthracnose",
      cause: "Fungal disease caused by Colletotrichum species",
      symptoms:
        "Dark, sunken lesions on fruits, leaves, and stems, circular spots with dark borders",
      treatment: [
        "Remove infected plant parts",
        "Apply fungicide (Chlorothalonil or Copper-based)",
        "Improve air circulation",
        "Avoid overhead watering",
        "Apply mulch",
      ],
      prevention: [
        "Plant resistant varieties",
        "Space plants properly",
        "Water early morning",
        "Remove plant debris",
        "Apply preventive fungicides",
      ],
      pesticides:
        "Chlorothalonil (1.5-2.0 ml/L) or Copper-based fungicide (2.0-3.0 ml/L)",
      severity: "Moderate",
    },
  };

  // Initial AI Message
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Add initial AI message if no messages exist
      if (messages.length === 0) {
        const initialMessage = {
          id: Date.now().toString(),
          text: "🤖 Hello! I'm AgroBot AI, your plant health assistant. I can help identify plant diseases and provide treatment solutions. Describe the symptoms or tell me the disease name, and I'll give you detailed recommendations.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    } else {
      // Reset animations when closing
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  // Find disease in knowledge base
  const findDisease = (text) => {
    const lowerText = text.toLowerCase();

    // Check for exact matches first
    for (const [key, value] of Object.entries(diseaseKnowledge)) {
      if (lowerText.includes(key)) {
        return { key, data: value };
      }
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(diseaseKnowledge)) {
      const words = key.split(" ");
      for (const word of words) {
        if (word.length > 3 && lowerText.includes(word)) {
          return { key, data: value };
        }
      }
    }

    return null;
  };

  // Generate AI Response
  const generateAIResponse = (userMessage) => {
    const found = findDisease(userMessage);

    if (found) {
      const disease = found.data;
      const name = found.key;

      return {
        text:
          `🌿 **${disease.name}**\n\n` +
          `🔬 **Cause:** ${disease.cause}\n\n` +
          `⚠️ **Symptoms:** ${disease.symptoms}\n\n` +
          `🩺 **Treatment:**\n${disease.treatment
            .map((t, i) => `   ${i + 1}. ${t}`)
            .join("\n")}\n\n` +
          `🛡️ **Prevention:**\n${disease.prevention
            .map((p, i) => `   ${i + 1}. ${p}`)
            .join("\n")}\n\n` +
          `🧪 **Recommended Pesticides:** ${disease.pesticides}\n\n` +
          `⚠️ **Severity:** ${disease.severity}\n\n` +
          `💡 **Tip:** Early detection and treatment are key to preventing spread. Monitor your plants regularly.`,
        disease: true,
        diseaseName: disease.name,
      };
    } else {
      // Check if user is asking about a plant/disease in general
      const plantKeywords = [
        "plant",
        "leaf",
        "crop",
        "vegetable",
        "fruit",
        "tomato",
        "potato",
        "wheat",
        "rice",
      ];
      const diseaseKeywords = [
        "disease",
        "infection",
        "sick",
        "illness",
        "problem",
        "issue",
      ];

      const hasPlantKeyword = plantKeywords.some((k) =>
        userMessage.toLowerCase().includes(k),
      );
      const hasDiseaseKeyword = diseaseKeywords.some((k) =>
        userMessage.toLowerCase().includes(k),
      );

      if (hasPlantKeyword || hasDiseaseKeyword) {
        return {
          text:
            "🌱 I understand you're asking about plant health. To help you better, please tell me:\n\n" +
            "• What plant/crop are you growing?\n" +
            "• What symptoms are you seeing on the leaves?\n" +
            "• When did you first notice the problem?\n" +
            "• Have you applied any treatments?\n\n" +
            "I can identify diseases like Early Blight, Powdery Mildew, Leaf Curl, Bacterial Wilt, Rust, and many more.",
          disease: false,
        };
      }

      // General response
      return {
        text:
          "🤖 I'm here to help with plant diseases. Please describe the symptoms you're seeing on your plants, or tell me the name of the disease you suspect. I can help with:\n\n" +
          "• Early Blight\n" +
          "• Powdery Mildew\n" +
          "• Leaf Curl Virus\n" +
          "• Bacterial Wilt\n" +
          "• Rust Disease\n" +
          "• Downy Mildew\n" +
          "• Fusarium Wilt\n" +
          "• Anthracnose\n\n" +
          "What would you like to know about?",
        disease: false,
      };
    }
  };

  // Send Message
  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const response = generateAIResponse(userMsg.text);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "ai",
        timestamp: new Date(),
        disease: response.disease || false,
        diseaseName: response.diseaseName || null,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800 + Math.random() * 600);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isAI = item.sender === "ai";

    return (
      <View style={[styles.messageRow, isAI ? styles.aiRow : styles.userRow]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <LinearGradient
              colors={["#2C5F2D", "#4A7A4B"]}
              style={styles.aiAvatarGradient}
            >
              <Text style={styles.aiAvatarText}>🤖</Text>
            </LinearGradient>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isAI ? styles.aiBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[styles.messageText, isAI ? styles.aiText : styles.userText]}
          >
            {item.text}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {!isAI && (
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <LinearGradient
            colors={["#2C5F2D", "#4A7A4B"]}
            style={styles.modalHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Text style={styles.headerIconText}>🤖</Text>
                </View>
                <View>
                  <Text style={styles.headerTitle}>AgroBot AI</Text>
                  <Text style={styles.headerSubtitle}>
                    Plant Health Assistant
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { animationDelay: "0.2s" }]} />
                <View style={[styles.typingDot, { animationDelay: "0.4s" }]} />
              </View>
            </View>
          )}

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your plant disease..."
                placeholderTextColor="#8E8E93"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isTyping}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={["#2C5F2D", "#4A7A4B"]}
                  style={styles.sendGradient}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "92%",
    maxWidth: 420,
    height: "85%",
    maxHeight: 700,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },

  // Header
  modalHeader: {
    padding: 16,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconText: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.8)",
  },
  closeButton: {
    padding: 4,
  },

  // Messages
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: "#F0F4F0",
    borderTopLeftRadius: 4,
    marginLeft: 8,
  },
  userBubble: {
    backgroundColor: "#2C5F2D",
    borderTopRightRadius: 4,
    marginRight: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: typography.fontFamily.regular,
  },
  aiText: {
    color: "#1A1A1A",
  },
  userText: {
    color: "#FFFFFF",
  },
  messageTime: {
    fontSize: 10,
    color: "#8E8E93",
    marginTop: 4,
    textAlign: "right",
    fontFamily: typography.fontFamily.medium,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  aiAvatarGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  aiAvatarText: {
    fontSize: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: {
    fontSize: 14,
  },

  // Typing
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#F0F4F0",
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    alignSelf: "flex-start",
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2C5F2D",
    opacity: 0.5,
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatBot;
