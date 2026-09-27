import { NextResponse } from 'next/server';
import { govtSchemesData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    schemes: govtSchemesData,
    summary: {
      total: govtSchemesData.length,
      eligible: govtSchemesData.filter((s) => s.eligibilityStatus === 'Eligible' || s.eligibilityStatus === 'Active Enrolled').length,
      documentsPending: govtSchemesData.filter((s) => s.applicationStatus === 'Documents Pending').length,
      approved: govtSchemesData.filter((s) => s.applicationStatus === 'Approved').length,
    },
  });
}
