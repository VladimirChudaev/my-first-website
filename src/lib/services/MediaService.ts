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
   * Алиас для удобства работы с объектами медиа (используется в PartnersService).
   */
  static getMediaUrl(media: { path: string } | null): string {
    return media ? this.getPublicUrl(media.path) : '/placeholder.png';
  }

  /**
   * Получает список всех медиа-файлов для конкретной категории (domain).
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
   * Загружает файл в Storage и создает запись в таблице media.
   * Обязательно принимает категорию (partner, project и т.д.)
   */
  static async upload(file: File, category: string) {
    // Генерируем уникальное имя файла, чтобы избежать конфликтов
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // 1. Загрузка в Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Создание записи в БД
    const { data: mediaData, error: dbError } = await supabase
      .from('media')
      .insert({
        path: filePath,
        category: category,
        alt_text: file.name
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return mediaData;
  }

  /**
   * Вспомогательный метод для совместимости.
   */
  static async getUrlByFilename(category: string, filename: string) {
    return MediaService.getPublicUrl(`${category}/${filename}`);
  }
}

/**
 * Экспорт объекта для удобного импорта
 */
export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getMediaUrl: (media: { path: string } | null) => MediaService.getMediaUrl(media),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue),
  upload: (file: File, category: string) => MediaService.upload(file, category),
  getUrlByFilename: (category: string, filename: string) => MediaService.getUrlByFilename(category, filename),
};