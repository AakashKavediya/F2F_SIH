import { farmData, fieldsData, irrigationData, agroBotsData } from '@/data/farmData';

export class ReportService {
  static async getSummaryReport() {
    return {
      farm: farmData,
      fields: fieldsData,
      irrigation: irrigationData,
      robots: agroBotsData,
      generatedAt: new Date().toISOString(),
    };
  }
}
