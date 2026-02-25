import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

// Обновленный тип для соответствия стандартам Next.js 15/16
type RouteParams = Promise<{
  slug: string;
  [key: string]: string | string[] | undefined;
}>;

export async function GET(
  _req: NextRequest,
  context: { params: RouteParams }
) {
  try {
    // В новых версиях Next.js params — это Promise, который нужно дождаться
    const { slug } = await context.params;
    const supabase = await createClient();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Запрос к БД
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