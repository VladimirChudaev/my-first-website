// src/lib/media/storage.contract.ts

import { MediaDomain } from './types';

export interface UploadStorageInput {
  file: File;
  category: MediaDomain;
  filename?: string; // optional
}

export interface IMediaStorage {
  upload(input: UploadStorageInput): Promise<{ path: string }>;
  delete(path: string): Promise<void>;
}
