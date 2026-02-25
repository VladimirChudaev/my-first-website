import { createClient } from '@/lib/server';

export class PageContentRepository { // Добавлено слово export
  static async getByPage(page: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async update(id: string, updates: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_content')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  static async createMany(inserts: any[]) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_content')
      .insert(inserts);

    if (error) throw error;
    return data;
  }
}