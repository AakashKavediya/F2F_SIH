import { NextResponse } from 'next/server';
import { selectedPlantDetails } from '@/data/farmData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plantId = searchParams.get('id') || selectedPlantDetails.id;
  return NextResponse.json({
    mode: 'mock',
    plant: selectedPlantDetails,
  });
}
