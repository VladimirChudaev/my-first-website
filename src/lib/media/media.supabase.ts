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
    .select('*')
    .eq('category', domain)
    .eq('is_visible', true)
    .order('position', { ascending: direction === 'asc' });

  if (error || !data) {
    console.warn(`[media.supabase] ${domain}`, error);
    return [];
  }

  return data.map(mapMediaRow);
}

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  return getMediaByDomainInternal(domain, 'asc');
}

export async function getMediaUrl(path: string): Promise<string> {
  const supabase = createClient();
  
  const { data } = await supabase
    .storage
    .from('media')
    .getPublicUrl(path);
    
  return data.publicUrl;
}

// Алиасы для соответствия архитектуре "единого источника истины"
export {
  getMediaByDomain as getMediaByDomainSupabase,
  getMediaUrl as getMediaUrlSupabase
};
