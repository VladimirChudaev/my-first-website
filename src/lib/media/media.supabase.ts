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
    .is('is_visible', true)
    .order('position', { ascending: true });

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

export async function insertMedia(mediaData: Omit<MediaAsset, 'id'> & { id?: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media')
    .insert([{
      id: mediaData.id,
      category: mediaData.category,
      filename: mediaData.filename,
      bucket: 'media',
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

  return mediaToDelete.path;
}

export async function updateMediaOrder(category: MediaDomain, orderedIds: string[]) {
  const supabase = createClient();
  // Реализация временно отсутствует
}

// ИСПРАВЛЕНО: Возвращаем прямой публичный URL Supabase Storage вместо прокси-роута
export async function getMediaUrl(path: string): Promise<string> {
  if (!path) {
    throw new Error('Path is required for getMediaUrl');
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
  }
  
  // Убедимся, что путь корректен - если он начинается с '/', удалим его
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Если путь уже содержит бакет (например, 'media/project/filename.png'), 
  // используем его как есть. Если нет, добавляем бакет 'media'
  const bucket = process.env.SUPABASE_BUCKET_NAME || 'media';
  const fullPath = normalizedPath.startsWith(`${bucket}/`) 
    ? normalizedPath 
    : `${bucket}/${normalizedPath}`;
  
  // Прямой публичный URL Supabase Storage
  return `${supabaseUrl}/storage/v1/object/public/${fullPath}`;
}

// Алиасы для соответствия архитектуре
export {
  getMediaByDomain as getMediaByDomainSupabase,
  getMediaUrl as getMediaUrlSupabase,
  getMediaById as getMediaByIdSupabase,
  insertMedia as insertMediaSupabase,
  updateMedia as updateMediaSupabase,
  deleteMedia as deleteMediaSupabase,
  updateMediaOrder as updateMediaOrderSupabase
};