import { MediaAsset, MediaDomain } from './types';

interface MediaRow {
  id: string;
  category: string;
  filename: string;
  path?: string | null;
  bucket?: string | null; // В базе может быть null
  alt_text?: string | null;
  title?: string | null;
  description?: string | null; // Добавлено
  credits?: string | null;     // Добавлено
  created_at?: string | null;
  is_visible?: boolean;
  position?: number;
  url?: string | null;
  link?: string | null;
  width?: number | null;
  height?: number | null;
  [key: string]: any;
}

export function mapMediaRow(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    category: row.category as MediaDomain,
    filename: row.filename,
    bucket: row.bucket ?? 'media', // ИСПРАВЛЕНО: теперь поле передается (дефолт 'media')
    path: row.path ?? undefined,
    alt_text: row.alt_text ?? undefined,
    title: row.title ?? undefined,
    description: row.description ?? undefined, // Добавлено
    credits: row.credits ?? undefined,         // Добавлено
    position: row.position ?? 0,
    is_visible: row.is_visible ?? true,
    url: row.url ?? undefined,
    link: row.link ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
  };
}