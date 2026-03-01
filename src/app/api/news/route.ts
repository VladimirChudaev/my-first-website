import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Запрашиваем новости напрямую с JOIN таблицы media
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        cover_image:cover_image_id (
          filename
        )
      `)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      data: data || []
    });
  } catch (error) {
    console.error('Public News API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}