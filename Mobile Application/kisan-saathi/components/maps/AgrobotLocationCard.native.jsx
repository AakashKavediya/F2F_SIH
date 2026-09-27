import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { typography } from "../../src/theme";

const createMapHtml = (latitude, longitude, botName, status) => `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; }
      body { overflow: hidden; }
      .leaflet-control-attribution { font-size: 9px; }
      .bot-label { font: 600 12px sans-serif; color: #1f3e20; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const position = [${latitude}, ${longitude}];
      const map = L.map('map', { zoomControl: true }).setView(position, 14);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.circle(position, {
        radius: 250,
        color: '#2C5F2D',
        weight: 2,
        opacity: 0.25,
        fillColor: '#2C5F2D',
        fillOpacity: 0.08
      }).addTo(map);
      L.circleMarker(position, {
        radius: 11,
        color: '#FFFFFF',
        weight: 3,
        fillColor: '#2C5F2D',
        fillOpacity: 1
      }).addTo(map).bindPopup('<span class="bot-label">${botName}</span><br />${status}');
    </script>
  </body>
</html>`;

const AgrobotLocationCard = ({
  title = "Agro-Bot Location",
  latitude = 19.076,
  longitude = 72.8777,
  botName = "AgroBot 1",
  status = "Active",
  onFabPress = () => {},
}) => {
  const mapHtml = useMemo(
    () => createMapHtml(latitude, longitude, botName, status),
    [latitude, longitude, botName, status],
  );

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
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          style={styles.map}
        />
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
