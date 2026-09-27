import { NextResponse } from 'next/server';
import { alertItemsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    alerts: alertItemsData,
    counts: {
      critical: alertItemsData.filter((a) => a.severity === 'Critical').length,
      warning: alertItemsData.filter((a) => a.severity === 'Warning').length,
      info: alertItemsData.filter((a) => a.severity === 'Information').length,
      resolved: 21,
    },
  });
}
