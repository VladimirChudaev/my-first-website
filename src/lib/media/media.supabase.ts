import { createClient } from '@/lib/client';
import { MediaAsset, MediaDomain } from './types';

const BUCKET = 'media';

// Внутренняя реализация для получения медиа по домену
async function getMediaByDomainSupabase(domain: MediaDomain): Promise<MediaAsset[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('domain', domain)
    .order('id');

  if (error) {
    console.warn(`Error fetching media assets for domain "${domain}":`, error);
    return []; // Возвращаем пустой массив при ошибке, чтобы приложение продолжало работать
  }

  return data.map(item => ({
    id: item.id,
    domain: item.domain as MediaDomain,
    filename: item.filename,
    path: item.path,
    alt: item.alt,
    width: item.width,
    height: item.height,
    order: item.position ?? 0,
  }));
}

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  return getMediaByDomainSupabase(domain);
}

export async function getMediaUrl(path: string): Promise<string> {
  const supabase = createClient();
  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
