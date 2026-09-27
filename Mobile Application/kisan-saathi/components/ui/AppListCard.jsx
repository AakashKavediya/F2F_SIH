import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, Modal, ScrollView } from "react-native";
import { useState } from "react";
import { spacing, typography } from "../../src/theme";

// PM Kisan scheme data for Maharashtra
const PM_KISAN_DATA = {
  id: "pm-kisan-maharashtra",
  title: "PM Kisan Samman Nidhi",
  description: "₹6,000 annual financial support for Maharashtra farmers. 3 installments of ₹2,000 each.",
  image: "https://sarkariyojana.com/wp-content/uploads/2024/04/pm-kisan-samman-nidhi-yojana.webp",
  officialWebsite: "https://pmkisan.gov.in",
  helpline: "1800-180-1551",
  stateHelpline: "020-26123066",
  status: "Active",
  lastDate: "31 July 2025",
  benefits: [
    "Direct benefit transfer to bank account",
    "₹2,000 per installment",
    "3 installments per year",
    "e-KYC required"
  ],
  eligibility: [
    "All Maharashtra farmers with landholding",
    "Verified bank account with Aadhaar",
    "Active mobile number",
    "Should not be a government employee"
  ]
};

const AppListCard = ({
  image = PM_KISAN_DATA.image,
  title = PM_KISAN_DATA.title,
  description = PM_KISAN_DATA.description,
  buttonText = "Apply Now",
  onPress,
  showArrow = true,
  showStatus = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Handle Apply Now button press
  const handleApplyNow = async () => {
    setModalVisible(false);
    try {
      const canOpen = await Linking.canOpenURL(PM_KISAN_DATA.officialWebsite);
      if (canOpen) {
        await Linking.openURL(PM_KISAN_DATA.officialWebsite);
      } else {
        Alert.alert(
          "Apply for PM Kisan Scheme",
          `Helpline Numbers:\n\nNational Helpline: ${PM_KISAN_DATA.helpline}\nMaharashtra Helpline: ${PM_KISAN_DATA.stateHelpline}\n\nWebsite: ${PM_KISAN_DATA.officialWebsite}`,
          [
            { text: "Call Helpline", onPress: () => Linking.openURL(`tel:${PM_KISAN_DATA.helpline}`) },
            { text: "OK", style: "cancel" }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Apply for PM Kisan Scheme",
        `Call: ${PM_KISAN_DATA.helpline}`,
        [
          { text: "Call", onPress: () => Linking.openURL(`tel:${PM_KISAN_DATA.helpline}`) },
          { text: "OK", style: "cancel" }
        ]
      );
    }
  };

  // Handle card press - ALWAYS opens modal
  const handleCardPress = () => {
    console.log('Card pressed - opening modal');
    setModalVisible(true);
  };

  // Handle button press - uses custom onPress or opens modal
  const handleButtonPress = () => {
    console.log('Button pressed');
    if (typeof onPress === 'function' && onPress.toString() !== '() => {}') {
      console.log('Using custom onPress');
      onPress();
    } else {
      console.log('Opening modal from button');
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleCardPress}
        style={styles.container}
      >
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
          {showStatus && (
            <View style={[styles.statusBadge, styles.statusActive]}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              {description}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
              <Text style={styles.metaText}>Last Date: {PM_KISAN_DATA.lastDate}</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleButtonPress}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
              {showArrow && (
                <Ionicons name="arrow-forward" size={16} color="#2C5F2D" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* iOS Style Modal - FIXED SCROLLING */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal close requested');
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          {/* Only the top part is clickable to close */}
          <TouchableOpacity 
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => {
              console.log('Overlay pressed - closing modal');
              setModalVisible(false);
            }}
          />
          
          {/* Modal Content - Separate from overlay touch */}
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
                onPress={() => {
                  console.log('Close button pressed');
                  setModalVisible(false);
                }}
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
                  source={{ uri: PM_KISAN_DATA.image }} 
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalStatusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.modalStatusText}>Active</Text>
                </View>
              </View>

              {/* Scheme Title */}
              <Text style={styles.modalSchemeTitle}>{PM_KISAN_DATA.title}</Text>
              <Text style={styles.modalSchemeDescription}>{PM_KISAN_DATA.description}</Text>

              {/* Last Date */}
              <View style={styles.modalDateRow}>
                <Ionicons name="calendar-outline" size={18} color="#2C5F2D" />
                <Text style={styles.modalDateText}>Last Date: {PM_KISAN_DATA.lastDate}</Text>
              </View>

              {/* Divider */}
              <View style={styles.modalDivider} />

              {/* Benefits Section */}
              <View style={styles.modalSection}>
                <View style={styles.modalSectionHeader}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#2C5F2D" />
                  <Text style={styles.modalSectionTitle}>Benefits</Text>
                </View>
                {PM_KISAN_DATA.benefits.map((benefit, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={styles.modalBullet} />
                    <Text style={styles.modalListItemText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {/* Eligibility Section */}
              <View style={styles.modalSection}>
                <View style={styles.modalSectionHeader}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#2C5F2D" />
                  <Text style={styles.modalSectionTitle}>Eligibility</Text>
                </View>
                {PM_KISAN_DATA.eligibility.map((item, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={[styles.modalBullet, styles.modalBulletGreen]} />
                    <Text style={styles.modalListItemText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Contact Section */}
              <View style={styles.modalContactSection}>
                <Text style={styles.modalContactTitle}>Need Help?</Text>
                <View style={styles.modalContactRow}>
                  <TouchableOpacity 
                    style={styles.modalContactButton}
                    onPress={() => {
                      console.log('Call Helpline pressed');
                      setModalVisible(false);
                      Linking.openURL(`tel:${PM_KISAN_DATA.helpline}`);
                    }}
                  >
                    <Ionicons name="call-outline" size={20} color="#2C5F2D" />
                    <Text style={styles.modalContactButtonText}>Call Helpline</Text>
                  </TouchableOpacity>
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
              <Text style={styles.modalFooter}>
                For more information, visit {PM_KISAN_DATA.officialWebsite}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AppListCard;

const styles = StyleSheet.create({
  // Card Styles
  container: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    padding: 14,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  statusBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: "#E8F5E9",
  },
  statusText: {
    fontSize: 8,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: "#666666",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
    color: "#2C5F2D",
    letterSpacing: 0.3,
  },

  // iOS Modal Styles - FIXED
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
    // Prevent touch events from passing through
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
  modalDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAF8",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  modalDateText: {
    fontSize: 13,
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