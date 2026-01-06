import { createBrowserClient } from '@supabase/ssr'

// Мы экспортируем именно функцию createClient, 
// которую ищут твои компоненты
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}