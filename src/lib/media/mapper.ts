import { MediaAsset } from './types';

/**
 * Converts database records to MediaAsset objects
 * This utility helps map raw data from DB queries to typed MediaAsset interfaces
 */
export function mapDbToMediaAsset(dbRecord: any): MediaAsset {
  return {
    id: dbRecord.id,
    domain: dbRecord.domain,
    filename: dbRecord.filename,
    path: dbRecord.path,
    alt: dbRecord.alt || undefined,
    width: dbRecord.width || undefined,
    height: dbRecord.height || undefined,
  };
}

/**
 * Converts an array of database records to MediaAsset objects
 */
export function mapDbToMediaAssets(dbRecords: any[]): MediaAsset[] {
  return dbRecords.map(mapDbToMediaAsset);
}