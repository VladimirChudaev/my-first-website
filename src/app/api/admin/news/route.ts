import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const body = formData.get('body') as string;
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    // Путь внутри бакета 'media' остается 'news/...' для организации файлов
    const path = `news/${fileName}`;

    // 1️⃣ Загрузка в бакет 'media'
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    // 2️⃣ Создаем запись в таблице media (центральное хранилище)
    const { data: mediaRow, error: mediaError } = await supabase
      .from('media')
      .insert({
        filename: fileName,
        path,
        category: 'news',
        bucket: 'media',
      })
      .select()
      .single();

    if (mediaError || !mediaRow) {
      return NextResponse.json({ error: 'Media record creation failed' }, { status: 400 });
    }

    // 3️⃣ Связываем новость с созданным ID из таблицы media
    const { data: newsRow, error: newsError } = await supabase
      .from('news')
      .insert({
        title,
        slug,
        body,
        is_visible: true,
        cover_image_id: mediaRow.id,
      })
      .select()
      .single();

    if (newsError) {
      return NextResponse.json({ error: newsError.message }, { status: 400 });
    }

    return NextResponse.json({ data: newsRow }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}