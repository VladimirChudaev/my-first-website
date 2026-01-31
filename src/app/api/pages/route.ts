import { NextResponse } from 'next/server';
import { getPagesList } from '@/lib/pages/service';

export async function GET() {
  const result = await getPagesList();
  return NextResponse.json(result);
}
