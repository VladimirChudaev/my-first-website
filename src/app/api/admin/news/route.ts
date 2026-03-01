import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Получаем JSON данные из тела запроса
    const bodyData = await req.json();

    // Добавили created_at в деструктуризацию, чтобы принимать дату из формы
    const { title, slug, body, cover_image_id, created_at } = bodyData;

    if (!cover_image_id) {
      return NextResponse.json({ error: 'Необходимо выбрать обложку' }, { status: 400 });
    }

    // Создаем запись, включая поле created_at
    const { data: newsRow, error: newsError } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        body,
        is_visible: true,
        cover_image_id: cover_image_id,
        // Если дата передана из формы — используем её, если нет — ставим текущую
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