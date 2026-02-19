import { createAdminClient } from '@/lib/server';

/**
 * Загрузка файла напрямую в корень бакета 'media'
 */
export async function uploadMediaFile(file: File) {
  const supabase = await createAdminClient();
  
  // Генерируем уникальное имя, чтобы избежать проблем с кириллицей в путях
  // и конфликтов одинаковых имен
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  
  // Важно: filePath теперь — это просто имя файла, без префиксов и папок
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true // Если файл с таким именем есть, он обновится
    });

  if (error) {
    console.error('Ошибка Storage:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return { data: { ...data, publicUrl } };
}

/**
 * Получение списка файлов напрямую из корня бакета
 */
export async function getMediaList() {
  const supabase = await createAdminClient();
  
  // Пустая строка '' означает поиск в корне бакета media
  const { data, error } = await supabase.storage
    .from('media')
    .list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Ошибка получения списка:', error);
    throw error;
  }

  // Фильтруем, чтобы не подхватить системные заглушки (если есть)
  return data?.filter(item => item.name !== '.emptyFolderPlaceholder') || [];
}