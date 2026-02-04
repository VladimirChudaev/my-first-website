import { createClient } from '@/lib/server';

export async function getPartners() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('partners')
    .select(`
      id,
      name,
      url,
      position,
      media:media_id (
        url,
        alt_text
      )
    `)
    .eq('is_visible', true)
    .order('position', { ascending: true });

  if (error) throw error;

  return data;
}
