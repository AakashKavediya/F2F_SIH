import { NextResponse } from 'next/server';
import { farmData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: process.env.NEXT_PUBLIC_API_MODE || 'mock',
    data: farmData,
  });
}
