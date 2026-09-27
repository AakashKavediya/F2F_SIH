import { NextResponse } from 'next/server';
import { weatherData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    observations: weatherData.current,
    forecast: weatherData.forecast,
    rainProbability: weatherData.current.rainProbability,
    wind: {
      speed: weatherData.current.windSpeedKmH,
      direction: weatherData.current.windDirection,
    },
    climatology: weatherData.climatology,
    source: weatherData.source,
  });
}
