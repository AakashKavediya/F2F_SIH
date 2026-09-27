import { NextResponse } from 'next/server';
import { fieldsData, diseaseEventsData, pestEventsData, weedEventsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    crops: [
      { name: 'Tomato', area: 6.6, plants: 9640, health: 91 },
      { name: 'Cotton', area: 2.8, plants: 3950, health: 84 },
      { name: 'Wheat', area: 3.0, plants: 5052, health: 92 },
    ],
    diseases: diseaseEventsData,
    pests: pestEventsData,
    weeds: weedEventsData,
  });
}
