/**
 * Утилиты для определения размеров медиафайлов
 */

interface MediaDimensions {
  width?: number;
  height?: number;
}

/**
 * Определение размеров изображения
 */
export async function getImageDimensions(file: File): Promise<MediaDimensions> {
  return new Promise((resolve, reject) => {
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
      reject(new Error('Could not load image to determine dimensions'));
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  });
}

/**
 * Определение размеров видео
 */
export async function getVideoDimensions(file: File): Promise<MediaDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      });
      URL.revokeObjectURL(url);
    };
    
    video.onerror = () => {
      reject(new Error('Could not load video to determine dimensions'));
      URL.revokeObjectURL(url);
    };
    
    video.src = url;
  });
}

/**
 * Определение размеров медиафайла (универсальная функция)
 */
export async function getMediaDimensions(file: File): Promise<MediaDimensions> {
  if (file.type.startsWith('image/')) {
    try {
      return await getImageDimensions(file);
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return {};
    }
  } else if (file.type.startsWith('video/')) {
    try {
      return await getVideoDimensions(file);
    } catch (error) {
      console.error('Error getting video dimensions:', error);
      return {};
    }
  } else {
    // Для других типов файлов размеры недоступны
    return {};
  }
}