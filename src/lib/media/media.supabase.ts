import { createClient } from '@/lib/client';
import { MediaAsset, MediaDomain } from './types';
import { mapMediaRow } from './mapper';

async function getMediaByDomainInternal(
  domain: MediaDomain,
  direction: 'asc' | 'desc' = 'asc'
): Promise<MediaAsset[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media')
    .select('id, filename, bucket, category, alt_text, title, created_at, is_visible, position, url, link, width, height, path')
    .eq('category', domain)
    .is('is_visible', true)  // Только видимые элементы
    .order('position', { ascending: true });  // Сортировка по позиции

  if (error || !data) {
    return [];
  }

  return data.map(mapMediaRow);
}

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  return getMediaByDomainInternal(domain, 'asc');
}

// Функция для получения информации о медиа-файле по ID
async function getMediaById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media')
    .select('id, filename, bucket, category, alt_text, title, created_at, is_visible, position, url, link, width, height')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.warn(`[media.supabase] getMediaById ${id}`, error);
    return null;
  }

  return mapMediaRow(data);
}

// Функция для загрузки нового медиа-файла в базу данных
export async function insertMedia(mediaData: Omit<MediaAsset, 'id'> & { id?: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media')
    .insert([{
      id: mediaData.id,
      category: mediaData.category,
      filename: mediaData.filename,
      bucket: 'media', // все файлы хранятся в бакете 'media'
      alt_text: mediaData.alt_text,
      title: mediaData.title,
      position: mediaData.position ?? 0,
      is_visible: mediaData.is_visible ?? true,
      url: mediaData.url,
      link: mediaData.link,
      width: mediaData.width,
      height: mediaData.height,
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data ? mapMediaRow(data) : null;
}

// Функция для обновления метаданных медиа-файла
export async function updateMedia(id: string, updates: Partial<Omit<MediaAsset, 'id'>>) {
  const supabase = createClient();

  const { error } = await supabase
    .from('media')
    .update({
      alt_text: updates.alt_text,
      title: updates.title,
      url: updates.url,
      link: updates.link,
      width: updates.width,
      height: updates.height,
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }
}

// Функция для удаления медиа-файла из базы данных
export async function deleteMedia(id: string) {
  const supabase = createClient();

  const mediaToDelete = await getMediaById(id);
  if (!mediaToDelete) {
    throw new Error(`Media with id ${id} not found`);
  }

  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Database delete failed: ${error.message}`);
  }

  return mediaToDelete.path; // возвращаем путь для удаления из хранилища
}

// Функция для переупорядочивания медиа-файлов
export async function updateMediaOrder(category: MediaDomain, orderedIds: string[]) {
  const supabase = createClient();

  // В текущей структуре базы данных нет поля position, поэтому функция временно не реализована
}

// ИЗМЕНЕНО: Используем прокси-роут для обхода CORS и получения медиа-файлов из Supabase Storage
export async function getMediaUrl(path: string): Promise<string> {
  if (!path) {
    throw new Error('Path is required for getMediaUrl');
  }
  
  // Убедимся, что путь корректен - если он начинается с '/', удалим его
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  // Путь уже содержит категорию (например, 'video/filename.png'), 
  // поэтому используем его как есть без добавления префикса
  const pathWithBucket = normalizedPath;
  return `/api/supabase?path=${encodeURIComponent(pathWithBucket)}`;
}

// Алиасы для соответствия архитектуре "единого источника истины"
export {
  getMediaByDomain as getMediaByDomainSupabase,
  getMediaUrl as getMediaUrlSupabase,
  getMediaById as getMediaByIdSupabase,
  insertMedia as insertMediaSupabase,
  updateMedia as updateMediaSupabase,
  deleteMedia as deleteMediaSupabase,
  updateMediaOrder as updateMediaOrderSupabase
};