import { supabase } from '../supabase/client';

export class MediaService {
  /**
   * Исправлено: используем встроенный метод supabase.storage для генерации URL
   */
  static getPublicUrl(path: string | null, bucket: string = 'media'): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Этот метод надежнее, так как он сам знает базовый URL из конфига supabase
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  static getMediaUrl(media: { path: string } | null): string {
    return media ? this.getPublicUrl(media.path) : '/placeholder.png';
  }

  static async getByDomain(domainValue: string) {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('category', domainValue);

    if (error) {
      console.error('--- [MediaService] Ошибка:', error.message);
      return [];
    }
    return data || [];
  }

  static async upload(file: File, category: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

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

  static async getUrlByFilename(category: string, filename: string) {
    return MediaService.getPublicUrl(`${category}/${filename}`);
  }
}

export const mediaService = {
  getPublicUrl: (path: string | null, bucket?: string) => MediaService.getPublicUrl(path, bucket),
  getMediaUrl: (media: { path: string } | null) => MediaService.getMediaUrl(media),
  getByDomain: (domainValue: string) => MediaService.getByDomain(domainValue),
  upload: (file: File, category: string) => MediaService.upload(file, category),
  getUrlByFilename: (category: string, filename: string) => MediaService.getUrlByFilename(category, filename),
};