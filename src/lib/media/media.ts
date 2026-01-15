// src/lib/media/media.ts
import { MediaAsset, MediaDomain } from './types';
import { getMediaByDomain as getMediaByDomainSupabase, getMediaUrl as getMediaUrlSupabase } from './media.supabase';
import { getMediaByDomain as getMediaByDomainMock, getMediaUrl as getMediaUrlMock } from './media.mock';

const BUCKET = 'media';

export type { MediaDomain };

// Определяем используемую реализацию на основе переменной окружения
const useMockImplementation = process.env.NEXT_PUBLIC_MEDIA_SOURCE === 'mock';

// Экспортируем функции в зависимости от выбранной реализации
export async function getMediaUrl(path: string): Promise<string> {
  if (useMockImplementation) {
    return getMediaUrlMock(path);
  } else {
    return getMediaUrlSupabase(path);
  }
}

export async function getMediaByDomain(domain: MediaDomain): Promise<MediaAsset[]> {
  if (useMockImplementation) {
    return getMediaByDomainMock(domain);
  } else {
    return getMediaByDomainSupabase(domain);
  }
}

export async function getMediaMap(domain: MediaDomain): Promise<Record<string, string>> {
  const assets = await getMediaByDomain(domain);
  const map: Record<string, string> = {};
  
  for (const asset of assets) {
    map[asset.filename] = await getMediaUrl(asset.path);
  }
  
  return map;
}

// Также можно сохранить существующую функцию createMediaService для обратной совместимости
export function createMediaService() {
  return {
    async getByDomain(domain: MediaDomain): Promise<MediaAsset[]> {
      return getMediaByDomain(domain);
    },
    
    async getVideos(): Promise<MediaAsset[]> {
      return getMediaByDomain('video');
    },
    
    async getPhotos(): Promise<MediaAsset[]> {
      return getMediaByDomain('photo');
    },
    
    async getPartners(): Promise<MediaAsset[]> {
      return getMediaByDomain('partner');
    },
    
    async getLogos(): Promise<MediaAsset[]> {
      return getMediaByDomain('logo');
    }
  };
}
