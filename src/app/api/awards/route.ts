import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

type AwardRow = {
  id: string;
  title: string;
  festival: string;
  status: string | null;
  description: string | null;
  position: number;
  is_visible: boolean;
  media_id: string | null;
};

type MediaRow = {
  id: string;
  filename: string;
};

export async function GET() {
  const supabase = await createClient();

  const { data: awards, error: awardsError } = await supabase
    .from('awards')
    .select('*')
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (awardsError) {
    console.error('Awards fetch error:', awardsError);
    return NextResponse.json(
      { error: awardsError.message },
      { status: 500 }
    );
  }

  const mediaIds = (awards as AwardRow[])
    .map((a) => a.media_id)
    .filter(Boolean) as string[];

  let mediaMap = new Map<string, string>();

  if (mediaIds.length) {
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('id, filename')
      .in('id', mediaIds);

    if (mediaError) {
      console.error('Media fetch error:', mediaError);
      return NextResponse.json(
        { error: mediaError.message },
        { status: 500 }
      );
    }

    (media as MediaRow[]).forEach((m) => {
      mediaMap.set(m.id, m.filename);
    });
  }

  const enriched = (awards as AwardRow[]).map((award) => {
    let imageUrl: string | null = null;

    if (award.media_id && mediaMap.has(award.media_id)) {
      const filename = mediaMap.get(award.media_id)!;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

      imageUrl = data.publicUrl;
    }

    return {
      id: award.id,
      title: award.title,
      festival: award.festival,
      status: award.status,
      description: award.description,
      position: award.position,
      is_visible: award.is_visible,
      image_url: imageUrl,
    };
  });

  return NextResponse.json({ data: enriched });
}
