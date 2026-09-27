import { NextResponse } from 'next/server';
import { advisoryItemsData } from '@/data/farmData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId') || 'FARM-DEMO-001';

  return NextResponse.json({
    farmId,
    recommendations: advisoryItemsData.map((a) => a.title),
    confidence: 92,
    sources: ['Edge Vision Cameras', 'IMD Agromet Advisory', 'Soil Moisture Grid'],
    actions: advisoryItemsData,
  });
}
