import { supabase } from '../supabase/client';

export class MediaService {
  static getPublicUrl(path: string | null, bucket: string = 'media'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  static async getByDomain(domainValue: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', domainValue);
    if (error) return [];
    return data || [];
  }

  static async getUrlByFilename(category: string, filename: string) {
    return MediaService.getPublicUrl(`${category}/${filename}`);
  }

  static async getMediaMap(category: string) {
    const items = await MediaService.getByDomain(category);
    const map: Record<string, string> = {};
    items.forEach(item => {
      if (item.filename) {
        map[item.filename] = MediaService.getPublicUrl(`${category}/${item.filename}`);
      }
    });
    return map;
  }

  // ТОТ САМЫЙ МЕТОД, который просит тест
  static async findByFilename(category: string, filename: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', category)
      .eq('filename', filename)
      .single();

    if (error) return null;
    return data;
  }
}

export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue),
  getUrlByFilename: (category: string, filename: string) => MediaService.getUrlByFilename(category, filename),
  getMediaMap: (category: string) => MediaService.getMediaMap(category),
  // Добавляем в экспорт:
  findByFilename: (category: string, filename: string) => MediaService.findByFilename(category, filename)
};