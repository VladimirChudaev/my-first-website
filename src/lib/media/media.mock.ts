import { MediaAsset, MediaDomain } from './types';

export const videoAssets: MediaAsset[] = [
  {
    id: '1',
    category: 'video',
    path: '/vc_ruki.png',
    alt_text: 'Hands project',
    url: 'https://example.com/1',
    filename: 'vc_ruki.png',
    bucket: 'media',
    is_visible: true,
    position: 1,
    width: 1920,
    height: 1080,
  },
  {
    id: '2',
    category: 'video',
    path: '/design_system.png',
    alt_text: 'Design System',
    url: 'https://example.com/2',
    filename: 'design_system.png',
    bucket: 'media',
    is_visible: true,
    position: 2,
    width: 1920,
    height: 1080,
  }
];

// Функции-заглушки с корректными сигнатурами
export const getMediaByDomainMock = async (domain: MediaDomain): Promise<MediaAsset[]> => {
  return videoAssets.filter(asset => asset.category === domain);
};

export const getMediaUrlMock = (path: string): string => {
  return path;
};

export const getMediaByIdMock = async (id: string): Promise<MediaAsset | null> => {
  return videoAssets.find(a => a.id === id) || null;
};

export const insertMediaMock = async (asset: Omit<MediaAsset, 'id'>): Promise<MediaAsset> => {
  const newAsset = { ...asset, id: Math.random().toString(36).substr(2, 9) } as MediaAsset;
  return newAsset;
};

export const updateMediaMock = async (id: string, asset: Partial<MediaAsset>): Promise<MediaAsset> => {
  return { ...videoAssets[0], ...asset, id };
};

export const deleteMediaMock = async (id: string): Promise<void> => {
  return Promise.resolve();
};

// Исправлено: теперь принимает 2 аргумента согласно вызову в media.ts
export const updateMediaOrderMock = async (category: MediaDomain, orderedIds: string[]): Promise<void> => {
  return Promise.resolve();
};

export default videoAssets;