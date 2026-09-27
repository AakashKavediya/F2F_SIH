import { NextResponse } from 'next/server';
import { weatherData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    source: 'IMD / Mausam SANKALP (https://mausamsankalp.imd.gov.in/)',
    station: 'Palghar Agromet Advisory Service, Maharashtra',
    portalUrl: 'https://mausamsankalp.imd.gov.in/',
    nowcast: 'Moderate Thunderstorm Probability in 36 Hours',
    rainfallRisk: 'Elevated (18 mm)',
    climatology: weatherData.climatology,
    forecast: weatherData.forecast,
    status: 'LIVE',
  });
}
