import { createClient } from '@/lib/supabase/client';
import { getMediaUrl } from '@/lib/media/media';

export interface Partner {
  id: string;
  name: string;
  url: string | null;
  position: number;
  media: {
    url: string;
    alt_text: string | null;
  }[];
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('partners')
    .select(`
      id,
      name,
      url,
      position,
      media:media_id (
        path,
        alt_text
      )
    `)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (error || !data) {
    console.error('getPartners error:', error);
    return [];
  }

  const partners = await Promise.all(
    data.map(async (p: any) => {
      const mediaRow = Array.isArray(p.media) ? p.media[0] : null;

      const media = mediaRow?.path
        ? [
            {
              url: await getMediaUrl(mediaRow.path),
              alt_text: mediaRow.alt_text ?? p.name,
            },
          ]
        : [];

      return {
        id: p.id,
        name: p.name,
        url: p.url,
        position: p.position,
        media,
      };
    })
  );

  return partners;
}

