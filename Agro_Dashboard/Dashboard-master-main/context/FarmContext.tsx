'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Farmer,
  Farm,
  Field,
  Plant,
  AgroBot,
  DiseaseEvent,
  PestEvent,
  WeedEvent,
  IrrigationData,
  TaskItem,
  AlertItem,
  RiskItem,
  WeatherData,
  AdvisoryItem,
  GovtSchemeItem,
  PassportEvent,
  PlantEventRecord,
} from '@/data/types';
import {
  farmerData,
  farmData,
  fieldsData,
  selectedPlantDetails,
  allPlantsData,
  agroBotsData,
  diseaseEventsData,
  pestEventsData,
  weedEventsData,
  irrigationData as initialIrrigationData,
  taskItemsData,
  alertItemsData,
  riskItemsData,
  weatherData,
  advisoryItemsData,
  govtSchemesData,
  fieldPassportEventsData,
} from '@/data/farmData';

export type DateFilterType = 'Today' | '7D' | '30D' | '90D' | 'Season';
export type DataModeType = 'DEMO' | 'LIVE' | 'CACHED' | 'OFFLINE';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedAction?: string;
}

interface FarmContextType {
  farmer: Farmer;
  farm: Farm;
  fields: Field[];
  selectedField: Field | null;
  setSelectedField: (field: Field | null) => void;
  selectedPlant: Plant;
  setSelectedPlant: (plant: Plant) => void;
  selectedRobot: AgroBot | null;
  setSelectedRobot: (robot: AgroBot | null) => void;
  agroBots: AgroBot[];
  diseaseEvents: DiseaseEvent[];
  pestEvents: PestEvent[];
  weedEvents: WeedEvent[];
  irrigation: IrrigationData;
  tasks: TaskItem[];
  alerts: AlertItem[];
  risks: RiskItem[];
  weather: WeatherData;
  advisories: AdvisoryItem[];
  govtSchemes: GovtSchemeItem[];
  fieldPassportEvents: PassportEvent[];
  plants: Plant[];
  getPlantById: (id: string) => Plant | undefined;
  updatePlant: (plantId: string, updates: Partial<Plant>) => void;
  addPlantEvent: (plantId: string, event: PlantEventRecord) => void;
  toasts: { id: string; message: string; type?: 'success' | 'info' | 'warning' }[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // App UI States
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  dataMode: DataModeType;
  setDataMode: (mode: DataModeType) => void;

  // Drawers and Modals
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isFieldPassportOpen: boolean;
  setIsFieldPassportOpen: (open: boolean) => void;
  isPlantPassportOpen: boolean;
  setIsPlantPassportOpen: (open: boolean) => void;
  isRobotModalOpen: boolean;
  setIsRobotModalOpen: (open: boolean) => void;

  // Actions
  togglePump: () => void;
  toggleValve: () => void;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  rescheduleTask: (taskId: string, date: string, day: string, time: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  chatMessages: ChatMessage[];
  sendAiQuery: (query: string) => void;
  openFieldPassportFor: (fieldId: string) => void;
  openPlantPassportFor: (plantId: string) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farmer] = useState<Farmer>(farmerData);
  const [farm] = useState<Farm>(farmData);
  const [fields] = useState<Field[]>(fieldsData);
  const [selectedField, setSelectedField] = useState<Field | null>(fieldsData[2]); // Field C default
  const [plants, setPlants] = useState<Plant[]>(allPlantsData);
  const [selectedPlant, setSelectedPlant] = useState<Plant>(allPlantsData[0]);
  const [toasts, setToasts] = useState<{ id: string; message: string; type?: 'success' | 'info' | 'warning' }[]>([]);
  const [agroBots, setAgroBots] = useState<AgroBot[]>(agroBotsData);
  const [selectedRobot, setSelectedRobot] = useState<AgroBot | null>(agroBotsData[1]); // AGB-02 default
  const [diseaseEvents] = useState<DiseaseEvent[]>(diseaseEventsData);
  const [pestEvents] = useState<PestEvent[]>(pestEventsData);
  const [weedEvents] = useState<WeedEvent[]>(weedEventsData);
  const [irrigation, setIrrigation] = useState<IrrigationData>(initialIrrigationData);
  const [tasks, setTasks] = useState<TaskItem[]>(taskItemsData);
  const [alerts, setAlerts] = useState<AlertItem[]>(alertItemsData);
  const [risks] = useState<RiskItem[]>(riskItemsData);
  const [weather] = useState<WeatherData>(weatherData);
  const [advisories] = useState<AdvisoryItem[]>(advisoryItemsData);
  const [govtSchemes] = useState<GovtSchemeItem[]>(govtSchemesData);
  const [fieldPassportEvents] = useState<PassportEvent[]>(fieldPassportEventsData);

  const [dateFilter, setDateFilter] = useState<DateFilterType>('Today');
  const [dataMode, setDataMode] = useState<DataModeType>('LIVE');

  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFieldPassportOpen, setIsFieldPassportOpen] = useState(false);
  const [isPlantPassportOpen, setIsPlantPassportOpen] = useState(false);
  const [isRobotModalOpen, setIsRobotModalOpen] = useState(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! I am your FarmerOS AI Farm Assistant. I have real-time access to Krishi Vigyan Kendra (Palghar, Maharashtra - 5.4 Acres) telemetry, sensor readings, robot missions, and IMD Mausam SANKALP agromet intelligence. How can I help you today?',
      timestamp: '09:00 AM',
      suggestedAction: 'Ask about Field C risk, water usage, or today’s priorities.',
    },
  ]);

  const togglePump = () => {
    setIrrigation((prev) => ({
      ...prev,
      flowSensor: {
        ...prev.flowSensor,
        pumpStatus: prev.flowSensor.pumpStatus === 'ON' ? 'OFF' : 'ON',
      },
    }));
  };

  const toggleValve = () => {
    setIrrigation((prev) => ({
      ...prev,
      flowSensor: {
        ...prev.flowSensor,
        valveStatus: prev.flowSensor.valveStatus === 'OPEN' ? 'CLOSED' : 'OPEN',
      },
    }));
  };

  const startTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'In Progress' }
          : t
      )
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'Completed' }
          : t
      )
    );
  };

  const rescheduleTask = (taskId: string, date: string, day: string, time: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            status: 'Pending',
            scheduledDate: date,
            scheduledDay: day,
            scheduledTime: time,
            deadline: `${day}, ${time}`,
          }
          : t
      )
    );
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'Acknowledged' } : a
      )
    );
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getPlantById = (id: string) => {
    const clean = id.toLowerCase().trim().replace(/^plant-/, '').replace(/^#/, '');
    return plants.find((p) => {
      const pId = p.id.toLowerCase().replace(/^plant-/, '');
      const altId = (p.plantId || '').toLowerCase().replace(/^#/, '');
      return p.id.toLowerCase() === id.toLowerCase() || pId === clean || altId === clean;
    });
  };

  const updatePlant = (plantId: string, updates: Partial<Plant>) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === plantId || p.plantId === plantId) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          setSelectedPlant((curr) => (curr.id === p.id ? updated : curr));
          return updated;
        }
        return p;
      })
    );
  };

  const addPlantEvent = (plantId: string, event: PlantEventRecord) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === plantId || p.plantId === plantId) {
          const events = [event, ...(p.events || [])];
          const timeline = [
            {
              date: event.date,
              event: event.title,
              type: 'ROBOT_VISIT' as const,
              details: event.description,
            },
            ...(p.timeline || []),
          ];
          const updated: Plant = {
            ...p,
            events,
            timeline,
            updatedAt: new Date().toISOString(),
          };
          setSelectedPlant((curr) => (curr.id === p.id ? updated : curr));
          return updated;
        }
        return p;
      })
    );
  };

  const openFieldPassportFor = (fieldId: string) => {
    const f = fields.find((item) => item.id === fieldId) || fields[2];
    setSelectedField(f);
    setIsFieldPassportOpen(true);
  };

  const openPlantPassportFor = (plantId: string) => {
    const targetPlant = getPlantById(plantId) || selectedPlant;
    setSelectedPlant(targetPlant);
    const targetField = fields.find((f) => f.id === targetPlant.fieldId);
    if (targetField) {
      setSelectedField(targetField);
    }
    if (typeof window !== 'undefined') {
      window.location.href = `/crops-health/plant-passport/${targetPlant.id}`;
    }
  };

  // Local Farm AI Intent Handler using real relational farm data
  const sendAiQuery = (query: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    const q = query.toLowerCase();
    let replyText = '';
    let sources: string[] = ['FarmerOS Central DataStore'];
    let suggestedAction = '';

    if (q.includes('field c') && (q.includes('risk') || q.includes('why') || q.includes('blight'))) {
      replyText =
        'Field C currently has a disease risk of 78%. The main contributing factors are elevated humidity (72%), recent rainfall, leaf wetness and previous disease activity. AgroBot AGB-02 detected 17 affected plants in Zone C4. A recent inspection also confirmed early-blight symptoms.\n\nRecommended next action: inspect Zone C4 and review the targeted treatment.';
      sources = ['AgroBot Camera Edge Vision v1.4', 'IMD Agromet Humidity Model', 'Disease Registry (D-018)'];
      suggestedAction = 'Open Field C Passport or dispatch AGB-02 inspection.';
    } else if (q.includes('how is my farm') || q.includes('farm today') || q.includes('overview') || q.includes('status')) {
      replyText = `Overall Farm Health is 88/100 (↑ 4.8%). Crop health stands at 90%, and water efficiency is at 89%. You have 7 active issues across your 5.4 acres at Krishi Vigyan Kendra (Palghar, Maharashtra): 2 critical (Early Blight risk in Field C, Zone B2 moisture low at 24%), 3 warning, and 2 informational. Expected yield is 3.8 tonnes with 86% confidence.`;
      sources = ['Farm Health Engine', 'Active Issue Aggregator'];
      suggestedAction = 'Check Dashboard priorities.';
    } else if (q.includes('water') || q.includes('irrigation')) {
      replyText = `Today's water consumption is 2,840 Litres against an estimated ETc crop requirement of 3,100 L. Weekly consumption is 18,400 L, saving 8,240 L this month through precision scheduling. Primary alert: Field B / Zone B2 has dropped to 24% soil moisture. Recommendation: run a 420 L drip cycle between 4:00–5:00 PM.`;
      sources = ['Electromagnetic Flow Sensor (14.2 L/min)', 'Capacitive Moisture Probes', 'ET Calculator'];
      suggestedAction = 'Review Irrigation tab recommendation for Zone B2.';
    } else if (q.includes('robot') || q.includes('agrobot') || q.includes('slam')) {
      replyText = `Both AgroBots are currently ONLINE and operational. AgroBot AGB-01 (Battery 78%) is performing SLAM boundary mapping in Field A (68% coverage). AgroBot AGB-02 (Battery 64%) is executing a precision disease inspection mission in Field C Zone C4 (81% coverage). LiDAR and Edge AI subsystems report normal health.`;
      sources = ['AGB-01 & AGB-02 Telemetry Feed', 'LiDAR SLAM Odometry'];
      suggestedAction = 'View live SLAM trajectory on Field Map.';
    } else if (q.includes('fertilizer') || q.includes('nutrient') || q.includes('nitrogen')) {
      replyText = `Nutrient status is optimal in Fields A, B, and C. In Field D (Wheat), available nitrogen is 72 mg/kg, which is below the optimal vegetative threshold of 95–120 mg/kg. Phosphorus (45 mg/kg) and Potassium (180 mg/kg) are in healthy bands.`;
      sources = ['Soil Health Card', 'Optical NPK Spectrometer (SNS-NPK-D1)'];
      suggestedAction = 'Plan split urea or compost top-dressing for Field D.';
    } else if (q.includes('pest') || q.includes('whitefly') || q.includes('aphid')) {
      replyText = `Pest monitoring indicates an active Whitefly cluster in Field A Zone A1 with an 18% increase over 48 hours (14 pests/m²). Acoustic sensors recorded 4.8 kHz wingbeat signatures with an activity score of 68/100. Aphids in Field B are currently low (8/m²).`;
      sources = ['Multimodal Edge Camera', 'Acoustic Pest Sensor (4.8 kHz)'];
      suggestedAction = 'Deploy yellow sticky traps along Field A boundary.';
    } else if (q.includes('weather') || q.includes('rain') || q.includes('imd')) {
      replyText = `IMD / Mausam SANKALP (https://mausamsankalp.imd.gov.in/) agromet bulletin: Current temp is 28°C with 72% humidity and 14 km/h NW wind. Rain probability is 68% today with 18 mm expected. 30-year rainfall mean for Palghar coastal cluster is 185.5 mm; current cumulative is 196.2 mm (+5.8% anomaly). Plan foliar spraying around rain intervals.`;
      sources = ['IMD Agromet Advisory Service', 'Palghar Station (Mausam SANKALP)'];
      suggestedAction = 'Check Alert & Insights for IMD climatology.';
    } else if (q.includes('which field needs attention') || q.includes('attention') || q.includes('priority')) {
      replyText = `Two zones require immediate attention today:\n1. Field C / Zone C4: Disease risk 78% with Early Blight symptoms.\n2. Field B / Zone B2: Soil moisture low at 24% (cotton vegetative stage).`;
      sources = ['Predictive Risk Engine', 'Zone Issue Aggregator'];
      suggestedAction = 'Address High Priority Tasks in Task Tab.';
    } else {
      replyText = `Here is the current farm intelligence summary for Krishi Vigyan Kendra (Palghar, Maharashtra): Overall Health 88/100, Expected Yield 3.8 tonnes. Key active items are Early Blight monitoring in Field C (Zone C4) and scheduled drip irrigation for Field B (Zone B2). What specific area would you like to explore?`;
      sources = ['Farm Health Engine', 'Digital Twin State'];
      suggestedAction = 'Ask about Field C, water usage, robot missions, or govt schemes.';
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        suggestedAction,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  return (
    <FarmContext.Provider
      value={{
        farmer,
        farm,
        fields,
        selectedField,
        setSelectedField,
        selectedPlant,
        setSelectedPlant,
        selectedRobot,
        setSelectedRobot,
        agroBots,
        diseaseEvents,
        pestEvents,
        weedEvents,
        irrigation,
        tasks,
        alerts,
        risks,
        weather,
        advisories,
        govtSchemes,
        fieldPassportEvents,
        plants,
        getPlantById,
        updatePlant,
        addPlantEvent,
        toasts,
        showToast,
        dismissToast,
        dateFilter,
        setDateFilter,
        dataMode,
        setDataMode,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isProfileOpen,
        setIsProfileOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isFieldPassportOpen,
        setIsFieldPassportOpen,
        isPlantPassportOpen,
        setIsPlantPassportOpen,
        isRobotModalOpen,
        setIsRobotModalOpen,
        togglePump,
        toggleValve,
        startTask,
        completeTask,
        rescheduleTask,
        acknowledgeAlert,
        chatMessages,
        sendAiQuery,
        openFieldPassportFor,
        openPlantPassportFor,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}
