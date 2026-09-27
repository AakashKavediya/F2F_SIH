import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FARM_AREA = [
  [19.0748, 72.8760],
  [19.0768, 72.8760],
  [19.0785, 72.8785],
  [19.0772, 72.8808],
  [19.0748, 72.8798],
];

const MASKED_AREA = [
  [19.0768, 72.8786],
  [19.0777, 72.8786],
  [19.0777, 72.8798],
  [19.0768, 72.8798],
];

const LeafletFarmMap = ({ plots = [], botLocation = { latitude: 19.076, longitude: 72.8777 } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const plotPoints = useMemo(
    () => plots.map((plot) => ({
      title: plot.title || "Plot",
      latitude: plot.latitude || 19.076,
      longitude: plot.longitude || 72.8777,
    })),
    [plots],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <View style={styles.placeholder} />;

  return (
    <MapContainer center={[19.076, 72.8777]} zoom={15} scrollWheelZoom style={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        positions={FARM_AREA}
        pathOptions={{ color: "#2C5F2D", weight: 2, fillColor: "#58a55c", fillOpacity: 0.38 }}
      >
        <Popup>Mumbai Organic Farm</Popup>
      </Polygon>
      <Polygon
        positions={MASKED_AREA}
        pathOptions={{ color: "#374151", weight: 2, dashArray: "6 5", fillColor: "#111827", fillOpacity: 0.52 }}
      >
        <Tooltip>Masked monitoring area</Tooltip>
      </Polygon>
      {plotPoints.map((plot) => (
        <CircleMarker
          key={plot.title}
          center={[plot.latitude, plot.longitude]}
          radius={7}
          pathOptions={{ color: "#FFFFFF", weight: 2, fillColor: "#2C5F2D", fillOpacity: 1 }}
        >
          <Tooltip>{plot.title}</Tooltip>
        </CircleMarker>
      ))}
      <CircleMarker
        center={[botLocation.latitude, botLocation.longitude]}
        radius={10}
        pathOptions={{ color: "#FFFFFF", weight: 3, fillColor: "#16A34A", fillOpacity: 1 }}
      >
        <Popup><strong>AgroBot 1</strong><br />Active</Popup>
      </CircleMarker>
      <div className="leaflet-farm-legend">
        <div><span className="leaflet-farm-swatch leaflet-farm-swatch--farm" />Farm area</div>
        <div><span className="leaflet-farm-swatch leaflet-farm-swatch--mask" />Masked area</div>
      </div>
    </MapContainer>
  );
};

export default LeafletFarmMap;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8F1E5",
  },
});
