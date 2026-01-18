import { MediaAsset, MediaDomain } from './types';
import {
  getMediaByDomainMock,
  getMediaUrlMock,
  getMediaByIdMock,
  insertMediaMock,
  updateMediaMock,
  deleteMediaMock,
  updateMediaOrderMock,
} from './media.mock';
import {
  getMediaByDomainSupabase,
  getMediaUrlSupabase,
  getMediaByIdSupabase,
  insertMediaSupabase,
  updateMediaSupabase,
  deleteMediaSupabase,
  updateMediaOrderSupabase,
} from './media.supabase';

const useMock = process.env.NEXT_PUBLIC_MEDIA_SOURCE === 'mock';

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  return useMock
    ? getMediaByDomainMock(domain)
    : getMediaByDomainSupabase(domain);
}

export async function getMediaUrl(path: string): Promise<string> {
  return useMock
    ? getMediaUrlMock(path)
    : getMediaUrlSupabase(path);
}

export async function getMediaMap(
  domain: MediaDomain
): Promise<Record<string, string>> {
  const assets = await getMediaByDomain(domain);
  const map: Record<string, string> = {};

  for (const asset of assets) {
    if (asset.path) {
      try {
        map[asset.filename] = await getMediaUrl(asset.path);
      } catch (error) {
        // Если не удалось получить URL, оставляем пустую строку
        map[asset.filename] = '';
      }
    } else {
      // Если у ассета нет пути, сохраняем пустую строку или исходный filename
      map[asset.filename] = '';
    }
  }

  return map;
}

// Функции для административных операций
export async function getMediaById(id: string) {
  return useMock
    ? getMediaByIdMock(id)
    : getMediaByIdSupabase(id);
}

export async function insertMedia(mediaData: Omit<MediaAsset, 'id'> & { id?: string }) {
  return useMock
    ? insertMediaMock(mediaData)
    : insertMediaSupabase(mediaData);
}

export async function updateMedia(id: string, updates: Partial<Omit<MediaAsset, 'id'>>) {
  return useMock
    ? updateMediaMock(id, updates)
    : updateMediaSupabase(id, updates);
}

export async function deleteMedia(id: string) {
  return useMock
    ? deleteMediaMock(id)
    : deleteMediaSupabase(id);
}

export async function updateMediaOrder(category: MediaDomain, orderedIds: string[]) {
  return useMock
    ? updateMediaOrderMock(category, orderedIds)
    : updateMediaOrderSupabase(category, orderedIds);
}
