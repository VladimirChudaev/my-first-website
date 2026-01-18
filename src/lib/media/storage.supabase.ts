import { createClient } from '@/lib/client';
import { IMediaStorage, UploadStorageInput } from './storage.contract';
import { getMediaDimensions } from '../utils/media-dimensions';

const BUCKET = 'media';

export class SupabaseMediaStorage implements IMediaStorage {
  async upload(input: UploadStorageInput): Promise<{ path: string, url?: string, width?: number, height?: number }> {
    const supabase = createClient();

    const filename =
      input.filename ??
      `${Date.now()}-${input.file.name}`;

    // Путь формируется как category/filename для организации файлов внутри бакета
    const path = `${input.category}/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, input.file, {
        upsert: false,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Определяем размеры файла если это изображение или видео
    let dimensions: { width?: number, height?: number } = {};
    if (input.file.type.startsWith('image/') || input.file.type.startsWith('video/')) {
      dimensions = await this.getMediaDimensions(input.file);
    }

    // Генерируем URL для доступа к файлу
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    // Возвращаем полный путь и дополнительные данные
    return {
      path,
      url: publicUrlData?.publicUrl,
      width: dimensions.width,
      height: dimensions.height
    };
  }

  private async getMediaDimensions(file: File): Promise<{ width?: number, height?: number }> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        resolve({});
        URL.revokeObjectURL(url);
      };
      
      // Для видеофайлов нужно использовать HTML5 Video элемент
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        
        video.onloadedmetadata = () => {
          resolve({
            width: video.videoWidth,
            height: video.videoHeight
          });
          URL.revokeObjectURL(url);
        };
        
        video.onerror = () => {
          resolve({});
          URL.revokeObjectURL(url);
        };
        
        video.src = url;
      } else {
        img.src = url;
      }
    });
  }

  async delete(path: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }
}
