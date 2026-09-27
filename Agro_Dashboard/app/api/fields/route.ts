import { NextResponse } from 'next/server';
import { fieldsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    fields: fieldsData.map((f) => ({
      id: f.id,
      name: f.name,
      area: f.area,
      crop: f.crop,
      variety: f.variety,
      health: f.health,
      moisture: f.soilMoisture,
      diseaseRisk: f.diseaseRisk,
      pestRisk: f.pestRisk,
      latitude: f.latitude,
      longitude: f.longitude,
      zones: f.zones,
    })),
  });
}
