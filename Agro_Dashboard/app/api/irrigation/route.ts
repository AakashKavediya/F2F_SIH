import { NextResponse } from 'next/server';
import { irrigationData } from '@/data/farmData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fieldId = searchParams.get('fieldId');

  const events = fieldId
    ? irrigationData.history.filter((h) => h.fieldId === fieldId)
    : irrigationData.history;

  return NextResponse.json({
    events,
    volume: irrigationData.todayWaterLiters,
    weeklyVolume: irrigationData.weeklyWaterLiters,
    monthlyVolume: irrigationData.monthlyWaterLiters,
    efficiency: irrigationData.waterEfficiencyPct,
    moisture: irrigationData.farmAverageMoisture,
    flowSensor: irrigationData.flowSensor,
    recommendations: irrigationData.recommendations,
  });
}
