import { createClient } from '@/lib/client';

export const ProjectsService = {
  async getProjectsWithMedia() {
    const supabase = createClient();
    try {
      const { data: items, error } = await supabase
        .from('media')
        .select('*')
        .eq('category', 'project')
        .eq('is_visible', true);

      if (error) throw error;

      const formatted = (items || []).map(item => {
        const { data } = supabase.storage
          .from(item.bucket || 'media')
          .getPublicUrl(item.path || item.filename);

        const isBusiness = item.filename.startsWith('b_');

        return {
          id: item.id,
          // Если title пустой, используем имя файла без расширения
          title: item.title || item.filename.split('.')[0].replace(/^[a-z]_/, ''), 
          // Заглушка для описания, пока нет данных в базе
          description: item.alt_text || "Описание проекта будет добавлено через административную панель для раскрытия творческого замысла.", 
          // Если автор пуст, ставим заглушку
          author: isBusiness ? (item.title || 'Корпоративный проект') : (item.link || 'Автор не указан'), 
          imageUrl: data.publicUrl,
          filename: item.filename
        };
      });

      return {
        art: formatted.filter(p => p.filename.startsWith('h_')),
        documentary: formatted.filter(p => p.filename.startsWith('d_')),
        tv: formatted.filter(p => p.filename.startsWith('t_')),
        business: formatted.filter(p => p.filename.startsWith('b_'))
      };
    } catch (e: any) {
      console.error('ProjectsService Error:', e.message || e);
      return { art: [], documentary: [], tv: [], business: [] };
    }
  }
};