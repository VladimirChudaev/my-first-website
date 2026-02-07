import { createClient } from '@/lib/client';

export const ProjectsService = {
  async getProjectsWithMedia() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', 'project')
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.alt_text || '', // Добавляем, чтобы не было ошибки типа
      author: '',                       // Добавляем заглушку для типа Project
      filename: item.filename || '', 
      imageUrl: item.url || '',      
      position: item.position
    }));
  }
};