import { NextResponse } from 'next/server';
import { getVisibleNews } from '@/lib/news/service';

/**
 * GET /api/news
 * Возвращает список только опубликованных новостей для публичного сайта
 */
export async function GET() {
  try {
    const result = await getVisibleNews();

    // Если данных нет, возвращаем пустой массив с успешным статусом
    return NextResponse.json({
      data: result.data || []
    });
  } catch (error) {
    console.error('Public News API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}