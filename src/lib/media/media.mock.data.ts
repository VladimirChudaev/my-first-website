// src/lib/media/media.mock.data.ts

export interface MediaMockItem {
  id: string;
  domain: 'video';
  path: string;
  alt: string;
  link: string;
  order: number;
}

export const videoMockData: MediaMockItem[] = [
  {
    id: 'video-1',
    domain: 'video',
    path: '/videos/video-1.mp4',
    alt: 'Видео 1',
    link: 'https://example.com/video-1',
    order: 1,
  },
  {
    id: 'video-2',
    domain: 'video',
    path: '/videos/video-2.mp4',
    alt: 'Видео 2',
    link: 'https://example.com/video-2',
    order: 2,
  },
];
