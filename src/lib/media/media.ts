import { MediaAsset, MediaDomain } from './types';
import {
  getMediaByDomainMock,
  getMediaUrlMock,
} from './media.mock';
import {
  getMediaByDomainSupabase,
  getMediaUrlSupabase,
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
    map[asset.filename] = await getMediaUrl(asset.path);
  }

  return map;
}
