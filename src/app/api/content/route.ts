import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .order('page', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const bodyData = await req.json();

    const { data, error } = await supabase
      .from('page_content')
      .insert({
        title: bodyData.title,
        body: bodyData.body,
        page: bodyData.slug, // Используем slug как идентификатор страницы
        section_key: 'main', // По умолчанию основной блок
        is_visible: bodyData.is_visible,
        // Если в таблице еще нет cover_image_id, Supabase просто проигнорирует это поле
        cover_image_id: bodyData.cover_image_id 
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}