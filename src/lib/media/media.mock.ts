import { MediaAsset, MediaDomain } from './types';

// 1. Сами данные
export const videoAssets: MediaAsset[] = [
  {
    id: 'video-1',
    category: 'video',
    path: '/vc_ruki.png',
    alt_text: 'Видео проект',
    url: 'https://example.com',
    filename: 'vc_ruki.png',
    bucket: 'media',
    is_visible: true,
    position: 1,
    width: 1920,
    height: 1080,
  },
  // ... добавь остальные объекты сюда, если они были, 
  // но обязательно с bucket и is_visible
];

// 2. ТЕ САМЫЕ ФУНКЦИИ, КОТОРЫЕ ИЩЕТ СИСТЕМА:
export const getMediaByDomainMock = async (domain: MediaDomain): Promise<MediaAsset[]> => {
  return videoAssets; 
};

export const getMediaUrlMock = (path: string) => path;

export const getMediaByIdMock = async (id: string): Promise<MediaAsset | null> => {
  return videoAssets.find(a => a.id === id) || null;
};

export const insertMediaMock = async (asset: any) => asset;
export const updateMediaMock = async (id: string, asset: any) => asset;
export const deleteMediaMock = async (id: string) => ({ id });
export const updateMediaOrderMock = async (updates: any[]) => updates;

// Дефолтный экспорт для совместимости, если он где-то нужен
export default videoAssets;