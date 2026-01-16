# Архитектура медиа-слоя

## Обзор

В проекте реализована новая архитектура для работы с медиа-ресурсами, соответствующая принципам:

- **Разделение ответственностей (Separation of Concerns)**
- **Инверсия зависимостей (Dependency Inversion)**
- **Заменяемость (Replaceability)**

## Слои архитектуры

### 1. Presentation Layer (UI)

**Назначение:** отображение данных

**Разрешено:**
- React / Next компоненты
- props с готовыми данными (URL, текст, id)

**Запрещено:**
- supabase SDK
- process.env
- getPublicUrl / auth / storage

**Пример:**
```tsx
// PartnersCarousel.tsx использует MediaService для получения данных
import { mediaService } from '@/lib/services/MediaService';

const mediaMap = await mediaService.getMediaMap('partner');
```

### 2. Application Layer (Services)

**Назначение:** бизнес-логика и правила

**Пример сервиса:**
```ts
// src/lib/services/MediaService.ts
export class MediaService {
  async getByDomain(domain: MediaDomain): Promise<MediaAsset[]> {
    return await getMediaByDomain(domain);
  }
  
  async getMediaMap(domain: MediaDomain): Promise<Record<string, string>> {
    return await getMediaMap(domain);
  }
}
```

### 3. Data Access Layer (Repositories)

**Назначение:** доступ к данным

**Расположение:** 
- `src/lib/media/media.ts` - основной API
- `src/lib/media/types.ts` - типы
- `src/lib/media/mapper.ts` - преобразование данных

**Функции:**
- `getMediaUrl(path: string)` - получить публичный URL для медиа-файла
- `getMediaByDomain(domain: MediaDomain)` - получить медиа-ресурсы по домену
- `getMediaMap(domain: MediaDomain)` - получить карту имя файла -> URL

### 4. Infrastructure Layer

**Назначение:** конкретные технологии (Supabase)

**Содержит:**
- `createClient()` из `@/lib/client`
- Работа с Supabase Storage и DB

## Архитектурный флаг NEXT_PUBLIC_MEDIA_SOURCE

Для обеспечения гибкости и возможности работы в разных окружениях реализован архитектурный флаг `NEXT_PUBLIC_MEDIA_SOURCE`, который позволяет переключаться между Supabase и Mock реализациями.

### Переменная окружения

```env
# Media source (uncomment one of the following):
# NEXT_PUBLIC_MEDIA_SOURCE=supabase  # для работы с базой
# NEXT_PUBLIC_MEDIA_SOURCE=mock     # для локальной разработки
NEXT_PUBLIC_MEDIA_SOURCE=supabase
```

### Реализации

#### Supabase Implementation (`media.supabase.ts`)
- Подключение к реальной базе данных Supabase
- Использование Supabase Storage для получения URL
- Работа с таблицей `media`
- Экспорт типов `MediaAsset` и `MediaDomain` для соответствия принципу "единого источника истины"
- Экспорт алиасов функций: `getMediaByDomain as getMediaByDomainSupabase` и `getMediaUrl as getMediaUrlSupabase`

#### Mock Implementation (`media.mock.ts`)
- Заглушка без подключения к базе данных
- Возврат предопределенных данных
- Использование локальных путей для медиа-файлов
- Экспорт типов `MediaAsset` и `MediaDomain` для соответствия принципу "единого источника истины"
- Экспорт алиасов функций: `getMediaByDomain as getMediaByDomainMock` и `getMediaUrl as getMediaUrlMock`

### Механизм переключения

Основной файл `src/lib/media/media.ts` использует статические импорты обеих реализаций и условную логику в зависимости от значения флага:

```ts
const useMockImplementation = process.env.NEXT_PUBLIC_MEDIA_SOURCE === 'mock';

export async function getMediaUrl(path: string): Promise<string> {
  if (useMockImplementation) {
    return getMediaUrlMock(path);
  } else {
    return getMediaUrlSupabase(path);
  }
}

export async function getMediaByDomain(domain: MediaDomain): Promise<MediaAsset[]> {
  if (useMockImplementation) {
    return getMediaByDomainMock(domain);
  } else {
    return getMediaByDomainSupabase(domain);
  }
}
```

### Принцип "единого источника истины"

Каждая реализация (mock и supabase) теперь является единым источником истины для своего слоя, экспортируя как функции, так и необходимые типы данных:

```ts
// В каждом файле реализации (media.mock.ts и media.supabase.ts)
export async function getMediaByDomain(/* ... */);
export async function getMediaUrl(/* ... */);
export type { MediaAsset, MediaDomain }; // экспорт типов для соответствия архитектуре
export { getMediaByDomain as getMediaByDomainMock, getMediaUrl as getMediaUrlMock }; // алиасы для mock версии
export { getMediaByDomain as getMediaByDomainSupabase, getMediaUrl as getMediaUrlSupabase }; // алиасы для supabase версии
```

Это позволяет другим компонентам импортировать как функции, так и типы из одного и того же источника, что улучшает согласованность архитектуры.

## Структура медиа-данных

### Сущности (DB)

Таблица `media_assets`:
```
id: uuid (PK)
category: text (logo | partner | photo | video)
filename: text
bucket: text
path: text (может отсутствовать)
alt: text
width: int
height: int
position: int
created_at: timestamp
```

### Типы (types.ts)

```ts
export type MediaDomain =
  | 'video'
  | 'photo'
  | 'partner'
  | 'award'
  | 'project'
  | 'news'
  | 'logo'
  | 'header'
  | 'footer';

export interface MediaAsset {
  id: string;
  category: MediaDomain;
  filename: string;
  path?: string;
  alt?: string;
  url?: string;
  link?: string;
  position: number;
  width?: number;
  height?: number;
}
```

## Принципы работы

### 1. Единый источник истины

Все медиа-ресурсы проходят через `src/lib/media/media.ts`:
```ts
import { getMediaUrl, getMediaByDomain, getMediaMap } from '@/lib/media/media';
```

### 2. Сервер-ориентированность

Все внешние источники данных проходят через сервер:
- URL генерируются только на сервере
- UI получает готовые URL

### 3. Принцип работы с медиа

```
Storage (Supabase/Mock)
↓
MediaRepository (media.ts)
↓
MediaService
↓
Server Component / API
↓
UI Component
```

## Использование

### В компонентах

```tsx
import { mediaService } from '@/lib/services/MediaService';

// Внутри компонента
const mediaMap = await mediaService.getMediaMap('partner');
const imageUrl = mediaMap['filename.png'];
```

### Переключение между режимами

Для переключения между Supabase и Mock режимами измените значение переменной окружения:

```env
# Для работы с Supabase (по умолчанию)
NEXT_PUBLIC_MEDIA_SOURCE=supabase

# Для локальной разработки без базы данных
NEXT_PUBLIC_MEDIA_SOURCE=mock
```

## Преимущества новой архитектуры

1. **Заменяемость**: Supabase может быть заменен без изменения UI
2. **Тестируемость**: компоненты не зависят от инфраструктуры
3. **Централизованное управление**: все медиа-операции в одном месте
4. **Безопасность**: инфраструктурные детали не протекают в UI
5. **Поддерживаемость**: изменения в медиа-слое не влияют на UI
6. **Гибкость**: возможность работы в разных окружениях (локально, тест, прод)
7. **Архитектурный флаг**: динамическое переключение между реализациями

## Обработка ситуаций без базы данных

При значении `NEXT_PUBLIC_MEDIA_SOURCE=mock` система использует заглушку:
- Компоненты получают предопределенные данные
- В консоль не выводятся ошибки подключения к базе
- Все изображения отображаются из папки `/public`

## Статус реализации

- [x] Data Access Layer (media.ts, types.ts, mapper.ts)
- [x] Application Layer (MediaService.ts)
- [x] Обновление компонентов (PartnersCarousel.tsx)
- [x] Удаление статического заголовка из PartnersCarousel.tsx
- [x] Документация
- [x] Архитектурный флаг NEXT_PUBLIC_MEDIA_SOURCE
- [x] Динамический импорт на основе флага
- [x] Алиасы функций для соответствия архитектуре "единого источника истины"

Архитектура полностью реализована и готова к использованию.