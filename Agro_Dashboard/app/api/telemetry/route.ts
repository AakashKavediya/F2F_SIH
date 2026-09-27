import { NextResponse } from 'next/server';
import { agroBotsData } from '@/data/farmData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const robotId = searchParams.get('robotId') || 'AGB-02';
  const robot = agroBotsData.find((b) => b.id === robotId) || agroBotsData[1];

  const readings = [
    {
      timestamp: new Date().toISOString(),
      gps: robot.gps,
      battery: robot.battery,
      speed: robot.speed,
      temperature: robot.telemetry.motorTemp,
      soilMoisture: 42,
      flowRate: 14.2,
      subsystems: robot.subsystems,
      slam: robot.slam,
    },
  ];

  return NextResponse.json({
    robotId,
    readings,
  });
}
