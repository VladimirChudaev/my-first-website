import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encodedPath = searchParams.get('path');

  if (!encodedPath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  // Декодируем путь, так как он может быть закодирован
  const path = decodeURIComponent(decodeURIComponent(encodedPath));

  try {
    console.log('Supabase API route called with path:', path);
    
    // Проверяем, установлены ли переменные окружения
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error - missing Supabase credentials' }, { status: 500 });
    }
    
    const supabase = createClient();

    // Путь к файлу в Supabase Storage формируется как 'category/filename.png'
    // где category - это доменная категория (video, photo, etc.)
    // и все файлы хранятся в бакете 'media'
    const bucketName = 'media';
    const fileNameWithCategory = path.startsWith('/') ? path.substring(1) : path;
    const fileName = fileNameWithCategory.split('/').pop(); // Извлекаем только имя файла

    if (!fileName) {
      console.error('Could not extract filename from path:', fileNameWithCategory);
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }
    
    console.log(`Attempting to download file from bucket: ${bucketName}, filename: ${fileName}`);
    
    // Получаем файл из Supabase Storage напрямую
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from(bucketName) // Используем фиксированный бакет 'media'
      .download(fileName);

    if (fileError) {
      console.error('Error downloading file from Supabase:', fileError);
      console.error(`File not found: ${fileName} in bucket: ${bucketName}`);
      
      // Проверяем, связано ли это с правами доступа
      if (fileError.name === 'AuthApiError' || fileError.message.includes('permission') || fileError.message.includes('access')) {
        console.error('Access rights issue detected - check Supabase storage policies');
        return NextResponse.json({ error: 'Access denied - check storage policies' }, { status: 403 });
      }
      
      return NextResponse.json({ error: 'Could not download file from storage' }, { status: 404 });
    }

    if (!fileData) {
      console.error(`Received null data for file: ${fileName} in bucket: ${bucketName}`);
      return NextResponse.json({ error: 'File data is null' }, { status: 404 });
    }

    // Получаем тип контента файла
    let contentType = fileData.type || 'application/octet-stream';

    // Добавляем явное определение типа контента по расширению файла
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    switch (fileExtension) {
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      default:
        // Используем тип, полученный от Supabase, или по умолчанию
        break;
    }
    console.log(`Successfully downloaded file: ${fileName}, content type: ${contentType}`);
    
    // Возвращаем содержимое файла как ответ
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Кэширование на 1 год
      },
    });
  } catch (error) {
    console.error('Error retrieving media file from Supabase:', error);
    return NextResponse.json({ error: 'Failed to retrieve media file' }, { status: 500 });
  }
}