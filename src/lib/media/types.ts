export type MediaDomain =
  | 'logo'
  | 'partner'
  | 'photo'
  | 'video';

export interface MediaAsset {
  id: string;
  domain: MediaDomain;
  filename: string;
  path: string;
  alt?: string;
  width?: number;
  height?: number;
}