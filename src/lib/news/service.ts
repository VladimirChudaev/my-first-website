import { createClient } from '@/lib/server'; // Исправленный путь
import { NewsItem, CreateNewsInput, UpdateNewsInput } from './types';

/* PUBLIC */

/**
 * Получение только видимых новостей для сайта
 */
export async function getVisibleNews(): Promise<{ data: NewsItem[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching visible news:', error);
    return { data: [] };
  }
  return { data: data || [] };
}

/* ADMIN & COMMON */

/**
 * Получение всех новостей (для админки)
 */
export async function getNewsList(): Promise<{ data: NewsItem[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news list:', error);
    return { data: [] };
  }
  return { data: data || [] };
}

export async function getNewsById(id: string): Promise<{ data: NewsItem | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null };
  return { data };
}

export async function getNewsBySlug(slug: string): Promise<{ data: NewsItem | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return { data: null };
  return { data };
}

/* ADMIN (CRUD) */

export async function createNews(input: CreateNewsInput): Promise<{ data: NewsItem | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    return { data: null };
  }
  return { data };
}

export async function updateNews(id: string, input: UpdateNewsInput): Promise<{ data: NewsItem | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news:', error);
    return { data: null };
  }
  return { data };
}

export async function deleteNews(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    return { success: false };
  }
  return { success: true };
}

/* ADMIN aliases */
export { updateNews as updateNewsById, deleteNews as deleteNewsById };