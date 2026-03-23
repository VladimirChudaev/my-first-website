import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

/**
 * Удаление видео-проекта из карусели
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ДОБАВЛЯЕМ await ТУТ
    const supabase = await createClient(); 
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID не указан' }, { status: 400 });
    }

    const { error } = await supabase
      .from('video_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ошибка при удалении видео-проекта:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

/**
 * Получение данных одного проекта
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // И ДОБАВЛЯЕМ await ТУТ
  const supabase = await createClient(); 
  
  const { data, error } = await supabase
    .from('video_projects')
    .select(`*, media:media_id (*)`)
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}