// src/lib/media/types.ts

export type MediaDomain =
  | 'video'
  | 'photo'
  | 'partner'
  | 'award'
  | 'project'
  | 'news'
  | 'logo'
  | 'header'
  | 'footer';

export interface MediaAsset {
  id: string;
  domain: MediaDomain;
  filename: string;
  path: string;
  alt?: string;
  url?: string;
  link?: string;
  order: number;          // ОБЯЗАТЕЛЬНО
  width?: number;
  height?: number;
}
