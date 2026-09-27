import { NextResponse } from 'next/server';
import { riskItemsData } from '@/data/farmData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId') || 'FARM-DEMO-001';

  return NextResponse.json({
    farmId,
    risks: riskItemsData.map((r) => ({
      riskType: r.riskType,
      probability: r.probability,
      confidence: r.confidence,
      factors: r.factors,
      affectedFields: [r.affectedField],
      affectedZone: r.affectedZone,
      recommendedAction: r.action,
    })),
  });
}
