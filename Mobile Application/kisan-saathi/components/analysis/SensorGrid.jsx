import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { typography } from "../../src/theme";

const SensorGrid = ({ data = [], modalContent }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const scaleAnim = new Animated.Value(1);

  // Calculate card width for 3 columns
  const padding = 16;
  const gap = 10;
  const availableWidth = width - padding * 2;
  const cardWidth = (availableWidth - gap * 2) / 3;

  const openModal = (item) => {
    setSelectedItem(item);
    setVisible(true);

    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setVisible(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getIconForSensor = (title) => {
    const iconMap = {
      "Crop Status": "leaf-outline",
      "Soil Moisture": "water-outline",
      "Water Tank": "cube-outline",
      "pH Level": "flask-outline",
      "EC/TDS": "speedometer-outline",
      Battery: "battery-charging-outline",
      "Water Flow": "swap-horizontal-outline",
      "CO2 Sensor": "skull-outline",
      Temperature: "thermometer-outline",
      Humidity: "water-outline",
      Extra: "add-circle-outline",
    };
    return iconMap[title] || "analytics-outline";
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          width: cardWidth,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openModal(item)}
        style={styles.cardTouchable}
      >
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIconForSensor(item.title)}
              size={22}
              color="#555"
            />
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Value */}
          <Text style={styles.value}>{item.value}</Text>

          {/* View Button */}
          <View style={styles.button}>
            <Text style={styles.buttonText}>View</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Minimal Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modal,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalContent}>
              {/* Close button */}
              <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>

              {/* Value */}
              <Text style={styles.modalValue}>{selectedItem?.value}</Text>

              {/* Description */}
              <Text style={styles.modalDescription}>Current reading</Text>

              {/* Done Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardWrapper: {
    // width is set dynamically
  },
  cardTouchable: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minHeight: 150,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
  value: {
    fontSize: 26,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginVertical: 4,
  },
  button: {
    width: "100%",
    height: 28,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 11,
    color: "#666",
    fontFamily: typography.fontFamily.medium,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
  },
  modalContent: {
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    marginTop: 8,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: "#1A1A1A",
    marginVertical: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#999",
    fontFamily: typography.fontFamily.regular,
    marginBottom: 24,
  },
  closeButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
  },
});

export default SensorGrid;
