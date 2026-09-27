import { NextResponse } from 'next/server';
import { agroBotsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    robots: agroBotsData,
  });
}
