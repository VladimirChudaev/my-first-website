// Используем абсолютный путь через @
import { PartnersRepository, PartnerRecord } from '@/lib/repositories/PartnersRepository';
import { MediaService } from './MediaService'; 
// (MediaService оставляем так, если он лежит в той же папке services)

export interface PartnerDTO {
  id: string;
  name: string;
  url: string | null;
  position: number;
  is_visible: boolean;
  imageUrl: string | null;
  media_id?: string | null;
}

export class PartnersService {
  private static async enrich(partners: PartnerRecord[]): Promise<PartnerDTO[]> {
    // Получаем все медиа для категории 'partner' один раз, чтобы не спамить запросами
    const mediaMap = await MediaService.getByDomain('partner');

    return partners.map((partner) => {
      const media = partner.media_id
        ? mediaMap.find((m: any) => m.id === partner.media_id)
        : null;

      return {
        id: partner.id,
        name: partner.name,
        url: partner.url,
        position: partner.position,
        is_visible: partner.is_visible,
        imageUrl: media ? MediaService.getPublicUrl(media.path) : null,
        media_id: partner.media_id
      };
    });
  }

  static async getVisible(): Promise<PartnerDTO[]> {
    const partners = await PartnersRepository.getVisible();
    return this.enrich(partners);
  }

  // ТОТ САМЫЙ МЕТОД, КОТОРОГО НЕ ХВАТАЛО БИЛДУ
  static async getAll(): Promise<PartnerDTO[]> {
    const partners = await PartnersRepository.getAll();
    return this.enrich(partners);
  }

  static async create(payload: {
    name: string;
    url?: string | null;
    position?: number;
    is_visible?: boolean;
    media_id?: string | null;
  }): Promise<PartnerDTO> {
    const partner = await PartnersRepository.create({
      name: payload.name,
      url: payload.url ?? null,
      position: payload.position ?? 0,
      is_visible: payload.is_visible ?? true,
      media_id: payload.media_id ?? null,
    });

    const [enriched] = await this.enrich([partner]);
    return enriched;
  }

  static async update(
    id: string,
    payload: {
      name?: string;
      url?: string | null;
      position?: number;
      is_visible?: boolean;
      media_id?: string | null;
    }
  ): Promise<PartnerDTO> {
    const partner = await PartnersRepository.update(id, payload);
    const [enriched] = await this.enrich([partner]);
    return enriched;
  }

  static async delete(id: string): Promise<void> {
    await PartnersRepository.delete(id);
  }
}