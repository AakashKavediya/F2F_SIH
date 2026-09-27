// FARMEROS Core Types & Interfaces
export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'info';

export type GrowthStage =
  | 'Seedling'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'Maturity'
  | 'Harvest-ready';

export type EventType =
  | 'IRRIGATION'
  | 'FERTILIZER'
  | 'SPRAY'
  | 'DISEASE'
  | 'PEST'
  | 'WEED'
  | 'AI_SCAN'
  | 'ROBOT_VISIT'
  | 'WEATHER'
  | 'SOIL'
  | 'HARVEST'
  | 'FARMER_ACTION'
  | 'ADVISORY';

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  farm: string;
  experience: string;
  registration: string;
  eKYC: string;
  kccLimit: string;
  insuranceStatus: string;
  avatarUrl?: string;

  // Key Certificates & Land Documents
  casteCertificate?: string;
  incomeCertificate?: string;
  sevenTwelveExtract?: string;
  eightAExtract?: string;
  domicileCertificate?: string;
  profileCompletionPct?: number;
}

export interface Farm {
  id: string;
  name: string;
  farmerId: string;
  totalArea: number; // in acres
  cultivableArea: number;
  irrigatedArea: number;
  rainfedArea: number;
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  farmHealth: number; // 0 - 100
  cropHealth: number;
  waterEfficiency: number;
  robotCoverage: number;
  activeIssuesCount: {
    critical: number;
    warning: number;
    info: number;
    total: number;
  };
  expectedYield: {
    tonnes: number;
    confidence: number;
  };
}

export interface Zone {
  id: string;
  fieldId: string;
  name: string;
  area: number; // acres
  soilMoisture: number; // %
  soilTemperature: number; // °C
  npk: {
    n: number;
    p: number;
    k: number;
  };
  healthScore: number;
  hasActiveIssue?: boolean;
  issueDescription?: string;
}

export type PlantEventType =
  | 'plant_added'
  | 'irrigation'
  | 'fertilizer'
  | 'spray'
  | 'disease_detected'
  | 'agribot_inspection'
  | 'health_check'
  | 'harvest'
  | 'note';

export interface PlantEventRecord {
  id: string;
  plantId: string;
  eventType: PlantEventType;
  date: string;
  time?: string;
  title: string;
  description: string;
  quantity?: number;
  value?: string | number;
  unit?: string;
  status?: 'Completed' | 'Detected' | 'Scheduled' | 'Monitoring' | 'Optimal' | 'Alert' | string;
  icon?: string;
  severity?: 'normal' | 'info' | 'warning' | 'critical' | 'success';
  images?: string[];
  createdAt?: string;
}

export interface PlantPhoto {
  id: string;
  plantId: string;
  url: string;
  thumbnailUrl?: string;
  caption: string;
  date: string;
  time?: string;
  eventType: PlantEventType | string;
  source: 'Agribot inspection' | 'Disease detection' | 'Manual farmer upload' | 'Growth monitoring';
  tags?: string[];
}

export interface HealthReading {
  id: string;
  plantId: string;
  timestamp: string;
  date: string;
  healthScore: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  diseaseRisk: number;
  growthStage: GrowthStage;
  notes?: string;
}

export interface AgribotInspectionRecord {
  id: string;
  plantId: string;
  robotId: string;
  robotName: string;
  timestamp: string;
  healthObserved: number;
  diseaseDetected?: string;
  confidence?: number;
  leafImagesCaptured: number;
  soilMoistureObserved: number;
  notes: string;
}

export interface Plant {
  id: string;
  plantId?: string;
  fieldId: string;
  fieldName?: string;
  zoneId: string;
  rowId: string;
  rowNumber?: number;
  plantNumber?: number;
  cropName: string;
  cropType?: string;
  variety: string;
  plantedDate: string;
  ageDays: number;
  health: number; // %
  currentHealth?: number; // %
  stage: GrowthStage;
  growthStage?: GrowthStage;
  status: 'On Track' | 'Attention' | 'Critical';
  growthStatus?: 'On Track' | 'Recovering' | 'Attention' | 'Critical';
  soilMoisture?: number;
  diseaseStatus?: string;
  diseaseConfidence?: number;
  diseaseRisk?: number;
  waterTotal?: number;
  fertilizerApplications?: number;
  sprayApplications?: number;
  aiScanCount?: number;
  agribotVisitCount?: number;
  lastInspection?: string;
  lastIrrigation?: string;
  lastFertilizer?: string;
  lastSpray?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  photos?: PlantPhoto[];
  events?: PlantEventRecord[];
  healthReadings?: HealthReading[];
  inspections?: AgribotInspectionRecord[];
  createdAt?: string;
  updatedAt?: string;
  stats: {
    estimatedWaterLiters: number;
    fertilizerApplications: number;
    sprays: number;
    aiScans: number;
    agribotVisits?: number;
  };
  timeline: {
    date: string;
    event: string;
    type: EventType;
    details: string;
  }[];
  aiWhatChanged: {
    healthDelta: string;
    diseaseDelta: string;
    moistureDelta: string;
    robotInspections: number;
    summary: string;
  };
}

export interface Field {
  id: string;
  farmId: string;
  name: string;
  crop: string;
  variety: string;
  area: number; // acres
  plantCount: number;
  health: number; // %
  growthStage: GrowthStage;
  cropAgeDays: number;
  soilMoisture: number; // %
  diseaseRisk: number; // %
  pestRisk: number; // %
  weedCoverage: number; // %
  waterStress: 'Low' | 'Moderate' | 'High';
  nutrientStatus: 'Optimal' | 'Deficient' | 'Slight Deficit';
  lastAiScan: string;
  latitude: number;
  longitude: number;
  zones: Zone[];
  expectedHarvest: string;
}

export interface AgroBot {
  id: string;
  name: string;
  status: 'ONLINE' | 'STANDBY' | 'CHARGING' | 'OFFLINE';
  battery: number; // %
  currentMission: string;
  coverage: number; // %
  speed: number; // m/s
  heading: number; // degrees
  gps: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
    satellites: number;
    hdop: number;
  };
  imu: {
    roll: number;
    pitch: number;
    yaw: number;
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
  };
  slam: {
    slamX: number;
    slamY: number;
    slamTheta: number;
    mapId: string;
    localizationConfidence: number; // %
    mapQuality: number; // %
    trajectory: [number, number][];
  };
  subsystems: {
    gps: 'Normal' | 'Warning' | 'Fault';
    slam: 'Normal' | 'Warning' | 'Fault';
    lidar: 'Normal' | 'Warning' | 'Fault';
    camera: 'Normal' | 'Warning' | 'Fault';
    edgeAi: 'Normal' | 'Warning' | 'Fault';
    connectivity: 'Normal' | 'Warning' | 'Fault';
    batteryHealth: 'Normal' | 'Warning' | 'Fault';
    motorHealth: 'Normal' | 'Warning' | 'Fault';
    emergencyStop: boolean;
  };
  telemetry: {
    batteryVoltage: number;
    batteryCurrent: number;
    batteryTemp: number;
    motorRpm: number;
    motorTemp: number;
    cameraFps: number;
    inferenceFps: number;
    lidarPoints: number;
  };
}

export interface DiseaseEvent {
  id: string;
  fieldId: string;
  zoneId: string;
  plantId?: string;
  diseaseName: string;
  confidence: number; // %
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  status: 'Active' | 'Resolved' | 'Monitoring';
  affectedPlants: number;
  affectedAreaSqM: number;
  detectedAt: string;
  source: string;
  aiModel: string;
  treatmentId?: string;
  progression: { day: string; count: number }[];
  treatmentDetails?: {
    date: string;
    product: string;
    robotId: string;
    beforePlants: number;
    afterPlants: number;
    effectivenessPct: number;
  };
}

export interface PestEvent {
  id: string;
  fieldId: string;
  zoneId: string;
  species: 'Aphids' | 'Whitefly' | 'Thrips' | 'Caterpillar';
  confidence: number;
  count: number;
  densityPerSqM: number;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Controlled';
  trendPct: number; // e.g. +18%
  source: 'Camera' | 'Acoustic' | 'Multimodal';
  detectedAt: string;
  acousticData?: {
    frequencyKHz: number;
    activityScore: number; // 0-100
    confidence: number;
  };
}

export interface WeedEvent {
  id: string;
  fieldId: string;
  zoneId: string;
  species: string;
  coveragePct: number;
  densityPerSqM: number;
  affectedAreaAcres: number;
  competitionRisk: 'Low' | 'Medium' | 'High';
  recommendedIntervention: string;
  detectedAt: string;
}

export interface IrrigationData {
  todayWaterLiters: number;
  weeklyWaterLiters: number;
  monthlyWaterLiters: number;
  waterEfficiencyPct: number;
  waterSavedLiters: number;
  farmAverageMoisture: number;
  optimalRange: [number, number];
  flowSensor: {
    rateLitersPerMin: number;
    totalDeliveredLiters: number;
    pressureBar: number;
    pumpStatus: 'ON' | 'OFF';
    valveStatus: 'OPEN' | 'CLOSED';
    tankLevelPct: number;
  };
  etAnalytics: {
    et0: number; // mm/day
    etc: number; // mm/day
    cropCoefficient: number;
    dailyRequirementLiters: number;
  };
  recommendations: {
    fieldId: string;
    zoneId: string;
    currentMoisture: number;
    optimalMoisture: string;
    action: string;
    suggestedWindow: string;
    expectedWaterLiters: number;
    reason: string;
  }[];
  history: {
    id: string;
    date: string;
    fieldId: string;
    fieldName: string;
    zoneId: string;
    durationMins: number;
    flowRate: number;
    liters: number;
    moistureBefore: number;
    moistureAfter: number;
    pump: 'ON' | 'OFF';
    valve: 'OPEN' | 'CLOSED';
    efficiency: number;
  }[];
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'FARMER' | 'ROBOT';
  type: string;
  fieldId: string;
  zoneId?: string;
  assignedTo: string;
  estimatedTimeMins: number;
  targetArea: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  reason: string;
  createdAt: string;
  deadline: string;
  aiRecommended: boolean;
  scheduledDate?: string;
  scheduledDay?: string;
  scheduledTime?: string;
}

export interface AlertItem {
  id: string;
  severity: 'Critical' | 'Warning' | 'Information';
  title: string;
  description: string;
  category: 'Disease' | 'Water' | 'Weather' | 'Pest' | 'Robot' | 'Nutrient' | 'Scheme';
  fieldId?: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  actionPrompt?: string;
}

export interface RiskFactor {
  name: string;
  contributionPct: number;
}

export interface RiskItem {
  id: string;
  riskType: string;
  probability: number; // %
  confidence: number; // %
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  affectedField: string;
  affectedZone: string;
  factors: RiskFactor[];
  action: string;
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    rainProbability: number;
    expectedRainMm: number;
    windSpeedKmH: number;
    windDirection: string;
    condition: string;
    dewPoint: number;
    uvIndex: number;
    solarRadiation: number;
  };
  forecast: {
    day: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
  }[];
  climatology: {
    thirtyYearMeanRainfallMm: number;
    cumulativeRainfallMm: number;
    anomalyPct: number;
    percentiles: {
      p90: number;
      p95: number;
      p99: number;
    };
    drySpellDays: number;
    wetSpellDays: number;
  };
  source: string;
  isDemo: boolean;
}

export interface AdvisoryItem {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  why: string;
  dataSources: string[];
  confidence: number;
  action: string;
  expectedOutcome: string;
  fieldId?: string;
  cropStage?: string;
}

export interface GovtSchemeItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  benefit: string;
  eligibilityScore: number; // 0 - 100
  eligibilityStatus: 'Eligible' | 'Potentially Eligible' | 'Active Enrolled' | 'Not Eligible';
  documents: {
    name: string;
    status: 'Available' | 'Missing' | 'Verified' | 'Expired';
  }[];
  deadline: string;
  applicationStatus: 'Not Started' | 'Documents Pending' | 'Submitted' | 'Under Review' | 'Approved';
  category: 'Subsidy' | 'Insurance' | 'Direct Benefit' | 'Soil & Inputs' | 'Irrigation';
  ministry?: string;
  link?: string;
}

export interface PassportEvent {
  id: string;
  date: string;
  timestamp: string;
  type: EventType;
  title: string;
  fieldId: string;
  zoneId?: string;
  plantId?: string;
  robotId?: string;
  description: string;
  metricChange?: string;
  weatherSnippet?: string;
  effectivenessPct?: number;
  tags: string[];
}
