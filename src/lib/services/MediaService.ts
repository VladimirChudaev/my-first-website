// src/lib/services/MediaService.ts
import { MediaRepository } from '../repositories/MediaRepository';
import { MediaDomain } from '../media/types';
import { createClient } from '@/lib/client';

export const mediaService = {
  async getByCategory(category: MediaDomain) {
    return await MediaRepository.findByCategory(category);
  },

  async upload(file: File, category: MediaDomain) {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // 1. Загрузка в хранилище
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Прямая запись в таблицу media (вместо сломанного MediaRepository.create)
    const { data, error: dbError } = await supabase
      .from('media')
      .insert([
        {
          filename: fileName,
          path: filePath,
          category: category,
          bucket: 'media',
          is_visible: true
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  },

  getPublicUrl(path: string | null) {
    if (!path) return '/placeholder.png';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
  }
};