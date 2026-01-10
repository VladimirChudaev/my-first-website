import { createClient } from './client'

export const getMediaUrl = (filename: string): string => {
  const supabase = createClient()
  return supabase.storage
    .from('media')
    .getPublicUrl(filename)
    .data.publicUrl
}