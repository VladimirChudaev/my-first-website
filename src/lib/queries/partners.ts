import { createClient } from '@/lib/server';

export async function getPartners() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('getPartners error:', error);
    return [];
  }

  return data ?? [];
}
