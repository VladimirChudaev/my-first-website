import { createClient } from '@/lib/supabase/client'

export async function getPartners() {
  const supabase = createClient() // ← ВАЖНО: ВЫЗОВ

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('position')

  if (error) {
    throw error
  }

  return data
}
