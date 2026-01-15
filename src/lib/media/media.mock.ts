import { MediaAsset, MediaDomain } from './types';

export async function getMediaByDomain(
  domain: MediaDomain
): Promise<MediaAsset[]> {
  // Возвращаем заглушечные данные в зависимости от домена
  if (domain === 'video') {
    return [
      {
        id: 'video-1',
        domain: 'video',
        path: '/vc_ruki.png',
        alt: 'Видео проекта Руки',
        url: 'https://rutube.ru/video/f7236d5eba5afc6c560d51efb4da6be7/',
        filename: 'vc_ruki.png',
        order: 0,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-2',
        domain: 'video',
        path: '/vc_ugryumka.png',
        alt: 'Видео проекта Угрюмка',
        url: 'https://rutube.ru/video/550cf890df3c4b96e64582c84a7d1d2/',
        filename: 'vc_ugryumka.png',
        order: 1,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-3',
        domain: 'video',
        path: '/vc_agitbrigada.png',
        alt: 'Видео проекта агитбригада',
        url: 'https://rutube.ru/video/0e8ebff0f52e1b89f2dccc23ba7deb37/',
        filename: 'vc_agitbrigada.png',
        order: 2,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-4',
        domain: 'video',
        path: '/vc_valenki_dm.png',
        alt: 'Видео проекта валенки деда мороза',
        url: 'https://rutube.ru/video/ce0ca8ce4085bbbde2c4dcb9dfba11b5/',
        filename: 'vc_valenki_dm.png',
        order: 3,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-5',
        domain: 'video',
        path: '/vc_aihinger.png',
        alt: 'Видео проекта Карл Айхингер',
        url: 'https://rutube.ru/video/8939de9e366c2064feac69681c54b29f/',
        filename: 'vc_aihinger.png',
        order: 4,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-6',
        domain: 'video',
        path: '/vc_lift.png',
        alt: 'Видео проекта лифт',
        url: 'https://rutube.ru/video/98dc22b8f7bba68fcdddfc1468caea7e/',
        filename: 'vc_lift.png',
        order: 5,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-7',
        domain: 'video',
        path: '/vc_den_theater.png',
        alt: 'Видео проекта день театра',
        url: 'https://rutube.ru/video/697f84970dfbc137a0a6d4dc88833a91/',
        filename: 'vc_den_theater.png',
        order: 6,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-8',
        domain: 'video',
        path: '/vc_fof_agitbrigada.png',
        alt: 'Видео проекта fof агитбригада',
        url: 'https://rutube.ru/video/2534df451f31338409cec4d5fe0c5a9f/',
        filename: 'vc_fof_agitbrigada.png',
        order: 7,
        width: 1920,
        height: 1080,
      },
      {
        id: 'video-9',
        domain: 'video',
        path: '/vc_fof_den_theater.png',
        alt: 'Видео проекта fof день театра',
        url: 'https://rutube.ru/video/f7236d5eba5afc6c560d51efb4da6be7/',
        filename: 'vc_fof_den_theater.png',
        order: 8,
        width: 1920,
        height: 1080,
      },
    ];
  }
  
  // Для других доменов возвращаем пустой массив
  return [];
}

export async function getMediaUrl(path: string): Promise<string> {
  // Для mock версии возвращаем пути как есть, добавляя префикс /public если нужно
  return path.startsWith('/') ? path : `/${path}`;
}

export function createMediaService() {
  return {
    async getVideos(): Promise<MediaAsset[]> {
      return getMediaByDomain('video');
    },
  };
}
