import { createClient } from '@/lib/supabase/client';

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
        alt_text,
        bucket
      )
    `)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (error || !data) {
    console.error('getPartners error:', error);
    return [];
  }

  return data.map((p: any) => {
    const media = Array.isArray(p.media) ? p.media[0] : null;

    return {
      id: p.id,
      name: p.name,
      url: p.url,
      position: p.position,
      media: media
        ? [
            {
              url: supabase.storage
                .from(media.bucket)
                .getPublicUrl(media.path).data.publicUrl,
              alt_text: media.alt_text ?? p.name,
            },
          ]
        : [],
    };
  });
}
