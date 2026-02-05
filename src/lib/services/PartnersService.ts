// src/lib/services/PartnersService.ts
import { PartnersRepository } from '../repositories/PartnersRepository';
import { MediaService } from './MediaService';

// Описываем структуру данных, которую получит страница (UI)
export interface PartnerDTO {
  id: string;
  name: string;
  websiteUrl: string | null;
  logoUrl: string;
}

export class PartnersService {
  static async getVisiblePartners(): Promise<PartnerDTO[]> {
    // 1. Получаем данные из репозитория (который ты уже починил)
    const rawPartners = await PartnersRepository.getVisiblePartners();

    // 2. Преобразуем их в понятный для UI вид
    return rawPartners.map(partner => {
      // Извлекаем данные медиа. 
      // Учитываем, что Supabase может вернуть объект или массив в зависимости от связей
      const mediaData = Array.isArray(partner.media) ? partner.media[0] : partner.media;
      
      const path = mediaData?.path || null;
      const bucket = mediaData?.bucket || 'media';

      return {
        id: partner.id,
        name: partner.name,
        websiteUrl: partner.url,
        // Оживляем картинку через MediaService
        logoUrl: MediaService.getPublicUrl(path, bucket),
      };
    });
  }
}