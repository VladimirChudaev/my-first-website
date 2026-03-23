import { createClient } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Удаление видео-проекта из карусели
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // В новых версиях Next.js params — это Promise, его нужно дождаться
    const { id } = await params;
    const supabase = await createClient(); 

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
    console.error('Catch error during DELETE:', err);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

/**
 * Получение данных одного проекта
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient(); 
    
    const { data, error } = await supabase
      .from('video_projects')
      .select(`*, media:media_id (*)`)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Catch error during GET:', err);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}