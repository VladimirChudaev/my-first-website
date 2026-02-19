import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

type RouteParams = {
  slug: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Делаем запрос напрямую, используя новую структуру связей с media
    const { data: newsItem, error } = await supabase
      .from('news')
      .select(`
        *,
        media:cover_image_id (
          id,
          path,
          bucket
        )
      `)
      .eq('slug', slug)
      .single();

    if (error || !newsItem) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    if (!newsItem.is_visible) {
      return NextResponse.json({ error: 'News is not published' }, { status: 403 });
    }

    return NextResponse.json({ data: newsItem });
  } catch (error) {
    console.error('Error in public news slug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}