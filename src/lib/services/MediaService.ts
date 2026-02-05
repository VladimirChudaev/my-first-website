import { supabase } from '../supabase/client';

export class MediaService {
  /**
   * Формирует публичный URL для изображения из хранилища Supabase.
   */
  static getPublicUrl(path: string | null, bucket: string = 'media'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  /**
   * Получает список всех медиа-файлов для конкретной категории (domain).
   * Используется на странице Проектов и в Каруселях.
   */
  static async getByDomain(domainValue: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', domainValue);

    if (error) {
      console.error('--- [MediaService] Ошибка при получении медиа:', error.message);
      return [];
    }
    return data || [];
  }

  /**
   * Вспомогательный метод для совместимости со старым кодом страницы Проектов.
   */
  static async getUrlByFilename(category: string, filename: string) {
    return MediaService.getPublicUrl(`${category}/${filename}`);
  }
}

/**
 * Экспорт объекта для удобного импорта: import { mediaService } from ...
 */
export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue),
  getUrlByFilename: (category: string, filename: string) => MediaService.getUrlByFilename(category, filename),
};