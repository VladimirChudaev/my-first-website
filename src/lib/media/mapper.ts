import { MediaAsset, MediaDomain } from './types';

interface MediaRow {
  id: string;
  category: string;
  filename: string;
  bucket?: string | null;
  alt_text?: string | null;
  title?: string | null;
  created_at?: string | null;
  is_visible?: boolean;
  position?: number;
  url?: string | null;
  link?: string | null;
  width?: number | null;
  height?: number | null;
  // Добавляем возможность расширения для других возможных полей
  [key: string]: any;
}

export function mapMediaRow(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    category: row.category as MediaDomain,
    filename: row.filename,
    // Поле path не существует в базе данных, формируем его из category и filename
    path: row.category ? `${row.category}/${row.filename}` : undefined,
    alt_text: row.alt_text ?? undefined,
    title: row.title ?? undefined,
    position: row.position ?? 0,
    is_visible: row.is_visible ?? true,
    url: row.url ?? undefined,
    link: row.link ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
  };
}
