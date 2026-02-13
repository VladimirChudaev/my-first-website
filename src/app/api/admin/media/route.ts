import { NextRequest, NextResponse } from 'next/server';
import { updateMedia, getMediaList, createMedia } from '@/lib/media/service';
import { revalidatePath } from 'next/cache';

// Принудительно отключаем кэширование на уровне сегмента API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const result = await getMediaList();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createMedia(body);
    
    revalidatePath('/admin/media');
    revalidatePath('/');
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Читаем тело запроса
    const body = await req.json();
    
    // ЛОГ ДЛЯ ПРОВЕРКИ В ТЕРМИНАЛЕ (серверный лог)
    console.log('--- API PATCH INCOMING ---');
    console.log('ID:', body.id);
    console.log('Payload:', body);

    if (!body.id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Вызываем сервис обновления
    const data = await updateMedia(body.id, body);
    
    if (!data) {
      throw new Error('Service returned no data after update');
    }

    // Очищаем кэш Next.js (обязательно для клиент-серверной модели)
    revalidatePath('/admin/media');
    revalidatePath(`/admin/media/${body.id}`);
    revalidatePath('/', 'layout');

    return NextResponse.json({ 
      success: true, 
      data,
      updatedAt: new Date().toISOString() 
    });

  } catch (error: any) {
    // Выводим детальную ошибку в терминал VS Code
    console.error('--- API PATCH CRITICAL ERROR ---');
    console.error(error);
    
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}