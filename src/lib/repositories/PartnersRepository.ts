// src/lib/repositories/PartnersRepository.ts
import { supabase } from '@/lib/supabase/client';

export class PartnersRepository {
  static async getVisiblePartners() {
    const { data, error } = await supabase
      .from('partners')
      .select(`
        id,
        name,
        url,
        position,
        is_visible,
        media:media_id (
          path,
          bucket
        )
      `)
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }
}