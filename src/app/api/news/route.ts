import { NextResponse } from 'next/server';
import { getNewsList } from '@/lib/news/service';

/**
 * GET /api/news
 * Возвращает список только опубликованных новостей для публичного сайта
 */
export async function GET() {
  try {
    // Используем обновленный getNewsList, который корректно тянет медиа
    const result = await getNewsList();

    // Фильтруем данные, оставляя только те, где is_visible === true
    const visibleNews = (result.data || []).filter(item => item.is_visible);

    return NextResponse.json({
      data: visibleNews
    });
  } catch (error) {
    console.error('Public News API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}