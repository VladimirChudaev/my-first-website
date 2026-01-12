import { createClient } from '@/lib/client';
import { MediaAsset, MediaDomain } from './types';

const BUCKET = 'media';

export type { MediaDomain };

export async function getMediaUrl(path: string): Promise<string> {
  const supabase = createClient();
  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('domain', domain)
      .order('created_at');

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`Table 'media_assets' not found or error occurred, using fallback for domain '${domain}':`, error);
    // Fallback: возвращаем пустой массив или используем альтернативный источник данных
    return [];
  }
}

export async function getMediaMap(domain: MediaDomain): Promise<Record<string, string>> {
  const assets = await getMediaByDomain(domain);

  const map: Record<string, string> = {};
  for (const asset of assets) {
    map[asset.filename] = await getMediaUrl(asset.path);
  }
  return map;
}