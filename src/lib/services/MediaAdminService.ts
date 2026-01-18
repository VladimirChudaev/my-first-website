// src/lib/services/MediaAdminService.ts

import { MediaDomain } from '@/lib/media/types';
import { SupabaseMediaStorage } from '@/lib/media/storage.supabase';
import { IMediaStorage, UploadStorageInput } from '@/lib/media/storage.contract';
import {
  insertMedia,
  updateMedia,
  deleteMedia as deleteMediaFromDB,
  updateMediaOrder
} from '@/lib/media/media';

export interface UploadMediaInput {
  file: File;
  category: MediaDomain;

  filename?: string;
  alt_text?: string;
  link?: string;
  url?: string;
  width?: number;
  height?: number;
  position?: number;
  is_visible?: boolean;
}

export interface UpdateMediaInput {
  id: string;
  alt_text?: string;
  link?: string;
  url?: string;
  width?: number;
  height?: number;
  position?: number;
  is_visible?: boolean;
}

export interface IMediaAdminService {
  upload(input: UploadMediaInput): Promise<void>;
  updateMeta(input: UpdateMediaInput): Promise<void>;
  delete(id: string): Promise<void>;
  reorder(category: MediaDomain, orderedIds: string[]): Promise<void>;
}

export class MediaAdminService implements IMediaAdminService {
  private storage: IMediaStorage;
  
  constructor() {
    this.storage = new SupabaseMediaStorage();
  }

  async upload(input: UploadMediaInput): Promise<void> {
    // Сначала загружаем файл в хранилище
    const storageInput: UploadStorageInput = {
      file: input.file,
      category: input.category,
      filename: input.filename
    };
    
    const { path } = await this.storage.upload(storageInput);
    
    // Затем сохраняем запись в базе данных
    await insertMedia({
      category: input.category,
      filename: input.filename || input.file.name,
      path,
      alt_text: input.alt_text,
      link: input.link,
      url: input.url,
      width: input.width,
      height: input.height,
      position: input.position || 0,
      is_visible: input.is_visible ?? true
    });
  }

  async updateMeta(input: UpdateMediaInput): Promise<void> {
    const updates = {
      alt_text: input.alt_text,
      link: input.link,
      url: input.url,
      width: input.width,
      height: input.height,
      position: input.position,
      is_visible: input.is_visible
    };
    
    await updateMedia(input.id, updates);
  }

  async delete(id: string): Promise<void> {
    // Сначала получаем информацию о медиа-файле из базы данных
    const mediaInfo = await deleteMediaFromDB(id);
    
    // Если запись была найдена, удаляем файл из хранилища
    if (mediaInfo) {
      await this.storage.delete(mediaInfo);
    }
  }

  async reorder(category: MediaDomain, orderedIds: string[]): Promise<void> {
    await updateMediaOrder(category, orderedIds);
  }
}
