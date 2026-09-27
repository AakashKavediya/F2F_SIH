import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

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

const toSafeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

const createMapHtml = (plots, botLocation) => {
  const plotPoints = plots.map((plot) => ({
    title: plot.title || "Plot",
    latitude: plot.latitude || 19.076,
    longitude: plot.longitude || 72.8777,
  }));

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; }
      body { overflow: hidden; font-family: sans-serif; }
      .legend { background: rgba(255,255,255,.94); padding: 8px 10px; border-radius: 8px; box-shadow: 0 1px 5px rgba(0,0,0,.25); font-size: 11px; line-height: 18px; }
      .swatch { display: inline-block; width: 12px; height: 12px; margin-right: 5px; vertical-align: -2px; border-radius: 3px; }
      .farm { background: #58a55c; }
      .masked { background: #4b5563; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const farmArea = ${toSafeJson(FARM_AREA)};
      const maskedArea = ${toSafeJson(MASKED_AREA)};
      const plots = ${toSafeJson(plotPoints)};
      const bot = ${toSafeJson(botLocation)};
      const map = L.map('map', { zoomControl: true }).setView([19.076, 72.8777], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.polygon(farmArea, {
        color: '#2C5F2D',
        weight: 2,
        fillColor: '#58a55c',
        fillOpacity: 0.38
      }).addTo(map).bindPopup('Mumbai Organic Farm');

      L.polygon(maskedArea, {
        color: '#374151',
        weight: 2,
        dashArray: '6 5',
        fillColor: '#111827',
        fillOpacity: 0.52
      }).addTo(map).bindTooltip('Masked monitoring area');

      plots.forEach((plot) => {
        L.circleMarker([plot.latitude, plot.longitude], {
          radius: 7,
          color: '#FFFFFF',
          weight: 2,
          fillColor: '#2C5F2D',
          fillOpacity: 1
        }).addTo(map).bindTooltip(plot.title);
      });

      L.circleMarker([bot.latitude, bot.longitude], {
        radius: 10,
        color: '#FFFFFF',
        weight: 3,
        fillColor: '#16A34A',
        fillOpacity: 1
      }).addTo(map).bindPopup('<strong>AgroBot 1</strong><br />Active');

      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<div><span class="swatch farm"></span>Farm area</div><div><span class="swatch masked"></span>Masked area</div>';
        return div;
      };
      legend.addTo(map);
    </script>
  </body>
</html>`;
};

const LeafletFarmMap = ({ plots = [], botLocation = { latitude: 19.076, longitude: 72.8777 } }) => {
  const mapHtml = useMemo(
    () => createMapHtml(plots, botLocation),
    [plots, botLocation],
  );

  return <WebView source={{ html: mapHtml }} style={styles.map} originWhitelist={["*"]} javaScriptEnabled />;
};

export default LeafletFarmMap;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
