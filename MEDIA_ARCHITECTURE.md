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

## Структура медиа-данных

### Сущности (DB)

Таблица `media_assets`:
```
id: uuid (PK)
domain: text (logo | partner | photo | video)
filename: text
bucket: text
path: text
alt: text
width: int
height: int
created_at: timestamp
```

### Типы (types.ts)

```ts
export type MediaDomain = 'logo' | 'partner' | 'photo' | 'video';

export interface MediaAsset {
  id: string;
  domain: MediaDomain;
  filename: string;
  path: string;
  alt?: string;
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
Storage (Supabase)
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

### Пример обновленного компонента

Компонент `PartnersCarousel.tsx` был обновлен для использования новой архитектуры:
- Использует `mediaService.getMediaMap('partner')` вместо статических данных
- Получает актуальные URL для медиа-файлов
- Следует принципу инверсии зависимостей

## Преимущества новой архитектуры

1. **Заменяемость**: Supabase может быть заменен без изменения UI
2. **Тестируемость**: компоненты не зависят от инфраструктуры
3. **Централизованное управление**: все медиа-операции в одном месте
4. **Безопасность**: инфраструктурные детали не протекают в UI
5. **Поддерживаемость**: изменения в медиа-слое не влияют на UI
6. **Гибкость**: реализован механизм fallback для работы без базы данных

## Обработка ситуаций без базы данных

При отсутствии таблицы `media_assets` в базе данных система автоматически использует резервный механизм:
- Компоненты получают данные из локальных файлов (например, `src/data/partners.ts`)
- В консоль выводится предупреждение, но приложение продолжает работать
- Все изображения отображаются из папки `/public`

## Статус реализации

- [x] Data Access Layer (media.ts, types.ts, mapper.ts)
- [x] Application Layer (MediaService.ts)
- [x] Обновление компонентов (PartnersCarousel.tsx)
- [x] Удаление статического заголовка из PartnersCarousel.tsx
- [x] Документация

Архитектура полностью реализована и готова к использованию.