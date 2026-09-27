import { NextResponse } from 'next/server';
import { taskItemsData } from '@/data/farmData';

export async function GET() {
  return NextResponse.json({
    mode: 'mock',
    tasks: taskItemsData,
    summary: {
      total: taskItemsData.length,
      completed: taskItemsData.filter((t) => t.status === 'Completed').length,
      pending: taskItemsData.filter((t) => t.status === 'Pending').length,
      inProgress: taskItemsData.filter((t) => t.status === 'In Progress').length,
      aiRecommended: taskItemsData.filter((t) => t.aiRecommended).length,
    },
  });
}
