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
  category: MediaDomain;
  filename: string;
  path?: string;
  alt_text?: string;
  url?: string;
  title?: string;
  link?: string;
  position: number;          // ОБЯЗАТЕЛЬНО
  width?: number;
  height?: number;
  is_visible?: boolean;
}
