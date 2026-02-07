import { createClient } from '@/lib/client'

export interface PartnerRecord {
  id: string;
  name: string;
  url: string | null;
  position: number;
  is_visible: boolean;
  media_id: string | null;
  created_at?: string;
}

export class PartnersRepository {
  static async getAll(): Promise<PartnerRecord[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('[PartnersRepository] Error in getAll:', error.message);
      throw error;
    }
    return data || [];
  }

  static async getVisible(): Promise<PartnerRecord[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('[PartnersRepository] Error in getVisible:', error.message);
      throw error;
    }
    return data || [];
  }

  static async create(payload: Partial<PartnerRecord>): Promise<PartnerRecord> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('partners')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[PartnersRepository] Error in create:', error.message);
      throw error;
    }
    return data;
  }

  static async update(id: string, payload: Partial<PartnerRecord>): Promise<PartnerRecord> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('partners')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PartnersRepository] Error in update:', error.message);
      throw error;
    }
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[PartnersRepository] Error in delete:', error.message);
      throw error;
    }
  }
}