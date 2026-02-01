import { NextRequest, NextResponse } from 'next/server';
import {
  getPagesList,
  createPage,
} from '@/lib/pages/service';

export async function GET() {
  const result = await getPagesList();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createPage(body);
  return NextResponse.json(result, { status: 201 });
}
