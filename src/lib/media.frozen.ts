// src/lib/media.ts

export type MediaDomain = 'video' | 'photo' | 'partner';

export interface MediaAsset {
  id: string;
  category: MediaDomain;
  path: string;
  alt?: string;
  url?: string;
}

/**
 * MediaService — единая точка доступа к медиа
 * Sprint 2: mock-реализация без Supabase
 */
export function createMediaService() {
  return {
    async getVideos(): Promise<MediaAsset[]> {
      const { videos } = await import('@/data/videos');

      return videos.map((video) => ({
        id: video.id,
        category: 'video',
        path: video.cover, // ВАЖНО: используем cover как есть
        alt: video.title,
        url: video.url,
      }));
    },

    async getPhotos(): Promise<MediaAsset[]> {
      return [];
    },

    async getPartners(): Promise<MediaAsset[]> {
      return [];
    },
  };
}
