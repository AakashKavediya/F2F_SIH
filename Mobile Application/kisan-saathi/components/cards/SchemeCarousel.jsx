import { useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Linking,
    Alert,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "../../src/theme";

// Scheme URLs mapping
const SCHEME_URLS = {
    "PM-KISAN Samman Nidhi": "https://pmkisan.gov.in",
    "Pradhan Mantri Fasal Bima Yojana (PMFBY)": "https://pmfby.gov.in",
    "Soil Health Card Scheme": "https://soilhealth.dac.gov.in",
};

// Scheme Helpline Numbers
const SCHEME_HELPLINES = {
    "PM-KISAN Samman Nidhi": "1800-180-1551",
    "Pradhan Mantri Fasal Bima Yojana (PMFBY)": "1800-11-3388",
    "Soil Health Card Scheme": "1800-180-1551",
};

// Scheme Details
const SCHEME_DETAILS = {
    "PM-KISAN Samman Nidhi": {
        benefits: [
            "₹6,000 annual financial support",
            "3 installments of ₹2,000 each",
            "Direct benefit transfer to bank account",
            "e-KYC required"
        ],
        eligibility: [
            "All farmers with landholding",
            "Verified bank account with Aadhaar",
            "Active mobile number",
            "Should not be a government employee"
        ]
    },
    "Pradhan Mantri Fasal Bima Yojana (PMFBY)": {
        benefits: [
            "Crop insurance against natural disasters",
            "Protection from pests and diseases",
            "Premium subsidized by government",
            "Quick claim settlement"
        ],
        eligibility: [
            "All farmers growing notified crops",
            "Must have a bank account",
            "Valid land records",
            "Should not have defaulted on loans"
        ]
    },
    "Soil Health Card Scheme": {
        benefits: [
            "Free soil nutrient analysis",
            "Personalized fertilizer recommendations",
            "Improved crop productivity",
            "Reduced fertilizer costs"
        ],
        eligibility: [
            "All Indian farmers",
            "Must have agricultural land",
            "Valid Aadhaar card",
            "Active mobile number"
        ]
    }
};

// iOS Style Modal Component
const SchemeDetailModal = ({ visible, onClose, item }) => {
    if (!item) return null;

    const schemeUrl = SCHEME_URLS[item.title] || null;
    const helpline = SCHEME_HELPLINES[item.title] || null;
    const details = SCHEME_DETAILS[item.title] || { benefits: [], eligibility: [] };

    const handleApplyNow = async () => {
        onClose();
        if (schemeUrl) {
            try {
                const canOpen = await Linking.canOpenURL(schemeUrl);
                if (canOpen) {
                    await Linking.openURL(schemeUrl);
                } else {
                    Alert.alert(
                        item.title,
                        `Visit: ${schemeUrl}\nHelpline: ${helpline || 'N/A'}`,
                        [
                            { 
                                text: "Call Helpline", 
                                onPress: () => {
                                    if (helpline) Linking.openURL(`tel:${helpline}`);
                                }
                            },
                            { text: "OK", style: "cancel" }
                        ]
                    );
                }
            } catch (error) {
                Alert.alert(
                    "Unable to Open",
                    `Visit: ${schemeUrl}\nHelpline: ${helpline || 'N/A'}`,
                    [
                        { 
                            text: "Call Helpline", 
                            onPress: () => {
                                if (helpline) Linking.openURL(`tel:${helpline}`);
                            }
                        },
                        { text: "OK", style: "cancel" }
                    ]
                );
            }
        }
    };

    const handleCallHelpline = () => {
        if (helpline) {
            onClose();
            Linking.openURL(`tel:${helpline}`);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity 
                    style={styles.modalOverlayTouch}
                    activeOpacity={1}
                    onPress={onClose}
                />
                
                <View style={styles.modalContainer}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />
                    
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderLeft}>
                            <View style={styles.modalIconContainer}>
                                <Ionicons name="document-text-outline" size={22} color="#2C5F2D" />
                            </View>
                            <Text style={styles.modalTitle}>Scheme Details</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.closeButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.modalContentScroll}
                        style={styles.modalScrollView}
                        bounces={true}
                        overScrollMode="always"
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                    >
                        {/* Scheme Image */}
                        <View style={styles.modalImageWrapper}>
                            <Image 
                                source={{ uri: item.image }} 
                                style={styles.modalImage}
                                resizeMode="cover"
                            />
                            <View style={styles.modalStatusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.modalStatusText}>Government Scheme</Text>
                            </View>
                        </View>

                        {/* Scheme Title */}
                        <Text style={styles.modalSchemeTitle}>{item.title}</Text>
                        <Text style={styles.modalSchemeDescription}>{item.description}</Text>

                        {/* Website & Helpline */}
                        <View style={styles.modalInfoRow}>
                            {schemeUrl && (
                                <View style={styles.modalInfoItem}>
                                    <Ionicons name="globe-outline" size={16} color="#2C5F2D" />
                                    <Text style={styles.modalInfoText} numberOfLines={1}>
                                        {schemeUrl.replace('https://', '')}
                                    </Text>
                                </View>
                            )}
                            {helpline && (
                                <View style={styles.modalInfoItem}>
                                    <Ionicons name="call-outline" size={16} color="#2C5F2D" />
                                    <Text style={styles.modalInfoText}>{helpline}</Text>
                                </View>
                            )}
                        </View>

                        {/* Divider */}
                        <View style={styles.modalDivider} />

                        {/* Benefits Section */}
                        {details.benefits.length > 0 && (
                            <View style={styles.modalSection}>
                                <View style={styles.modalSectionHeader}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#2C5F2D" />
                                    <Text style={styles.modalSectionTitle}>Benefits</Text>
                                </View>
                                {details.benefits.map((benefit, index) => (
                                    <View key={index} style={styles.modalListItem}>
                                        <View style={styles.modalBullet} />
                                        <Text style={styles.modalListItemText}>{benefit}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Eligibility Section */}
                        {details.eligibility.length > 0 && (
                            <View style={styles.modalSection}>
                                <View style={styles.modalSectionHeader}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#2C5F2D" />
                                    <Text style={styles.modalSectionTitle}>Eligibility</Text>
                                </View>
                                {details.eligibility.map((item, index) => (
                                    <View key={index} style={styles.modalListItem}>
                                        <View style={[styles.modalBullet, styles.modalBulletGreen]} />
                                        <Text style={styles.modalListItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Contact Section */}
                        <View style={styles.modalContactSection}>
                            <Text style={styles.modalContactTitle}>Need Help?</Text>
                            <View style={styles.modalContactRow}>
                                {helpline && (
                                    <TouchableOpacity 
                                        style={styles.modalContactButton}
                                        onPress={handleCallHelpline}
                                    >
                                        <Ionicons name="call-outline" size={20} color="#2C5F2D" />
                                        <Text style={styles.modalContactButtonText}>Call Helpline</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity 
                                    style={[styles.modalContactButton, styles.modalContactButtonGreen]}
                                    onPress={handleApplyNow}
                                >
                                    <Ionicons name="open-outline" size={20} color="#FFFFFF" />
                                    <Text style={[styles.modalContactButtonText, styles.modalContactButtonTextWhite]}>Apply Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer */}
                        {schemeUrl && (
                            <Text style={styles.modalFooter}>
                                For more information, visit {schemeUrl}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const SchemeCarousel = ({ data, onApply }) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!data || data.length === 0) return null;

  const cardWidth = Math.min(360, width - 48);
  const cardHeight = isLarge ? 380 : 340;
  const imageHeight = isLarge ? 180 : 160;

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (cardWidth + 12),
    );
    setCurrentIndex(index);
  };

  // Get scheme URL by title
  const getSchemeUrl = (title) => {
    for (const [key, url] of Object.entries(SCHEME_URLS)) {
      if (title.includes(key) || key.includes(title)) {
        return url;
      }
    }
    return null;
  };

  // Handle Apply Now press - Open modal instead of direct redirect
  const handleApplyPress = (item) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Open modal with scheme details
    setSelectedScheme(item);
    setModalVisible(true);

    // Call the onApply prop if provided
    if (onApply) {
      onApply(item);
    }
  };

  // Handle card press - Open modal
  const handleCardPress = (item) => {
    setSelectedScheme(item);
    setModalVisible(true);
  };

  const renderPagination = () => {
    if (data.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled={false}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={item.id || index}
            style={[
              styles.cardWrapper,
              {
                width: cardWidth,
                marginRight: index === data.length - 1 ? 0 : 12,
              },
            ]}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.9}
          >
            <View style={[styles.card, { height: cardHeight }]}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={[styles.image, { height: imageHeight }]}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Government Scheme</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.content, { padding: isLarge ? 20 : 16 }]}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApplyPress(item)}
                    activeOpacity={0.8}
                  >
                    <Animated.View
                      style={[
                        styles.applyButtonInner,
                        { transform: [{ scale: scaleAnim }] },
                      ]}
                    >
                      <Text style={styles.applyButtonText}>View Details</Text>
                      <View style={styles.arrowContainer}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {renderPagination()}

      {/* iOS Style Modal */}
      <SchemeDetailModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedScheme(null);
        }}
        item={selectedScheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    // width is set dynamically
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "flex-start",
    padding: 12,
  },
  badgeContainer: {
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "rgba(44, 95, 45, 0.9)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 17,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: "#8A8A8A",
    lineHeight: 20,
    marginBottom: 12,
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  applyButton: {
    flex: 1,
  },
  applyButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  arrowContainer: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  paginationDotInactive: {
    backgroundColor: "#D1D5DB",
  },

  // iOS Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalOverlayTouch: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    minHeight: "50%",
    paddingBottom: 20,
    pointerEvents: "box-none",
  },
  modalScrollView: {
    maxHeight: "100%",
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#D1D1D6",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  modalContentScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  modalImageWrapper: {
    marginTop: 16,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: 160,
  },
  modalStatusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(44, 95, 45, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ECDC4",
  },
  modalStatusText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: "#FFFFFF",
  },
  modalSchemeTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    marginTop: 16,
    letterSpacing: 0.5,
  },
  modalSchemeDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: "#666666",
    lineHeight: 20,
    marginTop: 4,
  },
  modalInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAF8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalInfoText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: "#2C5F2D",
  },
  modalDivider: {
    height: 0.5,
    backgroundColor: "#E5E5EA",
    marginVertical: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
  },
  modalListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 10,
  },
  modalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D1D6",
  },
  modalBulletGreen: {
    backgroundColor: "#2C5F2D",
  },
  modalListItemText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: "#1A1A1A",
    flex: 1,
  },
  modalContactSection: {
    backgroundColor: "#F8FAF8",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  modalContactTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#1A1A1A",
    marginBottom: 12,
  },
  modalContactRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalContactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  modalContactButtonGreen: {
    backgroundColor: "#2C5F2D",
    borderColor: "#2C5F2D",
  },
  modalContactButtonText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },
  modalContactButtonTextWhite: {
    color: "#FFFFFF",
  },
  modalFooter: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 16,
  },
});

export default SchemeCarousel;