// src/lib/media/media.contract.ts

/**
 * Media Contract — единый источник истины для всего media-layer.
 *
 * Принципы:
 * 1. Контракт null-safe: media-layer ОБЯЗАН возвращать fallback-данные.
 * 2. Client-components НЕ проверяют null / undefined.
 * 3. Любой media-asset всегда можно отрисовать.
 */

/** Домены использования медиа */
export type MediaDomain =
  | 'header'
  | 'footer'
  | 'video'
  | 'photo'
  | 'partner'
  | 'award'
  | 'project'
  | 'news';

/**
 * Базовый контракт медиа-объекта
 * Используется во всех компонентах
 */
export interface MediaAsset {
  /** Уникальный идентификатор */
  id: string;

  /** Домен использования */
  domain: MediaDomain;

  /** Имя файла в storage */
  filename: string;

  /** Локальный или storage-relative путь */
  path: string;

  /** Публичный URL (Supabase Storage или fallback) */
  url: string;

  /** Alt-текст (всегда безопасен) */
  alt: string;

  /** Порядок отображения */
  order: number;

  /** Опциональная ссылка (видео, партнёр, проект и т.п.) */
  link?: string;

  /** Технические параметры (опционально) */
  width?: number;
  height?: number;
}

/**
 * Контракт сервиса media-layer
 * Реализация обязана возвращать fallback при ошибках
 */
export interface MediaService {
  getByDomain(domain: MediaDomain): Promise<MediaAsset[]>;
  getOne(domain: MediaDomain): Promise<MediaAsset>;
}
