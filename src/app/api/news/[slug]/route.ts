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
    // Ждем получения slug
    const { slug } = await context.params;
    const supabase = await createClient();
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 1. Запрос основной новости
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

    // 2. Запрос навигации (предыдущая и следующая новости)
    // Вызываем SQL функцию, которую мы создали в Supabase
    const { data: adjacentNews } = await supabase
      .rpc('get_adjacent_news', { 
        current_created_at: newsItem.created_at 
      });

    // Формируем объект навигации
    const navigation = {
      prev: adjacentNews?.find((item: any) => item.type === 'prev') || null,
      next: adjacentNews?.find((item: any) => item.type === 'next') || null
    };

    // Возвращаем новость вместе с данными навигации
    return NextResponse.json({ 
      data: newsItem,
      navigation: navigation
    });

  } catch (error) {
    console.error('Error in public news slug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}