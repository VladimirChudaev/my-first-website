import { MediaAsset, MediaDomain } from './types';

interface MediaRow {
  id: string;
  domain: string;
  filename: string;
  path: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  order?: number | null;
  link?: string | null;
}

export function mapMediaRow(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    domain: row.domain as MediaDomain,
    filename: row.filename,
    path: row.path,
    alt: row.alt ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    order: row.order ?? 0,
    link: row.link ?? undefined,
  };
}
