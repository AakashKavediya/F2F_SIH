import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import { typography } from "../../src/theme";

const AgrobotLocationCard = ({
  title = "Agro-Bot Location",
  latitude = 19.076,
  longitude = 72.8777,
  botName = "AgroBot 1",
  status = "Active",
  onFabPress = () => {},
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.botName}>{botName}</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          mapType={Platform.OS === "android" ? "none" : "standard"}
          showsCompass={false}
          showsBuildings={false}
          showsTraffic={false}
          toolbarEnabled={false}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            zIndex={1}
          />
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerPin}>
                <View style={styles.markerDot} />
              </View>
              <View style={styles.markerPulse} />
            </View>
          </Marker>
        </MapView>

        {/* Floating Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.fab}
          onPress={onFabPress}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AgrobotLocationCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: "#1A1A1A",
    fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34C759",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: typography.fontFamily.medium,
  },
  botName: {
    fontSize: 14,
    color: "#666666",
    fontFamily: typography.fontFamily.medium,
  },
  mapContainer: {
    height: 280,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  map: {
    flex: 1,
  },
  // Custom Marker Styles
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2C5F2D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  markerPulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(44, 95, 45, 0.15)",
    top: -8,
    left: -8,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1A1A",
    position: "absolute",
    right: 14,
    bottom: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
