import { Ionicons } from "@expo/vector-icons";
import L from "leaflet";
import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "leaflet/dist/leaflet.css";
import { typography } from "../../src/theme";

const createBotIcon = () =>
  L.divIcon({
    className: "agrobot-leaflet-marker",
    html: '<span class="agrobot-leaflet-marker__dot"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const RecenterMap = ({ latitude, longitude }) => {
  const map = useMap();

  map.setView([latitude, longitude], 14, { animate: false });
  return null;
};

const AgrobotLocationCard = ({
  title = "Agro-Bot Location",
  latitude = 19.076,
  longitude = 72.8777,
  botName = "AgroBot 1",
  status = "Active",
  onFabPress = () => {},
}) => {
  const position = [latitude, longitude];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <View style={styles.container}>
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

      <View style={styles.mapContainer}>
        {isMounted ? (
          <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom
            style={styles.map}
            zoomControl
          >
            <RecenterMap latitude={latitude} longitude={longitude} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={position}
              radius={34}
              pathOptions={{ color: "#2C5F2D", opacity: 0.25, fillOpacity: 0.08 }}
            />
            <Marker position={position} icon={createBotIcon()}>
              <Popup>
                <strong>{botName}</strong>
                <br />
                {status}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Loading Mumbai map...</Text>
          </View>
        )}

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
    width: "100%",
    height: "100%",
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F1E5",
  },
  mapPlaceholderText: {
    color: "#2C5F2D",
    fontFamily: typography.fontFamily.medium,
  },
  fab: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2C5F2D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
