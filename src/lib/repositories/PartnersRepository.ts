// src/lib/repositories/PartnersRepository.ts
import { supabase } from '@/lib/supabase/client';

export interface PartnerRecord {
  id: string;
  name: string;
  url: string | null;
  media_id: string | null;
  position: number;
  is_visible: boolean;
  created_at: string;
}

export class PartnersRepository {
  static async getVisible(): Promise<PartnerRecord[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  static async getAll(): Promise<PartnerRecord[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  static async create(payload: Omit<PartnerRecord, 'id' | 'created_at'>): Promise<PartnerRecord> {
    const { data, error } = await supabase
      .from('partners')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(
    id: string,
    payload: Partial<Omit<PartnerRecord, 'id' | 'created_at'>>
  ): Promise<PartnerRecord> {
    const { data, error } = await supabase
      .from('partners')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) throw error;
  }
}
