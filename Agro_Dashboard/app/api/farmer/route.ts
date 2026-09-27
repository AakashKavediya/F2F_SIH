import { NextResponse } from 'next/server';
import { farmerData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: process.env.NEXT_PUBLIC_API_MODE || 'mock',
    data: farmerData,
  });
}
