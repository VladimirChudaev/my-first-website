import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Выбираем ключ, который не пустой
  const supabaseKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Проверка на наличие критических данных перед инициализацией
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing. Check your .env file.');
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}