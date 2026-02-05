import { supabase } from '../supabase/client';

export class MediaService {
  // 1. Метод для формирования URL (используется в Партнерах)
  static getPublicUrl(path: string | null, bucket: string = 'media'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  // 2. Исправленный метод для Проектов и Каруселей (теперь ищет по category)
  static async getByDomain(domainValue: string) {
    console.log('--- [MediaService] Запрос медиа для категории:', domainValue);
    
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', domainValue); // Заменили domain на category

    if (error) {
      console.error('--- [MediaService] Сбой запроса к Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      return [];
    }

    console.log(`--- [MediaService] Успешно найдено объектов (${domainValue}):`, data?.length || 0);
    return data || [];
  }
}

// 3. Экспорт объекта (для совместимости со старым кодом в проектах)
export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue)
};