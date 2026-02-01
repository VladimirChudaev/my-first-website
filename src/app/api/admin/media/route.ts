import { NextRequest, NextResponse } from 'next/server';
import {
  getMediaList,
  createMedia,
} from '@/lib/media/service';

export async function GET() {
  const result = await getMediaList();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createMedia(body);
  return NextResponse.json(result, { status: 201 });
}
