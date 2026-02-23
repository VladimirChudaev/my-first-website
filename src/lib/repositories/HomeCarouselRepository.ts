import { createClient } from '../supabase/browser';

export type HomeCarouselItem = {
  id: string;
  media_id: string;
  position: number;
  is_visible: boolean;
  media?: {
    id: string;
    filename: string;
  } | null;
};

export class HomeCarouselRepository {
  private static supabase = createClient();

  static async getAll(): Promise<HomeCarouselItem[]> {
    const { data, error } = await this.supabase
      .from('home_carousel')
      .select('*, media:media_id(id, filename)')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return (data || []) as HomeCarouselItem[];
  }

  static async create(item: Partial<HomeCarouselItem>) {
    const { data, error } = await this.supabase
      .from('home_carousel')
      .insert([item])
      .select('*, media:media_id(id, filename)') // Сразу подтягиваем медиа при создании
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, item: Partial<HomeCarouselItem>) {
    const { data, error } = await this.supabase
      .from('home_carousel')
      .update(item)
      .eq('id', id)
      .select('*, media:media_id(id, filename)') // Сразу подтягиваем медиа при обновлении
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await this.supabase
      .from('home_carousel')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async reorder(items: { id: string; position: number }[]) {
    // Используем только id и position, чтобы не задеть связи media_id
    const payload = items.map(i => ({ id: i.id, position: i.position }));
    const { error } = await this.supabase
      .from('home_carousel')
      .upsert(payload, { onConflict: 'id' });
    
    if (error) throw error;
    return true;
  }
}