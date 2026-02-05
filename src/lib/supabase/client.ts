import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('--- [Supabase Client] ВНИМАНИЕ: Ключи не найдены в process.env! ---');
}

export const supabase = createBrowserClient(
  supabaseUrl!,
  supabaseKey!
)

export function createClient() {
  return supabase;
}