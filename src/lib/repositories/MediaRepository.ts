// src/lib/repositories/MediaRepository.ts
import { createClient } from '@/lib/client';
import { MediaAsset, MediaDomain } from '../media/types';

export class MediaRepository {
  // Название бакета из вашего SQL: 'media'
  private static BUCKET = 'media';

  static async findByCategory(category: MediaDomain): Promise<MediaAsset[]> {
    const supabase = createClient();
    
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

  // Получить все файлы для админки
  static async getAll(): Promise<MediaAsset[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MediaAsset[];
  }

  // Обновить поля (например, категорию)
  static async update(id: string, data: Partial<MediaAsset>): Promise<MediaAsset> {
    const supabase = createClient();
    const { data: result, error } = await supabase
      .from('media')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as MediaAsset;
  }

  // Удалить запись
  static async delete(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}