import { MediaAsset, MediaDomain } from './types';

interface MediaRow {
  id: string;
  category: string;
  filename: string;
  path?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  position?: number | null;
  link?: string | null;
}

export function mapMediaRow(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    category: row.category as MediaDomain,
    filename: row.filename,
    path: row.path ?? '',
    alt: row.alt ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    position: row.position ?? 0,
    link: row.link ?? undefined,
  };
}
