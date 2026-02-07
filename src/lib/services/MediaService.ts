// src/lib/services/MediaService.ts
import { MediaRepository } from '../repositories/MediaRepository';
import { MediaDomain } from '../media/types';

export const mediaService = {
  // Исправлено на Category
  async getByCategory(category: MediaDomain) {
    return await MediaRepository.findByCategory(category);
  },

  getPublicUrl(path: string | null) {
    if (!path) return '/placeholder.png';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Используем бакет 'media' из вашего SQL
    return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
  }
};