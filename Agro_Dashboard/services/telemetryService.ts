import { agroBotsData } from '@/data/farmData';

export class TelemetryService {
  static async getLiveTelemetry(robotId: string) {
    const robot = agroBotsData.find((b) => b.id === robotId);
    return {
      robotId,
      timestamp: new Date().toISOString(),
      gps: robot?.gps,
      battery: robot?.battery,
      speed: robot?.speed,
      heading: robot?.heading,
      slam: robot?.slam,
      telemetry: robot?.telemetry,
      subsystems: robot?.subsystems,
    };
  }
}
