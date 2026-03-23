import { MediaAsset } from '../media/types';

export interface VideoProject {
  id: string;
  media_id: string;
  url: string;         // Ссылка на Rutube
  title?: string;      // Название для внутреннего использования
  position: number;    // Порядок в карусели
  is_visible: boolean;
  created_at?: string;
  media?: MediaAsset;  // Данные обложки из таблицы media
}

export interface CreateVideoProjectInput {
  media_id: string;
  url: string;
  title?: string;
  position?: number;
  is_visible?: boolean;
}

export interface UpdateVideoProjectInput {
  media_id?: string;
  url?: string;
  title?: string;
  position?: number;
  is_visible?: boolean;
}