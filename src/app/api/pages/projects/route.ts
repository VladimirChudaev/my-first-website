import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'projects')
    .order('position', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const json = await request.json();
    
    // Извлекаем данные
    const { id, title, body, bg_color } = json;

    console.log('API PATCH RECEIVED:', { id, title, bodyLength: body?.length });

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // ВАЖНО: Убрали updated_at, так как колонки нет в таблице
    const updateData: any = {
      title: title?.trim() || null,
      body: body || null, // Сохраняем чистый HTML из редактора
      bg_color: bg_color || null,
    };

    const { data, error } = await supabase
      .from('page_content')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('DATABASE ERROR:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('SERVER ERROR:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}