'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  RotateCcw,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export interface ZoneData {
  id: string;
  name: string;
  fieldId: string;
  crop: string;
  variety: string;
  area: number; // in acres
  health: number;
  soilMoisture: number;
  soilTemp: number;
  diseaseRisk: number;
  npk: { n: number; p: number; k: number };
  status: 'optimal' | 'warning' | 'critical';
  statusLabel: string;
  color: string;
  fillColor: string;
  coordinates: [number, number][];
  center: [number, number];
}

// 3 EQUALLY ALIGNED adjacent zones at Krishi Vigyan Kendra agricultural farm in Kosbad Hill, Palghar (1.8 ac each = 5.4 ac total)
export const farmZones: ZoneData[] = [
  {
    id: 'ZONE-1',
    name: 'Zone 1: West Sector',
    fieldId: 'FIELD-A',
    crop: 'Tomato',
    variety: 'Arka Rakshak',
    area: 1.8,
    health: 92,
    soilMoisture: 44,
    soilTemp: 24.2,
    diseaseRisk: 22,
    npk: { n: 110, p: 48, k: 190 },
    status: 'optimal',
    statusLabel: 'Fruiting • Optimal Health',
    color: '#059669',
    fillColor: '#10B981',
    coordinates: [
      [20.0602, 72.7525],
      [20.0602, 72.7532],
      [20.0588, 72.7532],
      [20.0588, 72.7525],
    ],
    center: [20.05985, 72.75285],
  },
  {
    id: 'ZONE-2',
    name: 'Zone 2: Central Sector',
    fieldId: 'FIELD-B',
    crop: 'Cotton',
    variety: 'Phule Anmol',
    area: 1.8,
    health: 84,
    soilMoisture: 24,
    soilTemp: 26.5,
    diseaseRisk: 15,
    npk: { n: 95, p: 40, k: 168 },
    status: 'warning',
    statusLabel: 'Low Moisture Alert (24%)',
    color: '#D97706',
    fillColor: '#F59E0B',
    coordinates: [
      [20.0602, 72.7532],
      [20.0602, 72.7539],
      [20.0588, 72.7539],
      [20.0588, 72.7532],
    ],
    center: [20.05985, 72.75355],
  },
  {
    id: 'ZONE-3',
    name: 'Zone 3: East Sector',
    fieldId: 'FIELD-C',
    crop: 'Tomato (Polyhouse)',
    variety: 'Abhinav',
    area: 1.8,
    health: 91,
    soilMoisture: 42,
    soilTemp: 25.1,
    diseaseRisk: 78,
    npk: { n: 108, p: 46, k: 185 },
    status: 'critical',
    statusLabel: 'Early Blight Monitored (17 Pl.)',
    color: '#7C3AED',
    fillColor: '#8B5CF6',
    coordinates: [
      [20.0602, 72.7539],
      [20.0602, 72.7546],
      [20.0588, 72.7546],
      [20.0588, 72.7539],
    ],
    center: [20.05985, 72.75425],
  },
];

// Krishi Vigyan Kendra farm center coordinates (Kosbad Hill, Palghar)
const farmCenter: [number, number] = [20.0595, 72.75355];

interface TileConfig {
  url: string;
  attribution: string;
  subdomains: string;
  maxZoom: number;
}

// 100% Free Tile Layers with ZERO API Keys required
const tileLayersConfig: Record<string, TileConfig> = {
  // Standard OpenStreetMap - completely free, no API key needed
  '2D': {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
  },
  // Esri World Imagery - high-resolution satellite imagery over the agricultural farm
  'SATELLITE': {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
    subdomains: 'abc',
    maxZoom: 19,
  },
  // Esri World Topo Map - clean topographic relief
  'TERRAIN': {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Topographic Landscape',
    subdomains: 'abc',
    maxZoom: 19,
  },
};

interface LeafletFieldMapProps {
  mapMode: '2D' | 'SATELLITE' | 'TERRAIN';
  activeLayers: {
    boundaries: boolean;
    zones: boolean;
    robots: boolean;
    sensors: boolean;
    diseaseRisk: boolean;
  };
  selectedZoneId: string | 'ALL';
  focusedPlantId?: string;
  onSelectZone: (zoneId: string | 'ALL') => void;
  onSelectEntity: (type: 'field' | 'zone' | 'plant' | 'sensor' | 'robot', id: string) => void;
}

export default function LeafletFieldMap({
  mapMode,
  activeLayers,
  selectedZoneId,
  focusedPlantId,
  onSelectZone,
  onSelectEntity,
}: LeafletFieldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { setSelectedRobot, setIsRobotModalOpen, agroBots, plants, setSelectedPlant } = useFarm();

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map Instance centered at Krishi Vigyan Kendra farm
    const map = L.map(mapContainerRef.current, {
      center: farmCenter,
      zoom: 17,
      minZoom: 14,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Attribution control
    L.control
      .attribution({
        position: 'bottomright',
        prefix: false,
      })
      .addTo(map);

    // Initial Tile Layer (Standard OpenStreetMap or Esri Satellite, no API key)
    const tileConfig = tileLayersConfig[mapMode] || tileLayersConfig['2D'];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer Group for dynamic features
    const featureGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = featureGroup;

    mapInstanceRef.current = map;

    // Recalculate container dimensions
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Seamlessly update tile layer on mapMode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = tileLayersConfig[mapMode] || tileLayersConfig['2D'];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapMode]);

  // 3. Smooth Fly-to Animation when focusing on a Zone or resetting to All
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedZoneId === 'ALL') {
      map.flyTo(farmCenter, 17, { duration: 1.0 });
    } else {
      const zone = farmZones.find((z) => z.id === selectedZoneId);
      if (zone) {
        const bounds = L.latLngBounds(zone.coordinates);
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 18, duration: 1.0 });
      }
    }
  }, [selectedZoneId]);

  // 3b. Fly to focused plant if specified
  useEffect(() => {
    if (!mapInstanceRef.current || !focusedPlantId) return;
    const targetPlant = plants.find((p) => p.id === focusedPlantId || p.plantId === focusedPlantId);
    if (targetPlant && targetPlant.latitude && targetPlant.longitude) {
      mapInstanceRef.current.flyTo([targetPlant.latitude, targetPlant.longitude], 18, { duration: 1.2 });
    }
  }, [focusedPlantId, plants]);

  // 4. Render Polygons, Markers, and Labels
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. Overall Cadastral Boundary (Exact 5.4 Acres)
    if (activeLayers.boundaries) {
      const farmOuterPolygon: [number, number][] = [
        [20.0602, 72.7525],
        [20.0602, 72.7546],
        [20.0588, 72.7546],
        [20.0588, 72.7525],
      ];

      L.polygon(farmOuterPolygon, {
        color: '#16A34A',
        weight: 3,
        dashArray: '8, 6',
        fillColor: '#16A34A',
        fillOpacity: 0.04,
      })
        .bindTooltip('Krishi Vigyan Kendra Cadastral Perimeter (5.4 ac)', {
          permanent: false,
          direction: 'top',
          className: 'leaflet-custom-tooltip',
        })
        .addTo(group);
    }

    // 2. The 3 Zones: Equally Sized (1.8 ac each) & Perfectly Aligned Side-by-Side
    if (activeLayers.zones) {
      farmZones.forEach((zone) => {
        const isSelected = selectedZoneId === zone.id || selectedZoneId === 'ALL';
        const isFocused = selectedZoneId === zone.id;

        // Polygon
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          weight: isFocused ? 4 : isSelected ? 2.8 : 1.5,
          fillColor: zone.fillColor,
          fillOpacity: isFocused ? 0.35 : isSelected ? 0.22 : 0.08,
          dashArray: isFocused ? undefined : '5, 4',
        });

        // Click to inspect
        polygon.on('click', () => {
          onSelectZone(zone.id);
          onSelectEntity('zone', zone.id);
        });

        // Detailed Information Popup
        const popupContent = `
          <div style="font-family: inherit; min-width: 210px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 13px; color: #111827;">${zone.name}</span>
              <span style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: #DCFCE7; color: #166534;">
                ${zone.health}% Health
              </span>
            </div>
            <div style="font-size: 11px; color: #4B5563; margin-bottom: 6px;">
              Crop: <strong>${zone.crop}</strong> (${zone.variety}) • <strong>${zone.area} Acres</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; background: #F9FAFB; padding: 6px; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 6px;">
              <div>Moisture: <strong style="color: #111827;">${zone.soilMoisture}%</strong></div>
              <div>Temp: <strong style="color: #111827;">${zone.soilTemp}°C</strong></div>
              <div>NPK: <strong style="color: #111827;">${zone.npk.n}-${zone.npk.p}-${zone.npk.k}</strong></div>
              <div>Risk: <strong style="color: ${zone.diseaseRisk > 50 ? '#DC2626' : '#16A34A'};">${zone.diseaseRisk}%</strong></div>
            </div>
            <div style="font-size: 10px; font-weight: 700; color: ${zone.status === 'critical' ? '#DC2626' : zone.status === 'warning' ? '#D97706' : '#166534'};">
              ● ${zone.statusLabel}
            </div>
          </div>
        `;

        polygon.bindPopup(popupContent, { className: 'leaflet-custom-popup' });
        polygon.addTo(group);

        // Highly visible zone badge floating in the center of each zone
        const labelHtml = `
          <div style="
            background: #FFFFFF;
            border: 2px solid ${zone.color};
            border-radius: 9999px;
            padding: 3px 10px;
            font-size: 11px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18);
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${zone.color};"></span>
            <span>${zone.name.split(':')[0]}</span>
            <span style="color: #4B5563; font-weight: 600;">(${zone.area} ac)</span>
          </div>
        `;

        const labelMarker = L.marker(zone.center, {
          icon: L.divIcon({
            html: labelHtml,
            className: 'custom-zone-label',
            iconSize: [0, 0],
          }),
        });

        labelMarker.on('click', () => {
          onSelectZone(zone.id);
          onSelectEntity('zone', zone.id);
        });

        labelMarker.addTo(group);
      });
    }

    // 3. Central Solenoid Pump Station & RTK Base (Center of Farm on Shared Latitude 20.05935)
    const baseStationHtml = `
      <div style="
        background: #111827;
        color: white;
        border: 2px solid #10B981;
        border-radius: 9999px;
        height: 28px;
        padding: 0 10px;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transform: translate(-50%, -50%);
        white-space: nowrap;
        box-sizing: border-box;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
        <span>RTK Base & Central Pump</span>
      </div>
    `;

    L.marker([20.05935, 72.75355], {
      icon: L.divIcon({
        html: baseStationHtml,
        className: 'custom-base-marker',
        iconSize: [0, 0],
      }),
    })
      .bindTooltip('RTK-GPS Base Station • Accuracy ±1.5cm • Automated Solenoid Drip Valves', {
        direction: 'bottom',
      })
      .addTo(group);

    // 4. AgroBots Live Rover Badges — Perfectly Aligned on Latitude 20.05935
    if (activeLayers.robots) {
      // Robot 1: AGB-01 in Zone 1 (West Sector)
      const robot1Html = `
        <div style="
          background: #047857;
          color: white;
          border: 2px solid #FFFFFF;
          border-radius: 9999px;
          height: 28px;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(4, 120, 87, 0.45);
          cursor: pointer;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          box-sizing: border-box;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34D399; animation: pulse 1.5s infinite;"></span>
          <span>AGB-01 (78%)</span>
          <span style="font-size: 9px; opacity: 0.9; margin-left: 2px;">• 1.1 m/s</span>
        </div>
      `;

      const r1Marker = L.marker([20.05935, 72.75285], {
        icon: L.divIcon({
          html: robot1Html,
          className: 'custom-robot-marker',
          iconSize: [0, 0],
        }),
      });

      r1Marker.on('click', () => {
        setSelectedRobot(agroBots[0]);
        setIsRobotModalOpen(true);
        onSelectEntity('robot', 'AGB-01');
      });

      r1Marker
        .bindTooltip('AgroBot AGB-01: Autonomous Weeding & Row Patrol (Zone 1)', {
          direction: 'top',
        })
        .addTo(group);

      // Robot 2: AGB-02 in Zone 3 (East Sector) — Exact same latitude 20.05935 & dimensions
      const robot2Html = `
        <div style="
          background: #1D4ED8;
          color: white;
          border: 2px solid #FFFFFF;
          border-radius: 9999px;
          height: 28px;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.45);
          cursor: pointer;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          box-sizing: border-box;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #60A5FA; animation: pulse 1.5s infinite;"></span>
          <span>AGB-02 (64%)</span>
          <span style="font-size: 9px; opacity: 0.9; margin-left: 2px;">• 0.9 m/s</span>
        </div>
      `;

      const r2Marker = L.marker([20.05935, 72.75425], {
        icon: L.divIcon({
          html: robot2Html,
          className: 'custom-robot-marker',
          iconSize: [0, 0],
        }),
      });

      r2Marker.on('click', () => {
        setSelectedRobot(agroBots[1]);
        setIsRobotModalOpen(true);
        onSelectEntity('robot', 'AGB-02');
      });

      r2Marker
        .bindTooltip('AgroBot AGB-02: Canopy Disease Scout & Targeted Sprayer (Zone 3)', {
          direction: 'top',
        })
        .addTo(group);
    }

    // 5. Sensors Probes (Acoustic Node, Moisture, NPK)
    if (activeLayers.sensors) {
      // Acoustic Sensor SNS-AC-02 in Zone 1
      const acousticHtml = `
        <div style="
          background: #F59E0B;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          📻
        </div>
      `;
      L.marker([20.05895, 72.75285], {
        icon: L.divIcon({ html: acousticHtml, className: 'sensor-marker', iconSize: [0, 0] }),
      })
        .bindTooltip('Acoustic Node SNS-AC-02: Insect Frequency Monitoring (4.8 kHz Peak)', {
          direction: 'top',
        })
        .addTo(group);

      // Soil Moisture Probe SNS-SM-04 in Zone 2 (Central Sector)
      const moistureHtml = `
        <div style="
          background: #EF4444;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          💧
        </div>
      `;
      L.marker([20.05895, 72.75355], {
        icon: L.divIcon({ html: moistureHtml, className: 'sensor-marker', iconSize: [0, 0] }),
      })
        .bindTooltip('Moisture Probe SNS-SM-04: Alert 24% Dry (Zone 2 Cotton)', {
          direction: 'top',
        })
        .addTo(group);

      // NPK Nutrient Probe SNS-NPK-01 in Zone 3 (East Sector)
      const npkHtml = `
        <div style="
          background: #8B5CF6;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          🌱
        </div>
      `;
      L.marker([20.05895, 72.75425], {
        icon: L.divIcon({ html: npkHtml, className: 'sensor-marker', iconSize: [0, 0] }),
      })
        .bindTooltip('NPK Sensor: N:108 P:46 K:185 mg/kg (Zone 3 Polyhouse)', {
          direction: 'top',
        })
        .addTo(group);
    }

    // 6. Disease Hotspot Circle in Zone 3
    if (activeLayers.diseaseRisk) {
      L.circle([20.0591, 72.7544], {
        radius: 18,
        color: '#EF4444',
        weight: 2.5,
        fillColor: '#F87171',
        fillOpacity: 0.35,
        dashArray: '4, 4',
      })
        .bindTooltip('Early Blight Focal Cluster (Zone 3 - 17 Plants Under Treatment)', {
          direction: 'top',
        })
        .addTo(group);
    }

    // 7. Individual Monitored Plants Markers (Field C, Field A, Field B)
    plants.forEach((plant) => {
      if (!plant.latitude || !plant.longitude) return;

      const isFocused = plant.id === focusedPlantId || plant.plantId === focusedPlantId;
      const health = plant.currentHealth ?? plant.health;
      const isAttention = plant.status === 'Attention' || plant.growthStatus === 'Attention';
      const badgeBg = isFocused ? '#16A34A' : isAttention ? '#D97706' : '#FFFFFF';
      const badgeColor = isFocused ? '#FFFFFF' : isAttention ? '#FFFFFF' : '#111827';
      const borderColor = isFocused ? '#FFFFFF' : isAttention ? '#B45309' : '#16A34A';

      const plantHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${
            isFocused
              ? `
            <div style="
              position: absolute;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: rgba(22, 163, 74, 0.3);
              border: 2px solid #16A34A;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          `
              : ''
          }
          <div style="
            background: ${badgeBg};
            color: ${badgeColor};
            border: 2px solid ${borderColor};
            border-radius: 9999px;
            padding: 2px 7px;
            font-size: 10px;
            font-weight: 800;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            transition: transform 0.2s;
          ">
            <span>🌱</span>
            <span>#${plant.plantId || plant.id.replace('PLANT-', '')}</span>
            <span style="font-size: 9px; opacity: 0.85;">${health}%</span>
          </div>
        </div>
      `;

      const plantMarker = L.marker([plant.latitude, plant.longitude], {
        icon: L.divIcon({
          html: plantHtml,
          className: `custom-plant-marker ${isFocused ? 'focused-plant' : ''}`,
          iconSize: [0, 0],
        }),
        zIndexOffset: isFocused ? 1000 : 200,
      });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 210px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: 800; font-size: 12px; color: #111827;">Plant #${plant.plantId || plant.id.replace('PLANT-', '')}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 9999px; background: #DCFCE7; color: #166534;">
              ${health}% Healthy
            </span>
          </div>
          <div style="font-size: 11px; color: #4B5563; margin-bottom: 4px;">
            ${plant.cropName} (${plant.variety}) • Row ${plant.rowNumber || 12}
          </div>
          <div style="font-size: 10px; color: #6B7280; margin-bottom: 8px;">
            Status: <strong style="color: #111827;">${plant.diseaseStatus || plant.growthStatus || 'Optimal'}</strong>
          </div>
          <a
            href="/crops-health/plant-passport/${plant.id}"
            style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #16A34A; color: white; padding: 7px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; text-decoration: none;"
          >
            <span>Open Plant Passport</span>
            <span>→</span>
          </a>
        </div>
      `;

      plantMarker.bindPopup(popupHtml, { className: 'leaflet-custom-popup' });

      plantMarker.on('click', () => {
        setSelectedPlant(plant);
        onSelectEntity('plant', plant.id);
      });

      plantMarker.addTo(group);

      if (isFocused) {
        setTimeout(() => {
          plantMarker.openPopup();
        }, 600);
      }
    });
  }, [activeLayers, mapMode, selectedZoneId, focusedPlantId, plants]);

  // Controls Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    onSelectZone('ALL');
    mapInstanceRef.current?.flyTo(farmCenter, 17, { duration: 1.0 });
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-subtle select-none">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Modern Map Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-[#E5E7EB] p-1 shadow-md flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] text-[#374151] flex items-center justify-center font-bold text-lg transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-full h-px bg-[#E5E7EB]" />
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] text-[#374151] flex items-center justify-center font-bold text-lg transition-colors"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        <button
          onClick={handleResetView}
          className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] flex items-center justify-center shadow-md transition-colors"
          title="Reset to Full Farm View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Top-Left: Live Location & Farm Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] shadow-md flex items-center gap-2 text-xs font-semibold text-[#111827]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>Krishi Vigyan Kendra (Kosbad Hill, Palghar)</span>
          <span className="text-[#9CA3AF]">|</span>
          <span className="text-[#6B7280] font-mono text-[11px]">20.0595° N, 72.7535° E</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
            {mapMode}
          </span>
        </div>
      </div>

      {/* Bottom-Left: Interactive 3 Zones Quick Badges */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#E5E7EB] shadow-lg max-w-[calc(100%-32px)]">
        <span className="text-[10px] font-bold text-[#6B7280] uppercase px-1 mr-0.5">
          Focus:
        </span>
        <button
          onClick={() => onSelectZone('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            selectedZoneId === 'ALL'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
          }`}
        >
          All 3 Zones (5.4 ac)
        </button>
        {farmZones.map((z) => (
          <button
            key={z.id}
            onClick={() => onSelectZone(z.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedZoneId === z.id
                ? 'bg-[#16A34A] text-white shadow-xs font-bold'
                : 'bg-[#F9FAFB] text-[#374151] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: z.color }}
            />
            <span>{z.name.split(':')[0]}</span>
            <span className="opacity-75 text-[10px]">({z.crop})</span>
          </button>
        ))}
      </div>

      {/* Bottom-Right: Map Legend */}
      <div className="hidden md:flex items-center gap-3 absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-md text-[11px] text-[#4B5563]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span>Zone 1 (1.8 ac)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>Zone 2 (1.8 ac)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <span>Zone 3 (1.8 ac)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
          <span>AgroBot</span>
        </div>
      </div>
    </div>
  );
}
