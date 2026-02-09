import { PartnersRepository, PartnerRecord } from '@/lib/repositories/PartnersRepository';
import { mediaService } from './MediaService'; 
import { MediaAsset } from '../media/types';

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
    const mediaMap: MediaAsset[] = await mediaService.getByCategory('partner');

    return partners.map((partner) => {
      const media = partner.media_id
        ? mediaMap.find((m) => m.id === partner.media_id)
        : null;

      return {
        id: partner.id,
        name: partner.name,
        url: partner.url,
        position: partner.position,
        is_visible: partner.is_visible,
        imageUrl: media ? mediaService.getPublicUrl(media.path || media.filename) : null,
        media_id: partner.media_id
      };
    });
  }

  static async getVisible(): Promise<PartnerDTO[]> {
    const partners = await PartnersRepository.getVisible();
    return this.enrich(partners);
  }

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

    const enriched = await this.enrich([partner]);
    return enriched[0];
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
    const enriched = await this.enrich([partner]);
    return enriched[0];
  }

  static async delete(id: string): Promise<void> {
    await PartnersRepository.delete(id);
  }
}