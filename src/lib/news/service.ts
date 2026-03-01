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
    console.error('getNewsList error:', error.message);
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
    .maybeSingle();

  if (error) {
    console.error('getNewsById error:', error.message);
    return { data: null };
  }

  return { data: data ? normalizeMedia(data) : null };
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Получение новости и навигации (ленты)
 * Добавлена поддержка декодирования кириллических slug
 */
export async function getNewsBySlug(slug: string) {
  try {
    const supabase = await createClient();

    // Декодируем slug (исправляет проблему 404 при использовании кириллицы в URL)
    const decodedSlug = decodeURIComponent(slug);

    // 1. Запрос основной новости
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
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) {
      console.error('DATABASE ERROR in getNewsBySlug:', {
        message: error.message,
        details: error.details,
        code: error.code
      });
      return { data: null, navigation: null };
    }

    if (!data) {
      console.warn(`NOTICE: News with slug "${decodedSlug}" not found.`);
      return { data: null, navigation: null };
    }

    const newsItem = normalizeMedia(data);

    // 2. Запрос навигации (лента: назад/вперед)
    let navigation = { prev: null, next: null };

    try {
      const { data: adjacentNews, error: rpcError } = await supabase
        .rpc('get_adjacent_news', { 
          current_created_at: newsItem.created_at 
        });

      if (rpcError) {
        console.error('NAVIGATION RPC ERROR:', rpcError.message);
      } else if (adjacentNews) {
        navigation = {
          prev: adjacentNews.find((item: any) => item.type === 'prev') || null,
          next: adjacentNews.find((item: any) => item.type === 'next') || null
        };
      }
    } catch (navErr) {
      console.error('CRITICAL NAVIGATION FAILURE:', navErr);
    }

    return { 
      data: newsItem, 
      navigation: navigation 
    };

  } catch (globalErr) {
    console.error('UNEXPECTED SYSTEM ERROR:', globalErr);
    return { data: null, navigation: null };
  }
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