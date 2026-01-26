// lib/content/ContentMediaService.ts

import { createClient } from '@/lib/server';
import { MediaAsset } from '@/lib/media/types';

export class ContentMediaService {
  async list(contentId: string): Promise<MediaAsset[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('content_media')
      .select(
        `
        media:media_id (
          id,
          category,
          filename,
          path,
          alt_text,
          url,
          title,
          link,
          position,
          width,
          height,
          is_visible
        )
      `
      )
      .eq('content_id', contentId)
      .order('position', { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row: any) => row.media);
  }

  async attach(contentId: string, mediaId: string, position = 0): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from('content_media').insert({
      content_id: contentId,
      media_id: mediaId,
      position,
    });

    if (error) throw error;
  }

  async detach(contentId: string, mediaId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('content_media')
      .delete()
      .eq('content_id', contentId)
      .eq('media_id', mediaId);

    if (error) throw error;
  }

  async reorder(
    contentId: string,
    items: { mediaId: string; position: number }[]
  ): Promise<void> {
    const supabase = await createClient();

    const updates = items.map((item) => ({
      content_id: contentId,
      media_id: item.mediaId,
      position: item.position,
    }));

    const { error } = await supabase
      .from('content_media')
      .upsert(updates, { onConflict: 'content_id,media_id' });

    if (error) throw error;
  }
}
