import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug } from '@/lib/news/service';

// Определяем тип строго под имя папки [slug]
type RouteParams = {
  slug: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const result = await getNewsBySlug(slug);

    if (!result.data) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    if (!result.data.is_visible) {
      return NextResponse.json({ error: 'News is not published' }, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in public news slug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}