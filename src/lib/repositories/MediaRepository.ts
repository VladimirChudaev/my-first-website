// src/lib/repositories/MediaRepository.ts
import { createClient } from '@/lib/client';
import { MediaAsset, MediaDomain } from '../media/types';

export class MediaRepository {
  // Название бакета из вашего SQL: 'media'
  private static BUCKET = 'media';

  static async findByCategory(category: MediaDomain): Promise<MediaAsset[]> {
    const supabase = createClient();
    
    // Запрос к таблице media, где хранятся пути и метаданные
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', category)
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) {
      console.error(`[MediaRepository] Error fetching ${category}:`, error.message);
      return [];
    }

    return data as MediaAsset[];
  }
}