export type MediaDomain =
  | 'video'
  | 'photo'
  | 'partner'
  | 'award'
  | 'project'
  | 'news'
  | 'logo'
  | 'header'
  | 'footer'
  | 'film-reserve';

export interface MediaAsset {
  id: string;
  category: MediaDomain;
  filename: string;
  bucket: string;
  path?: string;
  alt_text?: string;
  url?: string;
  title?: string;
  description?: string; // Поле для текста (описания)
  credits?: string;     // Поле для автора/режиссера (титры)
  link?: string;
  position: number;
  width?: number;
  height?: number;
  is_visible: boolean;  // Убрал ?, так как в SQL стоит NOT NULL DEFAULT true
  created_at?: string;  // Полезно добавить для сортировки на фронте
}