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
      console.error('Ошибка при загрузке проектов:', error);
      return [];
    }

    // Возвращаем чистые данные. 
    // Маппинг под конкретные карточки (imageUrl, автор и т.д.) 
    // лучше делать уже там, где данные потребляются.
    return data || [];
  }
};