import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const bodyData = await req.json();

    // Добавляем is_visible в деструктуризацию
    const { title, slug, body, cover_image_id, created_at, is_visible } = bodyData;

    if (!cover_image_id) {
      return NextResponse.json({ error: 'Необходимо выбрать обложку' }, { status: 400 });
    }

    // Теперь используем переменную is_visible, которую прислал фронтенд
    const { data: newsRow, error: newsError } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        body,
        // Если флаг не передан, по умолчанию ставим false (черновик) для безопасности
        is_visible: is_visible ?? false, 
        cover_image_id: cover_image_id,
        created_at: created_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (newsError) {
      console.error('Ошибка вставки новости:', newsError);
      return NextResponse.json({ error: newsError.message }, { status: 400 });
    }

    return NextResponse.json({ data: newsRow }, { status: 201 });
  } catch (error) {
    console.error('Ошибка API новостей:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}