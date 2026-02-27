import { createClient } from '@/lib/server';
import { NewsItem } from './types';

// Чистая нормализация: убираем [0], так как теперь это объект, а не массив
function normalizeMedia(item: any): NewsItem {
  return {
    ...item,
    media: item.media ?? null,
  };
}

export async function getNewsList() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      body,
      is_visible,
      created_at,
      cover_image_id,
      media:cover_image_id (
        id,
        path,
        bucket
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getNewsList error:', error);
    return { data: [] };
  }

  return { data: (data || []).map(normalizeMedia) };
}

export async function getNewsById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      body,
      is_visible,
      created_at,
      cover_image_id,
      media:cover_image_id (
        id,
        path,
        bucket
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('getNewsById error:', error);
    return { data: null };
  }

  return { data: data ? normalizeMedia(data) : null };
}

// Новая функция для получения новости по SLUG (для публичного сайта)
export async function getNewsBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      body,
      is_visible,
      created_at,
      cover_image_id,
      media:cover_image_id (
        id,
        path,
        bucket
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('getNewsBySlug error:', error);
    return { data: null };
  }

  return { data: data ? normalizeMedia(data) : null };
}

export async function createNews(payload: Partial<NewsItem>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('news').insert([payload]).select().single();
  if (error) return { data: null };
  return { data };
}

export async function updateNewsById(id: string, payload: Partial<NewsItem>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('news').update(payload).eq('id', id).select().single();
  if (error) return { data: null };
  return { data };
}

export async function deleteNewsById(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('news').delete().eq('id', id);
  return { success: !error };
}