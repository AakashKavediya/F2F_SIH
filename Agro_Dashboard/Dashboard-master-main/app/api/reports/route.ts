import { NextResponse } from 'next/server';
import { farmData, fieldsData, irrigationData, agroBotsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    reportTypes: [
      'Farm Health Report',
      'Crop Health Report',
      'Irrigation Report',
      'Water Report',
      'Disease Report',
      'Pest Report',
      'Weed Report',
      'Nutrient Report',
      'Fertilizer Report',
      'AgroBot Report',
      'Sensor Report',
      'Weather Report',
      'Risk Report',
      'Yield Report',
      'Advisory Report',
      'Field Passport Report',
      'Plant Passport Report',
      'Complete Farm Report',
    ],
    farmSummary: farmData,
    fieldCount: fieldsData.length,
    robotCount: agroBotsData.length,
    waterDeliveredToday: irrigationData.todayWaterLiters,
  });
}
