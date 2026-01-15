// src/lib/media/mapper.ts
import { MediaAsset, MediaDomain } from './types';

type DbMediaRow = {
  id: string;
  filename: string;
  bucket: string;
  category: string;
  alt_text: string | null;
  title: string | null;
  position: number;
};

export function mapDbMediaToAsset(row: DbMediaRow): MediaAsset {
  return {
    id: row.id,
    domain: row.category as MediaDomain,
    filename: row.filename,
    path: `${row.filename}`,
    alt: row.alt_text ?? row.title ?? '',
    order: row.position,
  };
}
