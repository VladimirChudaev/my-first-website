import { createClient } from '@/lib/client';
import { VideoProject, CreateVideoProjectInput, UpdateVideoProjectInput } from './types';

const supabase = createClient();

// Получаем все видео для карусели (с данными обложек)
export async function getVideoProjects(): Promise<VideoProject[]> {
  const { data, error } = await supabase
    .from('video_projects')
    .select(`
      *,
      media:media_id (*)
    `)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching video projects:', error);
    return [];
  }
  return data || [];
}

// Добавить новый проект
export async function insertVideoProject(input: CreateVideoProjectInput) {
  return await supabase.from('video_projects').insert([input]);
}

// Обновить существующий
export async function updateVideoProject(id: string, updates: UpdateVideoProjectInput) {
  return await supabase.from('video_projects').update(updates).eq('id', id);
}

// Удалить
export async function deleteVideoProject(id: string) {
  return await supabase.from('video_projects').delete().eq('id', id);
}