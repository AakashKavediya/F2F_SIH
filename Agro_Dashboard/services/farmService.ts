import {
  farmerData,
  farmData,
  fieldsData,
  selectedPlantDetails,
  agroBotsData,
  diseaseEventsData,
  pestEventsData,
  weedEventsData,
  irrigationData,
  taskItemsData,
  alertItemsData,
  riskItemsData,
  weatherData,
  advisoryItemsData,
  govtSchemesData,
  fieldPassportEventsData,
} from '@/data/farmData';
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
} from '@/data/types';

export class FarmService {
  static async getFarm(): Promise<Farm> {
    return farmData;
  }

  static async getFarmer(): Promise<Farmer> {
    return farmerData;
  }
}

export class FieldService {
  static async getFields(): Promise<Field[]> {
    return fieldsData;
  }

  static async getFieldById(id: string): Promise<Field | undefined> {
    return fieldsData.find((f) => f.id === id);
  }

  static async getFieldPassport(fieldId: string): Promise<PassportEvent[]> {
    return fieldPassportEventsData.filter((e) => e.fieldId === fieldId);
  }
}

export class CropService {
  static async getCropsSummary() {
    return [
      { name: 'Tomato', health: 91, variety: 'Arka Rakshak & Abhinav', area: 6.6, plants: 9640 },
      { name: 'Cotton', health: 84, variety: 'Gujarat Cotton-6', area: 2.8, plants: 3950 },
      { name: 'Wheat', health: 92, variety: 'GW-496', area: 3.0, plants: 5052 },
    ];
  }

  static async getPlantPassport(plantId: string): Promise<Plant> {
    if (plantId === selectedPlantDetails.id) return selectedPlantDetails;
    return selectedPlantDetails; // default demo plant
  }

  static async getDiseaseEvents(): Promise<DiseaseEvent[]> {
    return diseaseEventsData;
  }

  static async getPestEvents(): Promise<PestEvent[]> {
    return pestEventsData;
  }

  static async getWeedEvents(): Promise<WeedEvent[]> {
    return weedEventsData;
  }
}

export class IrrigationService {
  static async getIrrigationData(): Promise<IrrigationData> {
    return irrigationData;
  }
}

export class RobotService {
  static async getAgroBots(): Promise<AgroBot[]> {
    return agroBotsData;
  }

  static async getRobotById(id: string): Promise<AgroBot | undefined> {
    return agroBotsData.find((b) => b.id === id);
  }

  static async getRobotTelemetry(robotId: string) {
    const robot = agroBotsData.find((b) => b.id === robotId);
    return {
      robotId,
      timestamp: new Date().toISOString(),
      gps: robot?.gps,
      battery: robot?.battery,
      speed: robot?.speed,
      temperature: robot?.telemetry.motorTemp,
      slam: robot?.slam,
      subsystems: robot?.subsystems,
    };
  }
}

export class WeatherService {
  static async getWeather(): Promise<WeatherData> {
    return weatherData;
  }
}

export class IMDService {
  static async getAgrometAdvisory() {
    return {
      source: 'IMD / Mausam SANKALP',
      station: 'Ahmedabad Agromet Observatory',
      bulletinDate: '25 Sep 2026',
      advisoryText: 'Moderate rain expected within 48h. Postpone non-essential pesticide spray; inspect drainage ditches in cotton and tomato plots.',
      climatology: weatherData.climatology,
    };
  }
}

export class RiskService {
  static async getRisks(): Promise<RiskItem[]> {
    return riskItemsData;
  }
}

export class AdvisoryService {
  static async getAdvisories(): Promise<AdvisoryItem[]> {
    return advisoryItemsData;
  }
}

export class TaskService {
  static async getTasks(): Promise<TaskItem[]> {
    return taskItemsData;
  }
}

export class AlertService {
  static async getAlerts(): Promise<AlertItem[]> {
    return alertItemsData;
  }
}

export class SchemeService {
  static async getSchemes(): Promise<GovtSchemeItem[]> {
    return govtSchemesData;
  }
}
