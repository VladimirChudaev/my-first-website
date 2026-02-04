import { createClient } from '@/lib/supabase/browser'

export async function getPartners() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('partners_view') // или partners
    .select('*')
    .eq('is_visible', true)
    .order('position')

  if (error) {
    console.error('getPartners error', error)
    return []
  }

  return data
}
