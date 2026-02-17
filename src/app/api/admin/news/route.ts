import { NextRequest, NextResponse } from 'next/server';
import { getNewsList, createNews } from '@/lib/news/service';

export async function GET() {
  try {
    const result = await getNewsList();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createNews(body);
    
    if (!result.data) {
      return NextResponse.json({ error: 'Failed to create news' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}