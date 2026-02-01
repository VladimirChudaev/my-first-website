import { NextRequest, NextResponse } from 'next/server';
import {
  getContentList,
  createContent,
} from '@/lib/content/service';

export async function GET() {
  const result = await getContentList();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createContent(body);
  return NextResponse.json(result, { status: 201 });
}
