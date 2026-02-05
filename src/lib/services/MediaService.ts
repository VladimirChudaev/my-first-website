import { supabase } from '../supabase/client';

export class MediaService {
  // 1. Основной метод генерации URL
  static getPublicUrl(path: string | null, bucket: string = 'media'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  // 2. Метод, который ищет ВСЕ медиа по категории (для проектов)
  static async getByDomain(domainValue: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', domainValue);

    if (error) {
      console.error('--- [MediaService] Сбой getByDomain:', error.message);
      return [];
    }
    return data || [];
  }

  // 3. ТОТ САМЫЙ НЕДОСТАЮЩИЙ МЕТОД для билда Vercel
  static async getUrlByFilename(category: string, filename: string) {
    // Просто возвращаем URL, используя наш основной метод
    // В Supabase путь обычно складывается как 'category/filename'
    return MediaService.getPublicUrl(`${category}/${filename}`);
  }
}

// Экспорт объекта для страницы Projects
export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue),
  // Добавляем метод в объект экспорта:
  getUrlByFilename: (category: string, filename: string) => MediaService.getUrlByFilename(category, filename)
};