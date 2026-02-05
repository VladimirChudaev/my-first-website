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
    .select(
      'id, filename, bucket, category, alt_text, title, created_at, is_visible, position, url, link, width, height, path'
    )
    .eq('category', domain)
    .is('is_visible', true)
    .order('position', { ascending: true });

  if (error || !data) {
    console.error('[media.supabase] getMediaByDomain', error);
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
    .select(
      'id, filename, bucket, category, alt_text, title, created_at, is_visible, position, url, link, width, height, path'
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.warn(`[media.supabase] getMediaById ${id}`, error);
    return null;
  }

  return mapMediaRow(data);
}

export async function insertMedia(
  mediaData: Omit<MediaAsset, 'id'> & { id?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media')
    .insert([
      {
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
        path: mediaData.path,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data ? mapMediaRow(data) : null;
}

export async function updateMedia(
  id: string,
  updates: Partial<Omit<MediaAsset, 'id'>>
) {
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
      position: updates.position,
      is_visible: updates.is_visible,
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

  const { error } = await supabase.from('media').delete().eq('id', id);

  if (error) {
    throw new Error(`Database delete failed: ${error.message}`);
  }

  return mediaToDelete.path;
}

export async function updateMediaOrder(
  category: MediaDomain,
  orderedIds: string[]
) {
  // TODO: bulk update position
}

/**
 * ЕДИНСТВЕННЫЙ корректный способ получить публичный URL
 * — через Supabase SDK
 */
export async function getMediaUrl(
  path: string,
  bucket = 'media'
): Promise<string> {
  if (!path) {
    throw new Error('Path is required for getMediaUrl');
  }

  const supabase = createClient();

  const normalizedPath = path.startsWith('/')
    ? path.slice(1)
    : path;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(normalizedPath);

  if (!data?.publicUrl) {
    throw new Error(`Failed to resolve public URL for ${bucket}/${path}`);
  }

  return data.publicUrl;
}

/* === Алиасы под архитектуру === */

export {
  getMediaByDomain as getMediaByDomainSupabase,
  getMediaUrl as getMediaUrlSupabase,
  getMediaById as getMediaByIdSupabase,
  insertMedia as insertMediaSupabase,
  updateMedia as updateMediaSupabase,
  deleteMedia as deleteMediaSupabase,
  updateMediaOrder as updateMediaOrderSupabase,
};
