import { NextRequest, NextResponse } from 'next/server';
import { uploadMediaFile } from '@/lib/media/service';
import { createAdminClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// Актуальный список категорий, соответствующий вашему types.ts и БД
const ALLOWED_CATEGORIES = [
  'video', 
  'photo', 
  'partner', 
  'award', 
  'project', 
  'news', 
  'logo', 
  'header', 
  'footer', 
  'film-reserve' // Добавлена новая категория
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    const title = formData.get('title') as string || file.name;
    
    // Получаем категорию из формы.
    let category = formData.get('category') as string;
    
    // Если категория не входит в список разрешенных — ставим 'photo' по умолчанию
    if (!ALLOWED_CATEGORIES.includes(category)) {
      category = 'photo'; 
    }

    // 1. Загрузка в Storage (вызывает сервис с createAdminClient)
    const uploadResult = await uploadMediaFile(file);
    const filePath = uploadResult.data.path;

    // 2. Запись в Базу Данных
    const supabase = await createAdminClient();
    
    const { data: dbData, error: dbError } = await supabase
      .from('media')
      .insert([
        {
          title: title,
          filename: filePath,
          path: filePath,
          bucket: 'media',
          category: category,
          is_visible: true,
          description: '', 
          credits: '',
          position: 0 // Добавлено дефолтное значение для исключения ошибок NOT NULL
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Ошибка записи в БД:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Очищаем кэш, чтобы новые медиа появились в админке сразу
    revalidatePath('/admin/media');
    
    return NextResponse.json({ data: dbData }, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка API:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}