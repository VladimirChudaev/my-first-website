import { MediaAsset, MediaDomain } from '../media/types';
import { getMediaByDomain, getMediaMap, getMediaUrl } from '../media/media';

/**
 * MediaService - сервис для работы с медиа-данными
 * 
 * Этот сервис реализует Application Layer в архитектуре проекта,
 * обеспечивая централизованную логику работы с медиа-ресурсами.
 */
export class MediaService {
  
  /**
   * Получить все медиа-ресурсы определенной доменной области
   */
  async getByDomain(domain: MediaDomain): Promise<MediaAsset[]> {
    try {
      return await getMediaByDomain(domain);
    } catch (error) {
      console.error(`Error fetching media by domain '${domain}':`, error);
      return [];
    }
  }

  /**
   * Получить карту медиа-ресурсов определенной доменной области
   * где ключ - это имя файла, а значение - публичный URL
   */
  async getMediaMap(domain: MediaDomain): Promise<Record<string, string>> {
    return await getMediaMap(domain);
  }

  /**
   * Найти конкретный медиа-ресурс по имени файла и доменной области
   */
  async findByFilename(domain: MediaDomain, filename: string): Promise<MediaAsset | undefined> {
    const assets = await this.getByDomain(domain);
    return assets.find(asset => asset.filename === filename);
  }

  /**
   * Получить URL для конкретного медиа-ресурса
   */
  async getUrlByFilename(domain: MediaDomain, filename: string): Promise<string | null> {
    const asset = await this.findByFilename(domain, filename);
    if (!asset) {
      return null;
    }
    
    // Возвращаем URL через getMediaUrl
    return await getMediaUrl(asset.path);
  }
}

// Создаем глобальный экземпляр сервиса для удобства использования
export const mediaService = new MediaService();