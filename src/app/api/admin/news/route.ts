import { NextRequest, NextResponse } from 'next/server';
import {
  getNewsList,
  createNews,
} from '@/lib/news/service';

export async function GET() {
  const result = await getNewsList();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createNews(body);
  return NextResponse.json(result, { status: 201 });
}
