import { MediaAsset } from './types';

const videoAssets: MediaAsset[] = [
  {
    id: 'video-1',
    category: 'video',
    path: '/vc_ruki.png',
    alt_text: 'Видео проект',
    url: 'https://example.com',
    filename: 'vc_ruki.png',
    bucket: 'media',      // Добавлено
    is_visible: true,     // Добавлено
    position: 1,
    width: 1920,
    height: 1080,
  },
  {
    id: 'video-2',
    category: 'video',
    path: '/vc_ruki.png',
    alt_text: 'Видео проект',
    url: 'https://example.com',
    filename: 'vc_ruki.png',
    bucket: 'media',      // Добавлено
    is_visible: true,     // Добавлено
    position: 2,
    width: 1920,
    height: 1080,
  },
  // ... ПОВТОРИ эти два поля (bucket и is_visible) для всех остальных объектов в этом массиве
];

export default videoAssets;