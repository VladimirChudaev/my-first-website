import { createClient } from '@/lib/client';

export const ProjectsService = {
  async getProjectsWithMedia() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('media') // Твоя основная таблица
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    // Возвращаем плоский массив, без всяких выдуманных категорий
    return data.map(item => ({
      id: item.id,
      title: item.title || 'Без названия',
      description: item.description || '',
      author: item.author || '',
      imageUrl: item.path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.path}` : '/placeholder.png',
      category: item.category
    }));
  }
};